import { NextResponse } from "next/server";
import { subscribeToMailchimp } from "@/lib/mailchimp";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = typeof body.email === "string" ? body.email.trim() : "";

    if (!email || !email.includes("@") || !email.includes(".")) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const result = await subscribeToMailchimp(email);
    return NextResponse.json({ success: true, alreadySubscribed: result.alreadySubscribed });
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
