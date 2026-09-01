// Pulls concerts from the Blair School of Music's official RSS feed and turns them
// into a clean list, ready to send to Airtable. RSS is a proper, purpose-built feed
// format - no browser needed, no hidden data feed to hunt for, just a plain request
// and a parser built for exactly this job.

import { XMLParser } from 'fast-xml-parser';

const RSS_URL =
  'https://events.vanderbilt.edu/live/rss/events/exclude_group/School%20of%20Medicine/category/Arts/tag/blair/header/Arts%20Events';

// Strips HTML tags out of the rich description text, leaving clean readable text.
function stripHtml(html) {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&#160;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#xD;/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Pulls out something like "$18.50" from the description, or "Free" if it says
// "free event". Returns null if neither is found.
function extractTicketPrice(plainText) {
  const priceMatch = plainText.match(/\$\d+(\.\d{2})?/);
  if (priceMatch) return priceMatch[0];
  if (/free event/i.test(plainText)) return 'Free';
  return null;
}

// Tries to find the actual "Purchase Tickets" link inside the description HTML.
// Falls back to the event's own page link if there isn't one.
function extractTicketLink(rawHtml, fallbackLink) {
  const match = rawHtml.match(/<a href="([^"]+)"[^>]*>\s*Purchase Tickets/i);
  return match ? match[1] : fallbackLink;
}

// Converts the RSS pubDate (given in UTC) into the actual local date and time in
// Nashville, since that's what the feed's timezone field says every event uses.
function toLocalDateAndTime(pubDate) {
  const date = new Date(pubDate);
  if (isNaN(date.getTime())) return { localDate: null, localTime: null };

  const dateFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Chicago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return {
    localDate: dateFormatter.format(date), // e.g. "2026-09-01"
    localTime: timeFormatter.format(date), // e.g. "7:30 PM"
  };
}

export async function scrapeBlair() {
  const res = await fetch(RSS_URL);
  if (!res.ok) {
    throw new Error(`Blair RSS feed request failed: ${res.status}`);
  }
  const xmlText = await res.text();

  const parser = new XMLParser({
    ignoreAttributes: false,
    cdataPropName: '__cdata',
  });
  const parsed = parser.parse(xmlText);

  const rawItems = parsed?.rss?.channel?.item;
  const items = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : [];

  return items.map((item) => {
    const rawDescription =
      typeof item.description === 'object' ? item.description.__cdata : item.description || '';
    const plainDescription = stripHtml(rawDescription);
    const { localDate, localTime } = toLocalDateAndTime(item.pubDate);

    return {
      title: item.title,
      isoDate: localDate,
      displayTime: localTime,
      ticketLink: extractTicketLink(rawDescription, item.link),
      ticketPrice: extractTicketPrice(plainDescription),
      description: plainDescription.slice(0, 500),
      venueName: item['georss:featurename'] || null,
      sourceId: item['livewhale:id'] || item.guid?.['#text'] || item.guid,
    };
  });
}
