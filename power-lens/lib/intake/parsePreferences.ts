import type { LensMode, TonePreference } from "@/lib/types";

const TONES: TonePreference[] = [
  "Cautious",
  "Balanced",
  "Assertive",
  "Defensive",
  "Diplomatic",
];

const LENSES: LensMode[] = [
  "Survival",
  "Influence",
  "Diplomacy",
  "Long-term Trust",
];

export function parseTonePreference(raw: string): TonePreference {
  const s = raw.toLowerCase();
  for (const t of TONES) {
    if (s.includes(t.toLowerCase())) return t;
  }
  if (/(soft|cautious|safe|careful|protect)/i.test(raw)) return "Cautious";
  if (/(assert|direct|blunt|firm|strong)/i.test(raw)) return "Assertive";
  if (/(diplom|face|grace|tact)/i.test(raw)) return "Diplomatic";
  if (/(defensive|guard|shield)/i.test(raw)) return "Defensive";
  return "Balanced";
}

export function parseLensMode(raw: string): LensMode {
  const s = raw.toLowerCase();
  for (const l of LENSES) {
    if (s.includes(l.toLowerCase())) return l;
  }
  if (/(survival|damage|exit|protect|safety)/i.test(raw)) return "Survival";
  if (/(trust|long|sustain|years)/i.test(raw)) return "Long-term Trust";
  if (/(diplom|negotiat|save face)/i.test(raw)) return "Diplomacy";
  return "Influence";
}
