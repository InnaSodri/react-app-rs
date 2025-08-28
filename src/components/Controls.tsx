import { ChangeEvent, forwardRef, memo } from 'react'
import type { SortKey } from '../utils/sort'

type Props = {
  year: number
  setYear: (y: number) => void
  years: number[]
  region: string
  setRegion: (r: string) => void
  regions: string[]
  search: string
  setSearch: (s: string) => void
  sort: SortKey
  setSort: (s: SortKey) => void
  openModal: () => void
}

function ControlsImpl({
  year, setYear, years, region, setRegion, regions, search, setSearch, sort, setSort, openModal
}: Props, ref: React.Ref<HTMLButtonElement>) {
  return (
    <div className="controls">
      <select value={year} onChange={(e: ChangeEvent<HTMLSelectElement>) => setYear(Number(e.target.value))}>
        {years.map(y => <option key={y} value={y}>{y}</option>)}
      </select>

      <select value={region} onChange={(e: ChangeEvent<HTMLSelectElement>) => setRegion(e.target.value)}>
        {regions.map(r => <option key={r} value={r}>{r}</option>)}
      </select>

      <input
        className="input"
        placeholder="Search country…"
        value={search}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
      />

      <select value={sort} onChange={(e: ChangeEvent<HTMLSelectElement>) => setSort(e.target.value as SortKey)}>
        <option value="population">Population (selected year)</option>
        <option value="name-asc">Name (A–Z)</option>
        <option value="name-desc">Name (Z–A)</option>
      </select>

      <button ref={ref} className="button" onClick={openModal}>Columns</button>
    </div>
  )
}

export default memo(forwardRef<HTMLButtonElement, Props>(ControlsImpl))
