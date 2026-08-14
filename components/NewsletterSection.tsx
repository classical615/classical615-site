"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setMessage(
        data.alreadySubscribed
          ? "You're already on the list!"
          : "You're in! Check your inbox to confirm."
      );
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <section className="bg-purple border-b-4 border-ink">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="max-w-xl">
          <h2 className="font-display text-2xl sm:text-3xl text-purple-dark mb-2">
            Never Miss a Concert
          </h2>
          <p className="font-body text-purple-dark/80 mb-6">
            Weekly picks, ticket giveaways, and Nashville classical news — straight to your inbox.
          </p>

          {status === "success" ? (
            <p className="font-body font-semibold text-purple-dark bg-paper border-2 border-ink rounded-lg px-4 py-3 inline-block">
              {message}
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                aria-label="Email address"
                className="flex-1 bg-paper border-2 border-ink rounded-lg px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-red outline-none"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="bg-red text-paper font-body font-bold text-sm uppercase tracking-widish rounded-lg px-6 py-3 hover:bg-ink transition-colors disabled:opacity-60"
              >
                {status === "loading" ? "Subscribing…" : "Subscribe"}
              </button>
            </form>
          )}

          {status === "error" && (
            <p className="mt-3 font-mono text-xs text-purple-dark">{message}</p>
          )}
        </div>
      </div>
    </section>
  );
}
