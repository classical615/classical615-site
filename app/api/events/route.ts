import { NextResponse } from "next/server";
import { fetchPublicEvents } from "@/lib/airtable";

export const revalidate = 300; // 5 minutes

export async function GET() {
  try {
    const events = await fetchPublicEvents();
    return NextResponse.json({ events });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { events: [], error: "Could not load events right now." },
      { status: 502 }
    );
  }
}
