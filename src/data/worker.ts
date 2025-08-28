import type { YearRow, CountryData } from './types'

type Primitive = number | string | undefined

self.onmessage = (e: MessageEvent<string>) => {
  const text = e.data
  try {
    const raw = JSON.parse(text) as unknown
    if (typeof raw !== 'object' || raw === null) throw new Error('Invalid JSON root')
    const out: CountryData[] = []

    for (const [name, rowsU] of Object.entries(raw as Record<string, unknown>)) {
      if (!Array.isArray(rowsU)) continue
      let iso: string | undefined
      let region: string | undefined
      const years: YearRow[] = []

      for (const rU of rowsU) {
        if (typeof rU !== 'object' || rU === null) continue
        const r = rU as Record<string, unknown>
        const yN = Number(r['year' as keyof typeof r])
        if (!Number.isFinite(yN)) continue
        if (!iso) iso = (r['iso_code' as keyof typeof r] ?? r['iso' as keyof typeof r] ?? r['code' as keyof typeof r]) as string | undefined
        if (!region) region = (r['region' as keyof typeof r] ?? r['continent' as keyof typeof r] ?? r['group' as keyof typeof r]) as string | undefined

        const row: Record<string, Primitive> = { year: yN }
        for (const [k, v] of Object.entries(r)) {
          if (k === 'year' || k === 'country' || k === 'iso_code' || k === 'iso' || k === 'code' || k === 'region' || k === 'continent' || k === 'group') continue
          if (typeof v === 'number') row[k] = v
          else if (typeof v === 'string') {
            const n = Number(v)
            row[k] = Number.isNaN(n) ? v : n
          } else {
            row[k] = undefined
          }
        }
        years.push(row as YearRow)
      }
      years.sort((a, b) => a.year - b.year)
      out.push({ name, iso_code: iso, region, years })
    }

    ;(self as unknown as Worker).postMessage({ ok: true, data: out })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    ;(self as unknown as Worker).postMessage({ ok: false, error: message })
  }
}
