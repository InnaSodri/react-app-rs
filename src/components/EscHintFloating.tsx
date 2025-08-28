import { useEffect, useState } from 'react'

type Props = { open: boolean }

export function EscHintFloating({ open }: Props) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (!open) return setVisible(false)
    setVisible(true)
    const id = setTimeout(() => setVisible(false), 2000)
    return () => clearTimeout(id)
  }, [open])

  return (
    <div className={`esc-hint ${visible ? 'is-visible' : ''}`} aria-hidden="true">
      <div className="esc-chip">
        <kbd>Esc</kbd>
        <span className="esc-text">closes modal</span>
      </div>
    </div>
  )
}
