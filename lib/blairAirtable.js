// Same approach as the Nashville Symphony scraper's Airtable helpers, kept as its own
// file so the two scrapers stay fully independent of each other.

const BASE_URL = 'https://api.airtable.com/v0';

function headers() {
  return {
    Authorization: `Bearer ${process.env.AIRTABLE_SCRAPER_API_KEY}`,
    'Content-Type': 'application/json',
  };
}

function baseId() {
  return process.env.AIRTABLE_BASE_ID;
}

function eventsTableName() {
  return process.env.AIRTABLE_EVENTS_TABLE || 'Events';
}

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

// Blair events are tagged "BLAIR-ID:xxxx" in Internal Notes, distinct from the
// Nashville Symphony scraper's "NSO-ID:xxxx" tags, so the two never collide.
export async function findExistingEventByTag(sourceId) {
  const tag = `BLAIR-ID:${sourceId}`;
  const formula = encodeURIComponent(`FIND("${tag}", {Internal Notes})`);
  const url = `${BASE_URL}/${baseId()}/${encodeURIComponent(eventsTableName())}?filterByFormula=${formula}&maxRecords=1`;
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) {
    throw new Error(`Airtable dedupe check failed: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return data.records.length > 0 ? data.records[0] : null;
}

export async function updateEventRecord(recordId, fields) {
  const url = `${BASE_URL}/${baseId()}/${encodeURIComponent(eventsTableName())}/${recordId}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: headers(),
    body: JSON.stringify({ fields, typecast: true }),
  });
  if (!res.ok) {
    throw new Error(`Airtable update failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

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

// Finds every Events row that was created by this scraper (tagged "BLAIR-ID:..."
// in Internal Notes), across as many pages as needed. Used for one-time cleanup
// tasks like backfilling full descriptions onto older rows.
export async function listAllBlairEvents() {
  const formula = encodeURIComponent(`FIND("BLAIR-ID:", {Internal Notes})`);
  let records = [];
  let offset;
  do {
    const offsetParam = offset ? `&offset=${offset}` : '';
    const url = `${BASE_URL}/${baseId()}/${encodeURIComponent(eventsTableName())}?filterByFormula=${formula}&pageSize=100${offsetParam}`;
    const res = await fetch(url, { headers: headers() });
    if (!res.ok) {
      throw new Error(`Airtable list failed: ${res.status} ${await res.text()}`);
    }
    const data = await res.json();
    records = records.concat(data.records);
    offset = data.offset;
  } while (offset);
  return records;
}