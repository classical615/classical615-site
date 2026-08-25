"use client";

import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SearchFilters } from "@/components/SearchFilters";
import { EventList } from "@/components/EventList";
import { CalendarView } from "@/components/CalendarView";
import { NewsletterSection } from "@/components/NewsletterSection";
import { SocialLinks } from "@/components/SocialLinks";
import { formatEventDate } from "@/lib/format";
import type { PublicEvent } from "@/lib/types";

export default function Home() {
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [view, setView] = useState<"list" | "calendar">("list");
  const [visibleCount, setVisibleCount] = useState(9);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        // The API already only returns events from today onward.
        setEvents(data.events ?? []);
      })
      .catch(() => setError("Could not load events right now."))
      .finally(() => setLoading(false));
  }, []);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    events.forEach((e) => e.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [events]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((e) => {
      const matchesQuery =
        !q ||
        [e.concertName, e.presenter, e.ensembleName, e.location]
          .join(" ")
          .toLowerCase()
          .includes(q);
      const matchesTags =
        activeTags.length === 0 || activeTags.every((t) => e.tags.includes(t));
      return matchesQuery && matchesTags;
    });
  }, [events, query, activeTags]);

  const upcoming = useMemo(() => {
    const now = new Date();
    const sevenDaysOut = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);
    return events.filter((e) => e.date <= sevenDaysOut).slice(0, 4);
  }, [events]);

  useEffect(() => {
    setVisibleCount(9);
  }, [query, activeTags]);

  function toggleTag(tag: string) {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  return (
    <main className="bg-cream min-h-screen">
      <SiteHeader />

      {/* Hero: "on stage this week" program strip, with a direct ticket
          link on each — this is the highest-intent spot on the page, so
          buying shouldn't require a click into a card first. Cards match
          the regular event card's info (date, name, ensemble, location,
          tickets) minus tags, kept simple. Only shows events in the next
          7 days; falls back to a pointer toward the full list below when
          the week ahead is empty. */}
      {!loading && (
        <section className="bg-yellow border-b-4 border-ink">
          <div className="mx-auto max-w-6xl px-6 py-10">
            <h2 className="font-display text-2xl sm:text-3xl text-yellow-dark mb-6">
              On Stage This Week
            </h2>
            {upcoming.length > 0 ? (
              <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {upcoming.map((e, i) => (
                  <li key={e.id} className="fade-up bg-paper border-2 border-ink rounded-xl p-4" style={{ animationDelay: `${i * 60}ms` }}>
                    <p className="font-mono text-xs uppercase tracking-widish text-red font-semibold mb-2">
                      {formatEventDate(e.date)}
                      {e.startTime ? ` · ${e.startTime}` : ""}
                    </p>
                    <p className="font-body font-semibold text-lg leading-snug text-ink">
                      {e.concertName}
                    </p>
                    {e.ensembleName && (
                      <p className="text-sm text-muted mt-0.5">{e.ensembleName}</p>
                    )}
                    {e.location && (
                      <p className="text-sm text-muted">{e.location}</p>
                    )}
                    {e.ticketUrl && (
                      <a
                        href={e.ticketUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block font-mono text-xs font-bold uppercase tracking-widish text-red hover:text-ink transition-colors"
                      >
                        Tickets ↗
                      </a>
                    )}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="font-body text-ink/80">
                Nothing on the calendar in the next 7 days — but take a look below for what's coming up next.
              </p>
            )}
          </div>
        </section>
      )}

      <NewsletterSection />

      <SearchFilters
        query={query}
        onQueryChange={setQuery}
        allTags={allTags}
        activeTags={activeTags}
        onToggleTag={toggleTag}
        view={view}
        onViewChange={setView}
      />

      <section id="events" className="mx-auto max-w-6xl px-6 py-10">
        {loading && (
          <p className="font-mono text-sm text-muted">Loading concerts…</p>
        )}

        {error && !loading && (
          <p className="font-mono text-sm text-ink bg-red/10 border-2 border-red rounded-lg px-4 py-3">
            {error} If this keeps happening, double-check the Airtable
            connection in your environment variables.
          </p>
        )}

        {!loading && !error && (
          <>
            {view === "list" ? (
              <>
                <EventList events={filtered.slice(0, visibleCount)} />
                {filtered.length > visibleCount && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => setVisibleCount((c) => c + 9)}
                      className="font-body font-bold text-sm uppercase tracking-widish text-paper bg-ink rounded-lg px-6 py-3 hover:bg-red transition-colors"
                    >
                      Show more events ({filtered.length - visibleCount} more)
                    </button>
                  </div>
                )}
              </>
            ) : (
              <CalendarView events={filtered} />
            )}
          </>
        )}
      </section>

      <footer className="bg-orange border-t-4 border-ink">
        <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="font-display text-base text-paper">Classical 615</p>
          <p className="font-mono text-xs text-paper/80">
            Know about a concert? Submit it for review — see the link above.
          </p>
          <SocialLinks />
        </div>
      </footer>
    </main>
  );
}
