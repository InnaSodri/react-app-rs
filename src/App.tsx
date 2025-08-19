import { useState } from 'react'
import { useAppSelector } from './store/hooks'
import Modal from './components/Modal'
import UncontrolledForm from './forms/UncontrolledForm'
import RHFForm from './forms/RHFForm'
import Tile from './components/Tile'
import useCompact from './hooks/useCompact'

export default function App() {
  const [which, setWhich] = useState<null | 'uncontrolled' | 'rhf'>(null)
  const data = useAppSelector(s => s.forms.entries)
  const { compact, toggle } = useCompact()
  const open = (w: 'uncontrolled' | 'rhf') => setWhich(w)
  const close = () => setWhich(null)

  return (
    <div className={`container${compact ? ' compact' : ''}`}>
      <h1 className="brand">React Forms</h1>
      <div className="actions action-card">
        <button onClick={() => open('uncontrolled')} aria-haspopup="dialog">Open Uncontrolled</button>
        <button className="primary" onClick={() => open('rhf')} aria-haspopup="dialog">Open React Hook Form</button>
        <button className={compact ? 'primary' : ''} aria-pressed={compact} onClick={toggle}>
          {compact ? 'Compact: On' : 'Compact: Off'}
        </button>
      </div>
      <div className="grid">
        {data.map(x => (<Tile key={x.id} entry={x} />))}
      </div>
      <Modal open={which !== null} onClose={close} ariaLabel={which === 'rhf' ? 'RHF Form' : 'Uncontrolled Form'} compact={compact}>
        {which === 'uncontrolled' && <UncontrolledForm onDone={close} compact={compact} />}
        {which === 'rhf' && <RHFForm onDone={close} compact={compact} />}
      </Modal>
    </div>
  )
}
