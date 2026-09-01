// Same pattern as the other scrapers' Airtable helpers, kept separate so nothing
// here can interfere with the automated scrapers.

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
