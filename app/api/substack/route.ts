import { NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";

const FEED_URL = "https://classicallycurious.substack.com/feed";
const SUBSTACK_URL = "https://classicallycurious.substack.com/";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
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
        title: String(item.title || ""),
        link: String(item.link || SUBSTACK_URL),
        date,
        snippet,
      },
    });
  } catch {
    return NextResponse.json({ post: null });
  }
}
