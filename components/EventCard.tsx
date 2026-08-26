"use client";

import { useState } from "react";
import type { PublicEvent } from "@/lib/types";
import { formatEventDate } from "@/lib/format";
import { tagColor } from "@/lib/tagColor";

// Roughly how many characters show before we clamp — actual cutoff uses a
// CSS line-clamp (3 lines) so it adapts to card width, this just decides
// whether a "Read more" toggle is worth showing at all.
const DESCRIPTION_PREVIEW_THRESHOLD = 140;

export function EventCard({ event }: { event: PublicEvent }) {
  const [expanded, setExpanded] = useState(false);
  const hasLongDescription =
    event.description && event.description.length > DESCRIPTION_PREVIEW_THRESHOLD;

  return (
    <article className="group relative bg-paper text-ink rounded-xl p-5 flex flex-col gap-3 border-2 border-ink transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#D93A2B]">
      <p className="font-mono text-[11px] uppercase tracking-widish text-red font-semibold">
        {formatEventDate(event.date)}
        {event.startTime ? ` · ${event.startTime}` : ""}
      </p>

      <h3 className="font-display text-lg leading-snug text-ink">
        {event.concertName}
      </h3>

      <div className="text-sm leading-relaxed font-medium">
        {event.ensembleName && <p className="font-semibold text-ink">{event.ensembleName}</p>}
        {event.presenter && event.presenter !== event.ensembleName && (
          <p className="text-muted">Presented by {event.presenter}</p>
        )}
        {event.location && <p className="text-muted">{event.location}</p>}
      </div>

      {event.description && (
        <div className="text-sm text-ink/80 leading-relaxed">
          <p
            style={
              !expanded
                ? {
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical" as const,
                    overflow: "hidden",
                  }
                : undefined
            }
          >
            {event.description}
          </p>
          {hasLongDescription && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-1 font-mono text-[10px] uppercase tracking-widish text-red hover:text-ink transition-colors"
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>
      )}

      {event.tags.length > 0 && (
        <ul className="flex flex-wrap gap-1.5 pt-1">
          {event.tags.map((tag) => {
            const c = tagColor(tag);
            return (
              <li
                key={tag}
                className={`font-mono text-[10px] uppercase tracking-widish rounded-full px-2.5 py-0.5 ${c.bg} ${c.text}`}
              >
                {tag}
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-auto pt-3 flex items-center justify-between border-t-2 border-line">
        <span className="font-mono text-sm font-semibold text-ink/70">
          {event.ticketPrice || "Free"}
        </span>
        {event.ticketUrl && (
          <a
            href={event.ticketUrl}
            target="_blank"
            rel="noreferrer"
            className="font-body text-xs font-bold uppercase tracking-widish text-red hover:text-ink transition-colors"
          >
            Tickets ↗
          </a>
        )}
      </div>
    </article>
  );
}
