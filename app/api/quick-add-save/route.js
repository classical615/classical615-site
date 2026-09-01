// Step 2 of the Quick Add tool: after you've reviewed the extracted info on the
// page, this actually creates the row in Airtable - always as Status: Pending,
// same as every other way events get added, so nothing goes public automatically.

import { createEventRecord } from '../../../lib/quickAddAirtable.js';

function checkPassword(request) {
  const provided = request.headers.get('x-quick-add-password');
  return provided && provided === process.env.QUICK_ADD_PASSWORD;
}

export async function POST(request) {
  if (!checkPassword(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();

    const fields = {
      'Concert Name': data.title || 'Untitled event - please edit',
      Date: data.date || undefined,
      'Start Time': data.time || undefined,
      Location: data.venue || undefined,
      'Presenter (if not listed)': data.presenter || undefined,
      'Ticket URL': data.ticketLink || data.sourceUrl,
      'Ticket Price': data.ticketPrice || undefined,
      Description: data.description || undefined,
      Status: 'Pending',
      'Submission Source': 'Quick Add (AI-assisted)',
      'Submitted Notes': `Quick-added from ${data.sourceUrl} on ${new Date().toLocaleDateString()}`,
    };

    // Remove any undefined fields so we don't send empty junk to Airtable.
    Object.keys(fields).forEach((key) => fields[key] === undefined && delete fields[key]);

    const result = await createEventRecord(fields);
    return Response.json({ success: true, record: result });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
