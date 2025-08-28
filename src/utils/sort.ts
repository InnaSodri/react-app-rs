import type { CountryData } from '../data/types';

export type SortKey = 'name-asc' | 'name-desc' | 'population';

const baseName = (name: string): string => name.replace(/\s\d+$/, '');

const byBaseName = (a: CountryData, b: CountryData) =>
  baseName(a.name).localeCompare(baseName(b.name), undefined, { sensitivity: 'base' });

export const sortCountries = (list: CountryData[], sort: SortKey, year: number) => {
  if (sort === 'name-asc') return [...list].sort(byBaseName);
  if (sort === 'name-desc') return [...list].sort((a, b) => byBaseName(b, a));
  const getVal = (c: CountryData) => c.years.find(r => r.year === year)?.population as number | undefined;
  return [...list].sort((a, b) => (getVal(b) ?? -Infinity) - (getVal(a) ?? -Infinity));
};
