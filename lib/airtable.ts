import type { PublicEvent } from "./types";

// ---- Config -----------------------------------------------------------
// Set these in .env.local (dev) and in your host's environment variables
// (production). Never commit real values — see .env.example.
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_EVENTS_TABLE = process.env.AIRTABLE_EVENTS_TABLE || "Events";
// The view in your Events table that already only contains approved,
// public-ready events — reuse the "Approved / Public" view you built.
const AIRTABLE_PUBLIC_VIEW =
  process.env.AIRTABLE_PUBLIC_VIEW || "Approved / Public";

// ---- Raw Airtable record shape -----------------------------------------
// Field names below match what you listed for the Events table. Airtable
// lookup fields (like "Ensemble/Organization Name (from Presenter)") come
// back as arrays, so those are unwrapped below.
type AirtableFields = {
  "Concert Name"?: string;
  Presenter?: string[] | string;
  "Ensemble/Organization Name (from Presenter)"?: string[] | string;
  "Presenter (if not listed)"?: string;
  Date?: string;
  "Start Time"?: string;
  Location?: string;
  "Ticket Price"?: string;
  "Ticket URL"?: string;
  Tags?: string[];
};

type AirtableRecord = {
  id: string;
  fields: AirtableFields;
};

type AirtableResponse = {
  records: AirtableRecord[];
  offset?: string;
};

function firstOrSelf(value: string[] | string | undefined): string {
  if (!value) return "";
  return Array.isArray(value) ? value[0] ?? "" : value;
}

function mapRecord(record: AirtableRecord): PublicEvent {
  const f = record.fields;
  // "Presenter (if not listed)" covers ad-hoc presenters that aren't in the
  // linked Contacts base yet — fall back to it when Presenter is empty.
  const presenter = firstOrSelf(f.Presenter) || f["Presenter (if not listed)"] || "";

  return {
    id: record.id,
    concertName: f["Concert Name"] || "",
    presenter,
    ensembleName: firstOrSelf(f["Ensemble/Organization Name (from Presenter)"]),
    date: f.Date || "",
    startTime: f["Start Time"] || "",
    location: f.Location || "",
    ticketPrice: f["Ticket Price"] || "",
    ticketUrl: f["Ticket URL"] || "",
    tags: f.Tags || [],
  };
}

export async function fetchPublicEvents(): Promise<PublicEvent[]> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    throw new Error(
      "Airtable is not configured. Set AIRTABLE_API_KEY and AIRTABLE_BASE_ID."
    );
  }

  const records: AirtableRecord[] = [];
  let offset: string | undefined;

  do {
    const url = new URL(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(
        AIRTABLE_EVENTS_TABLE
      )}`
    );
    url.searchParams.set("view", AIRTABLE_PUBLIC_VIEW);
    url.searchParams.set("pageSize", "100");
    if (offset) url.searchParams.set("offset", offset);

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
      // Revalidate periodically rather than on every request, so the site
      // doesn't hammer Airtable's rate limit. Approve an event in Airtable
      // and it'll appear here within a few minutes.
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Airtable request failed (${res.status}): ${body}`);
    }

    const data: AirtableResponse = await res.json();
    records.push(...data.records);
    offset = data.offset;
  } while (offset);

  return records
    .map(mapRecord)
    .filter((e) => e.concertName && e.date)
    .sort((a, b) => a.date.localeCompare(b.date));
}
