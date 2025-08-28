import { useEffect, useMemo, useRef } from 'react'

type Props = {
  open: boolean
  onClose: () => void
  available: string[]
  selected: string[]
  onChange: (cols: string[]) => void
}

export default function ColumnModal({ open, onClose, available, selected, onChange }: Props) {
  const firstCheckboxRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    const id = setTimeout(() => firstCheckboxRef.current?.focus(), 0)
    return () => clearTimeout(id)
  }, [open])

  const items = useMemo(() => available.filter(k => k !== 'year'), [available])

  const toggle = (k: string) => {
    if (selected.includes(k)) onChange(selected.filter(x => x !== k))
    else onChange([...selected, k])
  }

  if (!open) return null

  return (
    <div className="modalOverlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modalHeader">
          <div className="title">Columns</div>
          <button className="button" onClick={onClose} aria-label="Close">Close</button>
        </div>
        <div className="modalBody">
          {items.map((k, i) => (
            <label key={k} className="check">
              <input
                ref={i === 0 ? firstCheckboxRef : undefined}
                type="checkbox"
                checked={selected.includes(k)}
                onChange={() => toggle(k)}
              />
              <span>{k}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
