// Visit: https://your-site.com/api/test-scrape-blair?limit=1
// Same safe pattern as the Nashville Symphony scraper - test on ONE event first.

import { runBlairScrape } from '../../../lib/runBlairScrape.js';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get('limit');
  const testLimit = limitParam ? parseInt(limitParam, 10) : 1;

  try {
    const summary = await runBlairScrape({ testLimit });
    return Response.json(summary);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
