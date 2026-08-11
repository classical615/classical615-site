// Assigns each tag one of the 5 brand palette colors, consistently (the
// same tag always gets the same color — not random per render).
const TAG_COLORS = [
  { bg: "bg-purple", text: "text-purple-dark" },
  { bg: "bg-yellow", text: "text-yellow-dark" },
  { bg: "bg-orange", text: "text-orange-dark" },
  { bg: "bg-red", text: "text-white" },
  { bg: "bg-green", text: "text-white" },
] as const;

export function tagColor(tag: string) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = (hash * 31 + tag.charCodeAt(i)) >>> 0;
  }
  return TAG_COLORS[hash % TAG_COLORS.length];
}
