import { useState, useMemo, useRef } from 'react'
import { useAppSelector } from '../store/hooks'

export default function CountryAutocomplete({
  value,
  onChange,
  id
}: { value: string; onChange: (v: string) => void; id: string }) {
  const countries = useAppSelector(s => s.countries.all) as string[]
  const [q, setQ] = useState<string>(value || '')
  const [open, setOpen] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return []
    return countries.filter(c => c.toLowerCase().includes(t)).slice(0, 8)
  }, [countries, q])

  const exact = useMemo(
    () => countries.some(c => c.toLowerCase() === q.trim().toLowerCase()),
    [countries, q]
  )

  const select = (c: string) => {
    onChange(c)
    setQ(c)
    setOpen(false)
    inputRef.current?.blur()
  }

  return (
    <div className="auto" data-open={open ? 'true' : 'false'}>
      <label htmlFor={id}>Country</label>
      <input
        ref={inputRef}
        id={id}
        value={q}
        onFocus={() => setOpen(!exact && filtered.length > 0)}
        onChange={e => {
          const v = e.target.value
          setQ(v)
          const isExact = countries.some(c => c.toLowerCase() === v.trim().toLowerCase())
          setOpen(!isExact && v.trim().length > 0)
        }}
        onKeyDown={e => {
          if (e.key === 'Enter' && filtered.length > 0) {
            e.preventDefault()
            select(filtered[0])
          } else if (e.key === 'Escape') {
            setOpen(false)
          }
        }}
        onBlur={() => setTimeout(() => setOpen(false), 50)}
        aria-autocomplete="list"
        aria-expanded={open}
        autoComplete="off"
      />
      {open && filtered.length > 0 && (
        <ul role="listbox">
          {filtered.map(c => (
            <li key={c} role="option">
              <button
                type="button"
                onMouseDown={e => {
                  e.preventDefault()
                  select(c)
                }}
              >
                {c}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
