// Talks to Mailchimp's API to add someone to your Audience (mailing list).
// This only ever runs on the server (inside app/api/subscribe/route.ts),
// so the API key never reaches the browser.

// Mailchimp API keys end in a short "server prefix" like "-us21" — that
// prefix is also the subdomain their API lives on, so we pull it straight
// out of the key instead of asking for it separately.
function getServerPrefix(apiKey: string): string {
  const parts = apiKey.split("-");
  return parts[parts.length - 1];
}

export async function subscribeToMailchimp(
  email: string
): Promise<{ alreadySubscribed: boolean }> {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;

  if (!apiKey || !audienceId) {
    throw new Error(
      "Newsletter signup isn't configured yet. Set MAILCHIMP_API_KEY and MAILCHIMP_AUDIENCE_ID."
    );
  }

  const prefix = getServerPrefix(apiKey);
  const url = `https://${prefix}.api.mailchimp.com/3.0/lists/${audienceId}/members`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Mailchimp accepts any string as the username in Basic auth — only
      // the API key (as the password) actually matters.
      Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString("base64")}`,
    },
    body: JSON.stringify({
      email_address: email,
      status: "subscribed",
    }),
  });

  if (res.ok) {
    return { alreadySubscribed: false };
  }

  const data = await res.json().catch(() => ({}));

  // Mailchimp's way of saying "this email is already on the list" — treat
  // that as a success from the visitor's point of view, not an error.
  if (data.title === "Member Exists") {
    return { alreadySubscribed: true };
  }

  throw new Error(data.detail || "Could not subscribe right now.");
}
