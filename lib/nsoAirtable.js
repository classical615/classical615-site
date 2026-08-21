// Small helper functions for talking to your Airtable base.
// No Airtable library needed - just plain web requests, so there's nothing extra to install.

const BASE_URL = 'https://api.airtable.com/v0';

function headers() {
  return {
    Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
    'Content-Type': 'application/json',
  };
}

function baseId() {
  return process.env.AIRTABLE_BASE_ID;
}

// Matches the naming convention already used elsewhere in your project
// (e.g. AIRTABLE_EVENTS_TABLE) - falls back to "Events" if not set.
function eventsTableName() {
  return process.env.AIRTABLE_EVENTS_TABLE || 'Events';
}

// Looks for an existing record in a table whose primary "Name" field exactly matches
// the text we're looking for (e.g. "Nashville Symphony" in your Contacts table).
// Returns the record ID if found, or null if not - it never creates a new one.
// This is on purpose: we don't want the scraper silently adding duplicate
// presenters/venues to your Contacts or Venues tables.
export async function findLinkedRecordId(tableName, nameFieldName, value) {
  if (!value) return null;
  const formula = encodeURIComponent(`{${nameFieldName}} = "${value.replace(/"/g, '\\"')}"`);
  const url = `${BASE_URL}/${baseId()}/${encodeURIComponent(tableName)}?filterByFormula=${formula}&maxRecords=1`;
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) {
    throw new Error(`Airtable lookup failed for ${tableName}: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return data.records.length > 0 ? data.records[0].id : null;
}

// Checks whether we've already scraped this exact performance before, by searching
// the Internal Notes field for a tag like "NSO-ID:10358". This is how the weekly
// automation avoids adding the same concert twice.
export async function eventAlreadyExists(sourceId) {
  const tag = `NSO-ID:${sourceId}`;
  const formula = encodeURIComponent(`FIND("${tag}", {Internal Notes})`);
  const url = `${BASE_URL}/${baseId()}/${encodeURIComponent(eventsTableName())}?filterByFormula=${formula}&maxRecords=1`;
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) {
    throw new Error(`Airtable dedupe check failed: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return data.records.length > 0;
}

// Creates one new row in your Events table.
// typecast: true lets Airtable auto-match/create simple dropdown option values
// (like a new Submission Source option) without us having to guess the exact
// existing option text ahead of time.
export async function createEventRecord(fields) {
  const url = `${BASE_URL}/${baseId()}/${encodeURIComponent(eventsTableName())}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ records: [{ fields }], typecast: true }),
  });
  if (!res.ok) {
    throw new Error(`Airtable create failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}
