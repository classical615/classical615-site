// Turns an ISO date string ("2026-09-12") into something readable
// ("Sat, Sep 12") without pulling in a big date library for one job.
export function formatEventDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
