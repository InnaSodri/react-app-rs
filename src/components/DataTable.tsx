import { memo, useMemo } from 'react'
import type { YearRow } from '../data/types'
import { fmt } from '../utils/format'

const defaultCols = ['population', 'co2', 'co2_per_capita']

type Props = { rows: YearRow[]; columns: string[]; selectedYear: number; flashId: number }

function DataTableImpl({ rows, columns, selectedYear, flashId }: Props) {
  const cols = useMemo(
    () => (columns.length ? ['year', ...columns] : ['year', ...defaultCols]),
    [columns]
  )

  return (
    <div className="tableWrap">
      <table className="table">
        <thead>
          <tr>{cols.map(c => <th key={c}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.year}>
              {cols.map(c => {
                const v = r[c as keyof YearRow] as string | number | undefined
                const selected = r.year === selectedYear
                return (
                  <td
                    key={c}
                    className={selected ? 'flash' : undefined}
                    data-flash={selected ? String(flashId) : undefined}
                  >
                    {fmt(v)}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default memo(DataTableImpl)
