import { useState } from 'react'
import { Download, FileText, Table } from 'lucide-react'
import { exportarPDF, exportarExcel } from '../utils/exportar'

export default function BotaoExportar({ titulo, colunas, dados, nomeArquivo }) {
  const [aberto, setAberto] = useState(false)

  if (!dados || dados.length === 0) return null

  return (
    <div className="relative">
      <button
        onClick={() => setAberto(v => !v)}
        className="flex items-center gap-2 px-4 py-2 bg-bg-secondary
          border border-dim hover:border-accent/40 text-gray-300
          hover:text-accent text-sm rounded-lg transition-all">
        <Download size={14} />
        Exportar
      </button>

      {aberto && (
        <>
          <div className="fixed inset-0 z-40"
            onClick={() => setAberto(false)} />
          <div className="absolute right-0 top-full mt-1 z-50
            bg-bg-card border border-dim rounded-xl shadow-2xl
            overflow-hidden min-w-[160px]">
            <button
              onClick={() => {
                exportarPDF({ titulo, colunas, dados, nomeArquivo })
                setAberto(false)
              }}
              className="flex items-center gap-3 w-full px-4 py-3
                text-sm text-gray-300 hover:bg-bg-secondary
                hover:text-danger transition-colors">
              <FileText size={14} className="text-danger" />
              Exportar PDF
            </button>
            <button
              onClick={() => {
                exportarExcel({ titulo, colunas, dados, nomeArquivo })
                setAberto(false)
              }}
              className="flex items-center gap-3 w-full px-4 py-3
                text-sm text-gray-300 hover:bg-bg-secondary
                hover:text-success transition-colors border-t border-dim">
              <Table size={14} className="text-success" />
              Exportar Excel
            </button>
          </div>
        </>
      )}
    </div>
  )
}
