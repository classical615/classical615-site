// App Router version of the endpoint Vercel's weekly Cron Job calls automatically.
// Protected by a secret so random visitors can't trigger it themselves.

import { runScrape } from '../../../../lib/runScrape.js';

export async function GET(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const summary = await runScrape({});
    console.log('Nashville Symphony scrape complete:', summary);
    return Response.json(summary);
  } catch (err) {
    console.error('Nashville Symphony scrape failed:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
