import { scrapeBlair } from './scrapeBlair.js';
import { findLinkedRecordId, findExistingEventByTag, updateEventRecord, createEventRecord } from './blairAirtable.js';

const PRESENTER_NAME = 'Vanderbilt Blair School of Music';

// Tries Location as a linked record first, falls back to plain text if that's what
// your Location field actually is (or if there's no matching Venue record at all).
async function createEventWithLocationFallback(fields, locationFieldName, locationValue, locationRecordId) {
  if (locationRecordId) {
    // We found a matching Venue record - try linking to it.
    const withLinkedLocation = { ...fields, [locationFieldName]: [locationRecordId] };
    try {
      return await createEventRecord(withLinkedLocation);
    } catch (err) {
      if (String(err.message).includes('INVALID_VALUE_FOR_COLUMN')) {
        // Location turned out to be plain text, not a linked field - retry as text.
        const withTextLocation = { ...fields, [locationFieldName]: locationValue };
        return await createEventRecord(withTextLocation);
      }
      throw err;
    }
  }

  // No matching Venue record was found at all - just write the venue name as plain
  // text so the information isn't lost. If Location turns out to actually be a
  // linked field only (rejecting plain text), leave it out entirely rather than fail.
  try {
    return await createEventRecord({ ...fields, [locationFieldName]: locationValue });
  } catch (err) {
    if (String(err.message).includes('INVALID_VALUE_FOR_COLUMN')) {
      return await createEventRecord(fields);
    }
    throw err;
  }
}

export async function runBlairScrape({ testLimit } = {}) {
  const scraped = await scrapeBlair();
  const toProcess = testLimit ? scraped.slice(0, testLimit) : scraped;

  const contactsTable = process.env.AIRTABLE_CONTACTS_TABLE || 'Contacts';
  const venuesTable = process.env.AIRTABLE_VENUES_TABLE || 'Venues';

  const presenterRecordId = await findLinkedRecordId(contactsTable, 'Organization', PRESENTER_NAME);

  const summary = { added: [], updated: [], skipped: [], errors: [] };

  for (const item of toProcess) {
    try {
      if (!item.sourceId || !item.isoDate) {
        summary.errors.push({ title: item.title, error: 'Missing ID or date - skipped' });
        continue;
      }

      // Each Blair concert may be at a different venue, so we look it up per-item
      // (unlike Nashville Symphony, which is always at the same hall).
      const venueRecordId = item.venueName
        ? await findLinkedRecordId(venuesTable, 'Venue Name', item.venueName)
        : null;

      const newDate = item.isoDate;
      const newTime = item.displayTime;

      const existing = await findExistingEventByTag(item.sourceId);

      if (existing) {
        const existingDate = existing.fields['Date'];
        const existingTime = existing.fields['Start Time'];
        const dateChanged = existingDate && newDate && existingDate !== newDate;
        const timeChanged = existingTime && newTime && existingTime !== newTime;

        if (dateChanged || timeChanged) {
          const changeNote = `⚠️ Rescheduled on ${new Date().toLocaleDateString()}: was ${existingDate} ${existingTime}, now ${newDate} ${newTime}`;
          const updatedNotes = `${existing.fields['Internal Notes'] || ''}\n${changeNote}`.trim();

          await updateEventRecord(existing.id, {
            Date: newDate,
            'Start Time': newTime,
            'Internal Notes': updatedNotes,
          });

          summary.updated.push({ title: item.title, oldDate: `${existingDate} ${existingTime}`, newDate: `${newDate} ${newTime}` });
        } else {
          summary.skipped.push({ title: item.title, date: newDate, reason: 'already in Airtable, no change' });
        }
        continue;
      }

      const fields = {
        'Concert Name': item.title,
        Date: newDate,
        'Start Time': newTime,
        'Ticket URL': item.ticketLink,
        'Ticket Price': item.ticketPrice,
        Description: item.description,
        Status: 'Pending',
        'Submission Source': 'Web Scrape',
        'Submitted Notes': `Auto-imported from Blair School of Music RSS feed on ${new Date().toLocaleDateString()}`,
        'Internal Notes': `BLAIR-ID:${item.sourceId}${venueRecordId || !item.venueName ? '' : ' | Venue not auto-linked - please set Location manually'}`,
      };

      if (presenterRecordId) {
        fields['Presenter'] = [presenterRecordId];
      } else {
        fields['Presenter (if not listed)'] = PRESENTER_NAME;
      }

      await createEventWithLocationFallback(fields, 'Location', item.venueName, venueRecordId);

      summary.added.push({ title: item.title, date: newDate });
    } catch (err) {
      summary.errors.push({ title: item.title, date: item.isoDate, error: err.message });
    }
  }

  return summary;
}