export const nf0 = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 })
export const nf2 = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 })

export const fmt = (v: number | string | null | undefined): string =>
  v == null || (typeof v === 'number' && Number.isNaN(v))
    ? 'N/A'
    : typeof v === 'number'
    ? (Number.isInteger(v) ? nf0.format(v) : nf2.format(v))
    : String(v)
