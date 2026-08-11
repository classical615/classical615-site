"use client";

import { useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import type { PublicEvent } from "@/lib/types";
import { EventList } from "./EventList";

export function CalendarView({ events }: { events: PublicEvent[] }) {
  const [cursor, setCursor] = useState(() => new Date());
  const [selected, setSelected] = useState<Date | null>(null);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, PublicEvent[]>();
    for (const e of events) {
      if (!e.date) continue;
      const list = map.get(e.date) ?? [];
      list.push(e);
      map.set(e.date, list);
    }
    return map;
  }, [events]);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor));
    const end = endOfWeek(endOfMonth(cursor));
    return eachDayOfInterval({ start, end });
  }, [cursor]);

  const selectedKey = selected ? format(selected, "yyyy-MM-dd") : null;
  const selectedEvents = selectedKey ? eventsByDay.get(selectedKey) ?? [] : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCursor((c) => subMonths(c, 1))}
          className="font-body font-bold text-xs uppercase tracking-widish text-cream-dim hover:text-red-bright px-2 py-1"
          aria-label="Previous month"
        >
          ← Prev
        </button>
        <h2 className="font-display text-xl text-paper">
          {format(cursor, "MMMM yyyy")}
        </h2>
        <button
          onClick={() => setCursor((c) => addMonths(c, 1))}
          className="font-body font-bold text-xs uppercase tracking-widish text-cream-dim hover:text-red-bright px-2 py-1"
          aria-label="Next month"
        >
          Next →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-px bg-ink-line text-center font-mono text-[10px] uppercase tracking-widish text-cream-dim">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="bg-ink py-2">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-ink-line">
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const dayEvents = eventsByDay.get(key) ?? [];
          const inMonth = isSameMonth(day, cursor);
          const isSelected = selected && isSameDay(day, selected);

          return (
            <button
              key={key}
              onClick={() => setSelected(dayEvents.length ? day : null)}
              className={`bg-ink min-h-[72px] p-2 text-left flex flex-col gap-1 transition-colors ${
                inMonth ? "" : "opacity-30"
              } ${isSelected ? "ring-2 ring-inset ring-red" : ""} ${
                dayEvents.length ? "hover:bg-ink-soft cursor-pointer" : "cursor-default"
              }`}
            >
              <span className="font-mono text-xs text-cream-dim">{format(day, "d")}</span>
              {dayEvents.length > 0 && (
                <span className="mt-auto flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-red" />
                  <span className="font-mono text-[10px] text-red-bright">
                    {dayEvents.length}
                  </span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="mt-8">
          <p className="font-mono text-xs uppercase tracking-widish text-red-bright mb-3">
            {format(selected, "EEEE, MMMM d")}
          </p>
          <EventList events={selectedEvents} />
        </div>
      )}
    </div>
  );
}
