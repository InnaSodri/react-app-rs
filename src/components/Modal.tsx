import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  ariaLabel: string
  compact?: boolean
}

export default function Modal({ open, onClose, children, ariaLabel, compact = false }: Props) {
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const firstFocusRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    firstFocusRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      prev?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  const onOverlay = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose()
  }

  return createPortal(
    <div ref={overlayRef} className="overlay" onMouseDown={onOverlay}>
      <div className={`dialog${compact ? ' compact' : ''}`} role="dialog" aria-modal="true" aria-label={ariaLabel}>
        <div tabIndex={0} ref={firstFocusRef} />
        <button className="close-btn" aria-label="Close" onClick={onClose}>×</button>
        {children}
      </div>
    </div>,
    document.body
  )
}
