import type { Country } from "@/types";

export async function fetchCountryPrefixes(): Promise<Country[]> {
  const res = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2,idd");
  const data = await res.json();
  return data
    .map((c: { name: { common: string }; cca2: string; idd: { root: string; suffixes?: string[] } }) => ({
      code: c.cca2,
      name: c.name.common,
      dialPrefix: c.idd.root + (c.idd.suffixes?.[0] || ""),
      flag: `https://flagcdn.com/w80/${c.cca2.toLowerCase()}.png`,
    }))
    .sort((a: Country, b: Country) => a.name.localeCompare(b.name));
}

export async function fetchDxtrCountries(): Promise<Country[]> {
  const res = await fetch("/api/proxy/countries");
  const data = await res.json();
  return data.data.map((c: { name: string; code: string; dial_code: string }) => ({
    code: c.code,
    name: c.name,
    dialPrefix: c.dial_code,
    flag: `https://flagcdn.com/w80/${c.code.toLowerCase()}.png`,
  }));
}
