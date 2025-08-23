import { useState } from 'react'
import { useAppSelector } from './store/hooks'
import Modal from './components/Modal'
import UncontrolledForm from './forms/UncontrolledForm'
import RHFForm from './forms/RHFForm'
import FormikForm from './forms/FormikForm'
import ActionStateDemo from './forms/ActionStateDemo'
import Tile from './components/Tile'
import useCompact from './hooks/useCompact'

type Which = null | 'uncontrolled' | 'rhf' | 'formik' | 'action'

export default function App() {
  const [which, setWhich] = useState<Which>(null)
  const data = useAppSelector(s => s.forms.entries)
  const { compact, toggle } = useCompact()
  const open = (w: Exclude<Which, null>) => setWhich(w)
  const close = () => setWhich(null)

  const aria =
    which === 'rhf' ? 'RHF Form' :
    which === 'formik' ? 'Formik Form' :
    which === 'action' ? 'useActionState Demo' :
    'Uncontrolled Form'

  return (
    <div className={`container${compact ? ' compact' : ''}`}>
      <h1 className="brand">React Forms</h1>
      <div className="actions action-card">
        <button onClick={() => open('uncontrolled')} aria-haspopup="dialog">Open Uncontrolled</button>
        <button className="primary" onClick={() => open('rhf')} aria-haspopup="dialog">Open React Hook Form</button>
        <button onClick={() => open('formik')} aria-haspopup="dialog">Open Formik</button>
        <button onClick={() => open('action')} aria-haspopup="dialog">Open useActionState</button>
        <button className={compact ? 'primary' : ''} aria-pressed={compact} onClick={toggle}>
          {compact ? 'Compact: On' : 'Compact: Off'}
        </button>
      </div>
      <div className="grid">
        {data.map(x => (<Tile key={x.id} entry={x} />))}
      </div>
      <Modal open={which !== null} onClose={close} ariaLabel={aria} compact={compact}>
        {which === 'uncontrolled' && <UncontrolledForm onDone={close} compact={compact} />}
        {which === 'rhf' && <RHFForm onDone={close} compact={compact} />}
        {which === 'formik' && <FormikForm onDone={close} compact={compact} />}
        {which === 'action' && <ActionStateDemo onDone={close} compact={compact} />}
      </Modal>
    </div>
  )
}
