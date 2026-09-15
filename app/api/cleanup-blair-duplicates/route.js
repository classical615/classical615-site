// ONE-TIME CLEANUP for duplicate Blair rows in Airtable.
//
// Step 1 (safe, changes nothing):  https://classical615.com/api/cleanup-blair-duplicates
// Step 2 (actually deletes):        https://classical615.com/api/cleanup-blair-duplicates?confirm=DELETE
//
// Delete this file from GitHub once you're done with it.

const BASE_ID = process.env.AIRTABLE_BASE_ID || 'appFeVe6brZ3ko9Ww';
const EVENTS_TABLE = process.env.AIRTABLE_EVENTS_TABLE || 'Events';
const API_KEY = process.env.AIRTABLE_SCRAPER_API_KEY;

const headers = { Authorization: `Bearer ${API_KEY}` };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Pulls every row that has a BLAIR-ID tag, one page at a time.
async function fetchAllBlairRows() {
  const rows = [];
  let offset = null;

  do {
    const params = new URLSearchParams({
      filterByFormula: `FIND("BLAIR-ID:", {Internal Notes})`,
      pageSize: '100',
    });
    ['Concert Name', 'Date', 'Start Time', 'Status', 'Internal Notes'].forEach((f) => params.append('fields[]', f));
    if (offset) params.set('offset', offset);

    const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(EVENTS_TABLE)}?${params}`, { headers });
    if (!res.ok) throw new Error(`Airtable read failed: ${res.status} ${await res.text()}`);
    const data = await res.json();

    rows.push(...data.records);
    offset = data.offset || null;
    await sleep(250);
  } while (offset);

  return rows;
}

async function deleteRows(ids) {
  // Airtable lets us delete 10 at a time.
  for (let i = 0; i < ids.length; i += 10) {
    const batch = ids.slice(i, i + 10);
    const params = new URLSearchParams();
    batch.forEach((id) => params.append('records[]', id));

    const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(EVENTS_TABLE)}?${params}`, {
      method: 'DELETE',
      headers,
    });
    if (!res.ok) throw new Error(`Airtable delete failed: ${res.status} ${await res.text()}`);
    await sleep(250);
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const reallyDelete = searchParams.get('confirm') === 'DELETE';

  try {
    if (!API_KEY) throw new Error('AIRTABLE_SCRAPER_API_KEY is not set');

    const rows = await fetchAllBlairRows();

    // Group rows by their BLAIR-ID number.
    const groups = {};
    for (const row of rows) {
      const match = String(row.fields['Internal Notes'] || '').match(/BLAIR-ID:(\d+)/);
      if (!match) continue;
      const id = match[1];
      (groups[id] = groups[id] || []).push(row);
    }

    const toDelete = [];
    const kept = [];

    for (const [blairId, group] of Object.entries(groups)) {
      if (group.length < 2) continue;

      // Oldest first, so "keep the older one" is a simple fallback.
      group.sort((a, b) => new Date(a.createdTime) - new Date(b.createdTime));

      const keeper =
        group.find((r) => r.fields['Status'] && r.fields['Status'] !== 'Pending') || // never delete an approved row
        group.find((r) => String(r.fields['Internal Notes'] || '').includes('Rescheduled')) ||
        group[0];

      kept.push({ blairId, name: keeper.fields['Concert Name'], date: keeper.fields['Date'], status: keeper.fields['Status'] });

      for (const r of group) {
        if (r.id === keeper.id) continue;
        if (r.fields['Status'] && r.fields['Status'] !== 'Pending') continue; // extra safety
        toDelete.push({ id: r.id, blairId, name: r.fields['Concert Name'], date: r.fields['Date'], status: r.fields['Status'] });
      }
    }

    if (reallyDelete && toDelete.length > 0) {
      await deleteRows(toDelete.map((r) => r.id));
    }

    return Response.json({
      mode: reallyDelete ? 'DELETED' : 'DRY RUN - nothing changed. Add ?confirm=DELETE to the URL to delete.',
      totalBlairRows: rows.length,
      duplicateGroups: kept.length,
      rowsDeleted: reallyDelete ? toDelete.length : 0,
      wouldDelete: toDelete,
      keeping: kept,
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
