import { useEffect, useState } from 'react'

export default function useCompact() {
  const [compact, setCompact] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('compact') === '1'
  })
  useEffect(() => {
    try {
      localStorage.setItem('compact', compact ? '1' : '0')
    } catch (e) {
      void e
    }
  }, [compact])
  const toggle = () => setCompact(v => !v)
  return { compact, toggle }
}

