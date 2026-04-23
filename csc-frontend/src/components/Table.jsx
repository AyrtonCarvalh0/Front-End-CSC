export default function Table({ columns, data, onRowClick }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-dim">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-dim bg-bg-card/50">
            {columns.map(col => (
              <th
                key={col.key}
                className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={row.id ?? i}
              onClick={() => onRowClick?.(row)}
              className={`border-b border-dim last:border-0 transition-colors ${
                onRowClick ? 'cursor-pointer hover:bg-bg-card/60' : ''
              }`}
            >
              {columns.map(col => (
                <td key={col.key} className="px-4 py-3 text-gray-300 whitespace-nowrap">
                  {col.render ? col.render(row) : row[col.key] ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
