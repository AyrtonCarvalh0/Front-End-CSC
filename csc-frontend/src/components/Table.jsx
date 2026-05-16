export default function Table({ columns, data, onRowClick }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/5
      shadow-sm bg-bg-secondary">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gradient-to-r from-csc-blue to-blue-600">
            {columns.map(col => (
              <th key={col.key}
                className="text-left px-4 py-3 text-xs font-bold
                  text-white uppercase tracking-wider whitespace-nowrap">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.id ?? i}
              onClick={() => onRowClick?.(row)}
              className={`border-b border-white/5 last:border-0
                transition-colors
                ${i % 2 === 0 ? 'bg-bg-secondary' : 'bg-white/[0.02]'}
                ${onRowClick
                  ? 'cursor-pointer hover:bg-accent/5'
                  : ''
                }`}>
              {columns.map(col => (
                <td key={col.key}
                  className="px-4 py-3 text-gray-300 whitespace-nowrap
                    font-medium">
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
