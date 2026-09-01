// Step 1 of the Quick Add tool: given a URL, fetches that page and asks Claude
// to read it and pull out the concert details as clean, structured data.
// This doesn't touch Airtable at all - it just returns a preview for you to
// look over before anything gets saved.

export const maxDuration = 60;

function checkPassword(request) {
  const provided = request.headers.get('x-quick-add-password');
  return provided && provided === process.env.QUICK_ADD_PASSWORD;
}

// Strips out script/style tags and excess whitespace, then trims to a
// reasonable length - keeps the AI's job focused and keeps costs low.
function cleanHtmlForExtraction(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 15000);
}

const EXTRACTION_PROMPT = `You are helping extract concert/event information from a webpage's HTML.
Read the HTML below and return ONLY a JSON object (no markdown code fences, no extra text) with these exact keys:

{
  "title": "the event/concert name",
  "date": "YYYY-MM-DD format, or null if you can't find one",
  "time": "plain text like '7:30 PM', or null if you can't find one",
  "venue": "the venue/location name, or null",
  "presenter": "the organization or ensemble presenting it, or null",
  "description": "a plain-text description of the event, 2-4 sentences, no HTML tags",
  "ticketLink": "a URL to buy tickets if you can find one, or null",
  "ticketPrice": "price like '$25' or 'Free', or null"
}

If you genuinely cannot find a piece of information, use null for that field rather than guessing.

HTML content:
`;

export async function POST(request) {
  if (!checkPassword(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { url } = await request.json();
    if (!url) {
      return Response.json({ error: 'No URL provided' }, { status: 400 });
    }

    const pageRes = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Classical615QuickAdd/1.0)' },
    });
    if (!pageRes.ok) {
      return Response.json({ error: `Could not load that page (${pageRes.status})` }, { status: 400 });
    }
    const html = await pageRes.text();
    const cleanedHtml = cleanHtmlForExtraction(html);

    const aiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        messages: [{ role: 'user', content: EXTRACTION_PROMPT + cleanedHtml }],
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      return Response.json({ error: `AI extraction failed: ${errText.slice(0, 300)}` }, { status: 500 });
    }

    const aiData = await aiRes.json();
    const rawText = aiData.content?.[0]?.text || '{}';

    let extracted;
    try {
      extracted = JSON.parse(rawText);
    } catch {
      return Response.json({ error: 'Could not understand the AI response - try again' }, { status: 500 });
    }

    return Response.json({ ...extracted, sourceUrl: url });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
