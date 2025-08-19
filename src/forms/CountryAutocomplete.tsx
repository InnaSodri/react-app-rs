import { useState, useMemo } from 'react'
import { useAppSelector } from '../store/hooks'
export default function CountryAutocomplete({ value, onChange, id }: { value: string; onChange: (v: string) => void; id: string }) {
  const [q, setQ] = useState(value || '')
  const countries = useAppSelector(s => s.countries.all)
  const filtered = useMemo(() => countries.filter(c => c.toLowerCase().includes(q.toLowerCase())), [countries, q])
  return (
    <div className="auto">
      <label htmlFor={id}>Country</label>
      <input id={id} value={q} onChange={e => setQ(e.target.value)} aria-autocomplete="list" />
      <ul role="listbox">
        {filtered.slice(0,8).map(c => (
          <li key={c} role="option">
            <button type="button" onClick={() => { onChange(c); setQ(c) }}>{c}</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
