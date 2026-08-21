import { scrapeNashvilleSymphony } from './scrapeNashvilleSymphony.js';
import { findLinkedRecordId, eventAlreadyExists, createEventRecord } from './nsoAirtable.js';

const PRESENTER_NAME = 'Nashville Symphony';
const DEFAULT_VENUE_NAME = 'Schermerhorn Symphony Center';

// Turns "September 11, 2026" + "7:30PM" into a real date object,
// then formats it the way your Date field expects (YYYY-MM-DD) and
// a plain time string for Start Time.
function parseDateTime(dateText, timeText) {
  const parsed = new Date(`${dateText} ${timeText}`);
  if (isNaN(parsed.getTime())) {
    return { isoDate: null, formattedTime: timeText };
  }
  const isoDate = parsed.toISOString().slice(0, 10);
  return { isoDate, formattedTime: timeText };
}

// Tries to write the Location field as a linked record first (array of record IDs).
// If Airtable rejects that (because Location is actually plain text, not a link),
// it automatically retries as a plain text value instead - so this works either way
// without us having to know in advance.
async function createEventWithLocationFallback(fields, locationFieldName, locationValue, locationRecordId) {
  const withLinkedLocation = { ...fields };
  if (locationRecordId) {
    withLinkedLocation[locationFieldName] = [locationRecordId];
  }

  try {
    return await createEventRecord(withLinkedLocation);
  } catch (err) {
    if (locationRecordId && String(err.message).includes('INVALID_VALUE_FOR_COLUMN')) {
      // Location isn't a linked field after all - retry with plain text.
      const withTextLocation = { ...fields, [locationFieldName]: locationValue };
      return await createEventRecord(withTextLocation);
    }
    throw err;
  }
}

// testLimit: pass 1 while we're testing, so it only touches ONE row in your live table.
// Pass undefined/0 for the full run.
export async function runScrape({ testLimit } = {}) {
  const scraped = await scrapeNashvilleSymphony();
  const toProcess = testLimit ? scraped.slice(0, testLimit) : scraped;

  const contactsTable = process.env.AIRTABLE_CONTACTS_TABLE || 'Contacts';
  const venuesTable = process.env.AIRTABLE_VENUES_TABLE || 'Venues';

  const presenterRecordId = await findLinkedRecordId(contactsTable, 'Name', PRESENTER_NAME);
  const venueRecordId = await findLinkedRecordId(venuesTable, 'Name', DEFAULT_VENUE_NAME);

  const summary = { added: [], skipped: [], errors: [] };

  for (const item of toProcess) {
    try {
      const alreadyExists = await eventAlreadyExists(item.sourceId);
      if (alreadyExists) {
        summary.skipped.push({ title: item.title, date: item.date, reason: 'already in Airtable' });
        continue;
      }

      const { isoDate, formattedTime } = parseDateTime(item.date, item.time);

      const fields = {
        'Concert Name': item.title,
        Date: isoDate || item.date,
        'Start Time': formattedTime,
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

      summary.added.push({ title: item.title, date: item.date });
    } catch (err) {
      summary.errors.push({ title: item.title, date: item.date, error: err.message });
    }
  }

  return summary;
}
