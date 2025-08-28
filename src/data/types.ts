export type YearRow = { year: number; population?: number; co2?: number; co2_per_capita?: number } & Record<string, number | string | undefined>
export type CountryData = { name: string; iso_code?: string; region?: string; years: YearRow[] }
export type Dataset = CountryData[]
