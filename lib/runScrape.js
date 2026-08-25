import { scrapeNashvilleSymphony } from './scrapeNashvilleSymphony.js';
import { findLinkedRecordId, findExistingEventByTag, updateEventRecord, createEventRecord } from './nsoAirtable.js';

const PRESENTER_NAME = 'Nashville Symphony';
const DEFAULT_VENUE_NAME = 'Schermerhorn Symphony Center';

// Tries to write the Location field as a linked record first (array of record IDs).
// If Airtable rejects that (because Location is actually plain text, not a link),
// it automatically retries as a plain text value instead.
async function createEventWithLocationFallback(fields, locationFieldName, locationValue, locationRecordId) {
  const withLinkedLocation = { ...fields };
  if (locationRecordId) {
    withLinkedLocation[locationFieldName] = [locationRecordId];
  }

  try {
    return await createEventRecord(withLinkedLocation);
  } catch (err) {
    if (locationRecordId && String(err.message).includes('INVALID_VALUE_FOR_COLUMN')) {
      const withTextLocation = { ...fields, [locationFieldName]: locationValue };
      return await createEventRecord(withTextLocation);
    }
    throw err;
  }
}

// testLimit: pass 1 while we're testing, so it only touches ONE row in your live table.
export async function runScrape({ testLimit } = {}) {
  const scraped = await scrapeNashvilleSymphony();
  const toProcess = testLimit ? scraped.slice(0, testLimit) : scraped;

  const contactsTable = process.env.AIRTABLE_CONTACTS_TABLE || 'Contacts';
  const venuesTable = process.env.AIRTABLE_VENUES_TABLE || 'Venues';

  const presenterRecordId = await findLinkedRecordId(contactsTable, 'Organization', PRESENTER_NAME);
  const venueRecordId = await findLinkedRecordId(venuesTable, 'Venue Name', DEFAULT_VENUE_NAME);

  const summary = { added: [], updated: [], skipped: [], errors: [] };

  for (const item of toProcess) {
    try {
      // isoDateTime looks like "2026-09-05T19:30:00" - split into a Date and a Time.
      const [isoDate] = (item.isoDateTime || '').split('T');
      const newDate = isoDate || item.displayDate;
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
          summary.skipped.push({ title: item.title, date: item.displayDate, reason: 'already in Airtable, no change' });
        }
        continue;
      }

      const fields = {
        'Concert Name': item.title,
        Date: newDate,
        'Start Time': newTime,
        'Ticket URL': item.ticketLink,
        Description: item.description,
        Status: 'Pending',
        'Submission Source': 'Web Scrape',
        'Submitted Notes': `Auto-imported from nashvillesymphony.org on ${new Date().toLocaleDateString()}`,
        'Internal Notes': `NSO-ID:${item.sourceId}${venueRecordId ? '' : ' | Venue not auto-linked - please set Location manually'}`,
      };

      if (presenterRecordId) {
        fields['Presenter'] = [presenterRecordId];
      } else {
        fields['Presenter (if not listed)'] = PRESENTER_NAME;
      }

      await createEventWithLocationFallback(fields, 'Location', DEFAULT_VENUE_NAME, venueRecordId);

      summary.added.push({ title: item.title, date: item.displayDate });
    } catch (err) {
      summary.errors.push({ title: item.title, date: item.displayDate, error: err.message });
    }
  }

  return summary;
}