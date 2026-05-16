import { useEffect } from 'react'
import { Trash2, AlertTriangle, HelpCircle } from 'lucide-react'

const cores = {
  danger:  { bg: 'bg-danger/10',  border: 'border-danger/20',  btn: 'bg-danger hover:bg-danger/80',    Icon: Trash2        },
  warning: { bg: 'bg-warning/10', border: 'border-warning/20', btn: 'bg-warning hover:bg-warning/80',  Icon: AlertTriangle },
  accent:  { bg: 'bg-accent/10',  border: 'border-accent/20',  btn: 'bg-accent hover:bg-accent-hover', Icon: HelpCircle    },
}

export default function ModalConfirmacao({ open, onClose, onConfirmar, titulo, mensagem, tipo = 'danger' }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!open) return null

  const cor = cores[tipo] ?? cores.danger
  const { Icon } = cor

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-sm bg-bg-secondary border border-dim rounded-xl shadow-2xl fade-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center p-6 pb-4">
          <div className={`w-14 h-14 rounded-full ${cor.bg} border ${cor.border} flex items-center justify-center mb-4`}>
            <Icon size={22} className={
              tipo === 'danger'  ? 'text-danger'  :
              tipo === 'warning' ? 'text-warning' : 'text-accent'
            } />
          </div>
          <h2 className="text-base font-semibold text-gray-100 mb-2">{titulo}</h2>
          <p className="text-sm text-gray-400 leading-relaxed">{mensagem}</p>
        </div>

        <div className="flex gap-2 p-4 pt-2 border-t border-dim">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-sm text-gray-400 hover:text-gray-200 bg-bg-card hover:bg-bg-tertiary border border-dim rounded-lg transition-all">
            Cancelar
          </button>
          <button
            onClick={() => { onConfirmar(); onClose() }}
            className={`flex-1 py-2.5 text-sm text-white font-medium rounded-lg transition-all ${cor.btn}`}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}
