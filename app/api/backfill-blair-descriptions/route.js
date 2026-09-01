// Visit once: https://your-site.com/api/backfill-blair-descriptions
// Fills in full descriptions on any already-scraped Blair events that still have
// the old shortened version. Safe to run more than once. One-time cleanup tool -
// feel free to delete this whole folder once you've used it.

export const maxDuration = 60;

import { backfillBlairDescriptions } from '../../../lib/backfillBlairDescriptions.js';

export async function GET() {
  try {
    const summary = await backfillBlairDescriptions();
    return Response.json(summary);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}