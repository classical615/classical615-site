"use client";

import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SearchFilters } from "@/components/SearchFilters";
import { EventList } from "@/components/EventList";
import { CalendarView } from "@/components/CalendarView";
import { formatEventDate } from "@/lib/format";
import type { PublicEvent } from "@/lib/types";

export default function Home() {
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [view, setView] = useState<"list" | "calendar">("list");

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
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

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = useMemo(
    () => events.filter((e) => e.date >= today).slice(0, 4),
    [events, today]
  );

  function toggleTag(tag: string) {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  return (
    <main>
      <SiteHeader />

      {/* Hero: "on stage this week" program strip. Numbering here is
          legitimate — these are literally the next concerts in date order. */}
      {upcoming.length > 0 && (
        <section className="bg-ink-soft border-b-4 border-red">
          <div className="mx-auto max-w-6xl px-6 py-10">
            <h2 className="font-display text-2xl sm:text-3xl text-paper mb-6">
              On Stage This Week
            </h2>
            <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {upcoming.map((e, i) => (
                <li key={e.id} className="fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <span className="font-display text-3xl text-red block leading-none mb-2">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="font-body font-semibold text-lg leading-snug text-paper">
                    {e.concertName}
                  </p>
                  <p className="mt-1 font-mono text-xs text-cream-dim">
                    {formatEventDate(e.date)}
                    {e.startTime ? ` · ${e.startTime}` : ""}
                  </p>
                  {e.ensembleName && (
                    <p className="text-sm text-cream-dim mt-0.5">{e.ensembleName}</p>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

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
          <p className="font-mono text-sm text-cream-dim">Loading concerts…</p>
        )}

        {error && !loading && (
          <p className="font-mono text-sm text-paper bg-red/20 border-2 border-red rounded-lg px-4 py-3">
            {error} If this keeps happening, double-check the Airtable
            connection in your environment variables.
          </p>
        )}

        {!loading && !error && (
          <>
            {view === "list" ? (
              <EventList events={filtered} />
            ) : (
              <CalendarView events={filtered} />
            )}
          </>
        )}
      </section>

      <footer className="bg-ink-soft border-t-4 border-red">
        <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="font-display text-base text-paper">Classical 615</p>
          <p className="font-mono text-xs text-cream-dim">
            Know about a concert? Submit it for review — see the link above.
          </p>
        </div>
      </footer>
    </main>
  );
}
