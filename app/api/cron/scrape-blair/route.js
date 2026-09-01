// Weekly automated Blair scrape. Uses the same CRON_SECRET as the Nashville
// Symphony scraper - no new secret needed.

import { runBlairScrape } from '../../../../lib/runBlairScrape.js';

export async function GET(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const summary = await runBlairScrape({});
    console.log('Blair scrape complete:', summary);
    return Response.json(summary);
  } catch (err) {
    console.error('Blair scrape failed:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
