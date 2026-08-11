// Public-facing shape of an event — only what belongs on the website.
// Everything else in the Airtable base (Description, Collab?, Status,
// Submission Source, Submitted Notes, Contact Email, Internal Notes,
// Created By) is intentionally left out — it's stripped server-side in
// app/api/events/route.ts before it ever reaches the browser.
export type PublicEvent = {
  id: string;
  concertName: string;
  presenter: string;
  ensembleName: string;
  date: string; // ISO date, e.g. "2026-09-12"
  startTime: string; // e.g. "7:30 PM"
  location: string;
  ticketPrice: string;
  ticketUrl: string;
  tags: string[];
};
