"use client";

import { tagColor } from "@/lib/tagColor";

type Props = {
  query: string;
  onQueryChange: (v: string) => void;
  allTags: string[];
  activeTags: string[];
  onToggleTag: (tag: string) => void;
  view: "list" | "calendar";
  onViewChange: (v: "list" | "calendar") => void;
};

export function SearchFilters({
  query,
  onQueryChange,
  allTags,
  activeTags,
  onToggleTag,
  view,
  onViewChange,
}: Props) {
  return (
    <div className="sticky top-0 z-10 bg-cream/95 backdrop-blur border-b-4 border-ink py-4">
      <div className="mx-auto max-w-6xl px-6 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search concerts, ensembles, venues…"
            aria-label="Search events"
            className="flex-1 bg-paper border-2 border-ink rounded-lg px-4 py-2.5 text-sm text-ink placeholder:text-muted focus:border-red outline-none"
          />
          <div className="flex gap-1 font-body font-bold text-xs uppercase tracking-widish shrink-0">
            <button
              onClick={() => onViewChange("list")}
              className={`px-3 py-2.5 rounded-lg border-2 ${
                view === "list"
                  ? "border-red text-red bg-red/10"
                  : "border-ink text-muted hover:text-ink"
              }`}
            >
              List
            </button>
            <button
              onClick={() => onViewChange("calendar")}
              id="calendar"
              className={`px-3 py-2.5 rounded-lg border-2 ${
                view === "calendar"
                  ? "border-red text-red bg-red/10"
                  : "border-ink text-muted hover:text-ink"
              }`}
            >
              Calendar
            </button>
          </div>
        </div>

        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {allTags.map((tag) => {
              const active = activeTags.includes(tag);
              const c = tagColor(tag);
              return (
                <button
                  key={tag}
                  onClick={() => onToggleTag(tag)}
                  className={`font-mono text-[10px] uppercase tracking-widish rounded-full px-2.5 py-1 border-2 transition-colors ${
                    active
                      ? `${c.bg} ${c.text} border-transparent`
                      : "border-ink/20 text-muted hover:border-ink/50 hover:text-ink"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
