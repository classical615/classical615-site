// Small helper functions for talking to your Airtable base.
// No Airtable library needed - just plain web requests.

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

function eventsTableName() {
  return process.env.AIRTABLE_EVENTS_TABLE || 'Events';
}

// Looks for an existing record in a table whose primary "Name" field exactly matches
// the text we're looking for (e.g. "Nashville Symphony" in your Contacts table).
// Returns the record ID if found, or null if not - it never creates a new one.
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
// the Internal Notes field for a tag like "NSO-ID:10358".
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
// typecast: true lets Airtable auto-match/create simple dropdown option values.
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
