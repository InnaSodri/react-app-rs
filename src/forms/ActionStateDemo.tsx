import { useActionState, useEffect } from 'react'

export default function ActionStateDemo({
  compact = false,
  onDone,
}: { compact?: boolean; onDone?: () => void }) {
  async function increment(prev: number, fd: FormData) {
    const raw = fd.get('step')
    const step = typeof raw === 'string' ? parseInt(raw, 10) : Number(raw)
    const n = Number.isFinite(step) && step > 0 ? step : 1
    return prev + n
  }

  const [count, formAction, isPending] = useActionState<number, FormData>(increment, 0)

  useEffect(() => {
    if (!isPending && count > 0) onDone?.()
  }, [isPending, count, onDone])

  return (
    <form className={`form${compact ? ' compact' : ''}`}>
      <h2>useActionState</h2>
      <div aria-live="polite">Count: {count}</div>
      <label htmlFor="step">Step</label>
      <input id="step" name="step" defaultValue="1" inputMode="numeric" />
      <button type="submit" formAction={formAction} disabled={isPending}>
        {isPending ? 'Incrementing…' : 'Increment'}
      </button>
    </form>
  )
}
