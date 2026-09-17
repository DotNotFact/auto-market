export type Region = "europe" | "asia" | "usa" | "other";

export interface CountryInfo {
  code: string;
  region: Region;
  /** Index into the avatar palette, stable per country */
  tone: number;
}

interface CountryDef {
  code: string;
  region: Region;
  names: string[];
}

const COUNTRIES: CountryDef[] = [
  { code: "JP", region: "asia", names: ["япония", "japan"] },
  { code: "KR", region: "asia", names: ["южная корея", "корея", "south korea", "korea"] },
  { code: "CN", region: "asia", names: ["китай", "china"] },
  { code: "IN", region: "asia", names: ["индия", "india"] },
  { code: "MY", region: "asia", names: ["малайзия", "malaysia"] },
  { code: "DE", region: "europe", names: ["германия", "germany", "фрг"] },
  { code: "FR", region: "europe", names: ["франция", "france"] },
  { code: "IT", region: "europe", names: ["италия", "italy"] },
  { code: "GB", region: "europe", names: ["великобритания", "англия", "uk", "united kingdom", "great britain", "england"] },
  { code: "SE", region: "europe", names: ["швеция", "sweden"] },
  { code: "CZ", region: "europe", names: ["чехия", "czech republic", "czechia"] },
  { code: "ES", region: "europe", names: ["испания", "spain"] },
  { code: "NL", region: "europe", names: ["нидерланды", "голландия", "netherlands"] },
  { code: "RO", region: "europe", names: ["румыния", "romania"] },
  { code: "AT", region: "europe", names: ["австрия", "austria"] },
  { code: "RU", region: "europe", names: ["россия", "russia", "рф"] },
  { code: "US", region: "usa", names: ["сша", "usa", "united states", "америка", "us"] },
  { code: "CA", region: "other", names: ["канада", "canada"] },
  { code: "BR", region: "other", names: ["бразилия", "brazil"] },
  { code: "AU", region: "other", names: ["австралия", "australia"] },
];

const TONES = 6;

function hash(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i++) {
    h = (h * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function countryInfo(country: string | null | undefined): CountryInfo {
  const normalized = (country ?? "").trim().toLowerCase();
  const found = COUNTRIES.find((c) => c.names.includes(normalized));

  if (found) {
    return { code: found.code, region: found.region, tone: hash(found.code) % TONES };
  }

  const fallback = normalized
    .replace(/[^a-zа-яё]/gi, "")
    .slice(0, 2)
    .toUpperCase();

  return {
    code: fallback || "-",
    region: "other",
    tone: hash(normalized) % TONES,
  };
}

export const REGION_LABELS: Record<Exclude<Region, "other">, string> = {
  europe: "Европа",
  asia: "Азия",
  usa: "США",
};
