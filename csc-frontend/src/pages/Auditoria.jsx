import { useEffect, useState } from 'react'
import { RefreshCw, ClipboardList } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import Badge from '../components/Badge'
import EmptyState from '../components/EmptyState'

const acaoCor = {
  LOGIN:                'accent',
  CRIAR_ALUNO:          'success',
  CRIAR_USUARIO:        'success',
  DELETAR_ALUNO:        'danger',
  DELETAR_USUARIO:      'danger',
  EDITAR_ALUNO:         'warning',
  CONFIRMAR_PAGAMENTO:  'success',
  GERAR_MENSALIDADES:   'purple',
  TROCAR_SENHA:         'warning',
  RESETAR_SENHA:        'warning',
}

function badgeCor(acao) {
  if (!acao) return 'accent'
  const key = Object.keys(acaoCor).find(k => acao.startsWith(k))
  return key ? acaoCor[key] : 'accent'
}

function formatDataHora(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
}

export default function Auditoria() {
  const [logs, setLogs]       = useState([])
  const [loading, setLoading] = useState(true)

  const carregar = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/audit')
      setLogs(data)
    } catch {
      toast.error('Erro ao carregar logs de auditoria')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { carregar() }, [])

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">Últimos 100 eventos do sistema</p>
        <button
          onClick={carregar}
          className="p-2 text-gray-500 hover:text-gray-200 hover:bg-white/5 rounded-lg transition-colors"
          title="Atualizar">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500 text-center py-8">Carregando...</p>
      ) : logs.length === 0 ? (
        <EmptyState icon={ClipboardList} message="Nenhum log de auditoria encontrado" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/5"
          style={{ background: '#0f1117' }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-csc-blue to-blue-600">
                <th className="text-left px-4 py-3 text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">Data/Hora</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">Usuário</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">Ação</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">Entidade</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">Detalhe</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">IP</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={log.id ?? i}
                  className={`border-b border-white/5 last:border-0 ${
                    i % 2 === 0 ? '' : 'bg-white/[0.02]'
                  }`}>
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap font-mono text-xs">
                    {formatDataHora(log.dataHora)}
                  </td>
                  <td className="px-4 py-3 text-gray-200 font-medium whitespace-nowrap">
                    {log.usuario}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Badge color={badgeCor(log.acao)}>{log.acao}</Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                    {log.entidade}
                  </td>
                  <td className="px-4 py-3 text-gray-500 max-w-[280px] truncate">
                    {log.detalhe ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-600 font-mono text-xs whitespace-nowrap">
                    {log.ip ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
