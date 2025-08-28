import { memo, useMemo, useState } from 'react'
import type { CountryData } from '../data/types'
import DataTable from './DataTable'
import { fmt } from '../utils/format'
import { baseName } from '../utils/baseName'

type Props = { country: CountryData; selectedYear: number; extraColumns: string[]; flashId: number }

function CountryCardImpl({ country, selectedYear, extraColumns, flashId }: Props) {
  const [open, setOpen] = useState(false)
  const latest = useMemo(() => {
    const byYear = country.years.find(y => y.year === selectedYear)
    return byYear ?? country.years[country.years.length - 1]
  }, [country.years, selectedYear])

  return (
    <div className="card">
      <div className="cardHeader">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div className="title">{baseName(country.name)}</div>
          <div className="cardMeta">
            <span className="badge">{country.region || 'Unknown'}</span>
            <span className="badge">Year {fmt(latest?.year)}</span>
            <span className="badge">CO₂ {fmt(latest?.co2)}</span>
            <span className="badge">CO₂ / cap {fmt(latest?.co2_per_capita)}</span>
            <span className="badge">Population {fmt(latest?.population)}</span>
          </div>
        </div>
        <button className="button" onClick={() => setOpen(v => !v)}>{open ? 'Hide' : 'Show'} data</button>
      </div>
      {open && (
        <div style={{ marginTop: 12 }}>
          <DataTable rows={country.years} columns={extraColumns} selectedYear={selectedYear} flashId={flashId} />
        </div>
      )}
    </div>
  )
}

export default memo(CountryCardImpl)
