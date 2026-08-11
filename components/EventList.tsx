import type { PublicEvent } from "@/lib/types";
import { EventCard } from "./EventCard";

export function EventList({ events }: { events: PublicEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="font-display text-2xl text-muted">
          No concerts match — yet.
        </p>
        <p className="mt-2 text-sm text-muted/70">
          Try clearing a filter, or check back — new events are added every week.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
