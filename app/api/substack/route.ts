import { NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";

const FEED_URL = "https://classicallycurious.substack.com/feed";
const SUBSTACK_URL = "https://classicallycurious.substack.com/";

// Built from character codes so the pattern never looks like an HTML tag
// (60 is the less-than sign, 62 is the greater-than sign).
const LT = String.fromCharCode(60);
const GT = String.fromCharCode(62);
const TAG_PATTERN = new RegExp(LT + "[^" + GT + "]*" + GT, "g");

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: LT,
  gt: GT,
  quot: '"',
  apos: "'",
  nbsp: " ",
  mdash: "—",
  ndash: "–",
  hellip: "…",
  lsquo: "'",
  rsquo: "'",
  ldquo: "\u201C",
  rdquo: "\u201D",
};

function decodeEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(Number(num)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&([a-zA-Z]+);/g, (match, name) => NAMED_ENTITIES[name] ?? match);
}

function stripHtml(html: string): string {
  const noTags = html.replace(TAG_PATTERN, "");
  return decodeEntities(noTags).replace(/\s+/g, " ").trim();
}

export async function GET() {
  try {
    const res = await fetch(FEED_URL, { next: { revalidate: 3600 } });
    if (!res.ok) return NextResponse.json({ post: null });
    const xml = await res.text();
    const parser = new XMLParser({ ignoreAttributes: false });
    const data = parser.parse(xml);
    const items = data?.rss?.channel?.item;
    const item = Array.isArray(items) ? items[0] : items;
    if (!item) return NextResponse.json({ post: null });

    const rawDesc = item.description || item["content:encoded"] || "";
    let snippet = stripHtml(String(rawDesc)).slice(0, 220);
    if (snippet.length === 220) snippet += "…";

    const date = item.pubDate
      ? new Date(item.pubDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
      : "";

    return NextResponse.json({
      post: {
        title: decodeEntities(String(item.title || "")),
        link: String(item.link || SUBSTACK_URL),
        date,
        snippet,
      },
    });
  } catch {
    return NextResponse.json({ post: null });
  }
}
