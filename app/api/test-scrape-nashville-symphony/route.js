// Visit: https://your-site.com/api/test-scrape-nashville-symphony?limit=1
// Start with limit=1 so it only writes ONE row to your real Events table.

import { runScrape } from '../../../lib/runScrape.js';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get('limit');
  const testLimit = limitParam ? parseInt(limitParam, 10) : 1;

  try {
    const summary = await runScrape({ testLimit });
    return Response.json(summary);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
