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

function stripHtml(html:
