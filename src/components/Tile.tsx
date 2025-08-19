import { useEffect, useState } from 'react'
import type { FormEntry } from '../store/formsSlice'
export default function Tile({ entry }: { entry: FormEntry }) {
  const [pulse, setPulse] = useState(false)
  useEffect(() => { setPulse(true); const t = setTimeout(() => setPulse(false), 1500); return () => clearTimeout(t) }, [])
  return (
    <div className={pulse ? 'tile tile-new' : 'tile'}>
      <img src={entry.imageBase64 || ''} alt="avatar" className="avatar" />
      <div className="title">{entry.name}</div>
      <div className="muted">{entry.email}</div>
      <div className="row"><span>{entry.age}</span><span>{entry.gender}</span><span>{entry.country}</span></div>
    </div>
  )
}
