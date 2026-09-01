// This talks directly to the Nashville Symphony's own data feed (the same one their
// website quietly uses behind the scenes to show the concert list). No browser needed
// at all anymore - just a normal, plain web request, same as any other API call.

const API_URL = 'https://tickets.nashvillesymphony.org/api/products/productionseasons';

// These match the checkbox categories on their site. Sending all of them mirrors what
// the site sends by default with nothing specifically filtered out.
const ALL_KEYWORDS = [
  'Classical', 'Presentation', 'Pops', 'Special', 'Movie',
  'Family', 'Community', 'Fundraiser', 'Wellness', 'Summer',
];

// Strips HTML tags out of the description text (their descriptions come formatted
// with <p>, <strong>, <a> tags etc.), leaving clean readable plain text.
function stripHtml(html) {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&#160;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function scrapeNashvilleSymphony() {
  const now = new Date();
  const twoYearsOut = new Date();
  twoYearsOut.setFullYear(now.getFullYear() + 2);

  const params = new URLSearchParams();
  params.append('startDate', now.toISOString());
  params.append('endDate', twoYearsOut.toISOString());
  for (const keyword of ALL_KEYWORDS) {
    params.append('keywords[]', keyword);
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: params.toString(),
  });

  if (!res.ok) {
    const bodyText = await res.text();
    throw new Error(`Nashville Symphony data feed request failed: ${res.status} ${bodyText.slice(0, 300)}`);
  }

  const productions = await res.json();
  const events = [];

  for (const production of productions) {
    const performances = production.performances || [];
    for (const perf of performances) {
      events.push({
        title: production.productionTitle,
        displayDate: perf.displayDate,
        displayTime: perf.displayTime,
        isoDateTime: perf.iso8601DateString, // e.g. "2026-09-05T19:30:00"
        ticketLink: perf.actionUrl || production.actionUrl || perf.productionSeasonActionUrl,
        description: stripHtml(production.description || ''),
        sourceId: perf.id, // unique performance ID - used to avoid duplicate adds
      });
    }
  }

  return events;
}