import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { co2Resource } from './data/co2Resource'
import type { CountryData, Dataset } from './data/types'
import Controls from './components/Controls'
import ColumnModal from './components/ColumnModal'
import CountryCard from './components/CountryCard'
import Spinner from './components/Spinner'
import { sortCountries } from './utils/sort'
import type { SortKey } from './utils/sort'
import { baseName } from './utils/baseName'
import { EscHintFloating } from './components/EscHintFloating'
import './styles.css'

export default function App() {
  const data = co2Resource.read() as Dataset

  const allYears = useMemo(
    () => Array.from(new Set(data.flatMap(c => c.years.map(y => y.year)))).sort((a, b) => a - b),
    [data]
  )
  const defaultYear = allYears[allYears.length - 1]

  const [year, setYear] = useState<number>(defaultYear)
  const [region, setRegion] = useState<string>('All')
  const [search, setSearch] = useState<string>('')
  const [sort, setSort] = useState<SortKey>('population')
  const [modalOpen, setModalOpen] = useState(false)
  const [extraColumns, setExtraColumns] = useState<string[]>([])
  const [flashId, setFlashId] = useState(0)
  const modalBtnRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => { setFlashId(id => id + 1) }, [year])

  const regions = useMemo(() => {
    const set = new Set<string>(['All'])
    data.forEach(c => set.add(c.region || 'Unknown'))
    return Array.from(set)
  }, [data])

  const years = allYears

  const filtered = useMemo(() => {
    let list: CountryData[] = data
    if (region !== 'All') list = list.filter(c => (c.region || 'Unknown') === region)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(c => baseName(c.name).toLowerCase().includes(q))
    }
    return sortCountries(list, sort, year)
  }, [data, region, search, sort, year])

  const openModal = useCallback(() => {
    setModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setModalOpen(false)
    modalBtnRef.current?.focus()
  }, [])

  const onColumns = useCallback((cols: string[]) => setExtraColumns(cols), [])

  const sampleKeys = useMemo(() => {
    const s = new Set<string>()
    data.forEach(c => c.years.forEach(r => Object.keys(r).forEach(k => s.add(k))))
    return Array.from(s)
  }, [data])
  

  return (
    <div className="container">
      <div className="header">
        <div className="title">CO₂ Explorer</div>
        <Controls
          ref={modalBtnRef}
          year={year}
          setYear={setYear}
          years={years}
          region={region}
          setRegion={setRegion}
          regions={regions}
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
          openModal={openModal}
        />
      </div>

      <Suspense fallback={<Spinner />}>
        <div className="grid">
          {filtered.map(c => (
            <CountryCard
              key={c.name}
              country={c}
              selectedYear={year}
              extraColumns={extraColumns}
              flashId={flashId}
            />
          ))}
        </div>
      </Suspense>

      <ColumnModal
        open={modalOpen}
        onClose={closeModal}
        available={sampleKeys}
        selected={extraColumns}
        onChange={onColumns}
      />
      <EscHintFloating open={modalOpen} />
      <div className="footerNote">
        <a className="link" href="https://react.dev/reference/react/Suspense" target="_blank" rel="noreferrer">React Suspense</a>
      </div>
    </div>
  )
}
