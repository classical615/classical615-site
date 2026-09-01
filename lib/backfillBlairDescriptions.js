// A one-time cleanup task: goes through every Blair event already in Airtable,
// checks the current RSS feed, and fills in the FULL description on any row that
// still has the old shortened (500-character) version. Doesn't touch anything else
// on those rows - not the date, not the ticket link, nothing but Description.

import { scrapeBlair } from './scrapeBlair.js';
import { listAllBlairEvents, updateEventRecord } from './blairAirtable.js';

export async function backfillBlairDescriptions() {
  const scraped = await scrapeBlair();
  const bySourceId = new Map(scraped.map((item) => [String(item.sourceId), item]));

  const existingRecords = await listAllBlairEvents();

  const summary = { updated: [], skipped: [], errors: [] };

  for (const record of existingRecords) {
    const match = (record.fields['Internal Notes'] || '').match(/BLAIR-ID:(\d+)/);
    if (!match) continue;
    const sourceId = match[1];

    const freshItem = bySourceId.get(sourceId);
    if (!freshItem) {
      summary.skipped.push({ id: record.id, title: record.fields['Concert Name'], reason: 'not in current feed' });
      continue;
    }

    const currentDescription = record.fields['Description'] || '';
    if (currentDescription === freshItem.description) {
      summary.skipped.push({ id: record.id, title: record.fields['Concert Name'], reason: 'already up to date' });
      continue;
    }

    try {
      await updateEventRecord(record.id, { Description: freshItem.description });
      summary.updated.push({ id: record.id, title: record.fields['Concert Name'] });
    } catch (err) {
      summary.errors.push({ id: record.id, title: record.fields['Concert Name'], error: err.message });
    }
  }

  return summary;
}