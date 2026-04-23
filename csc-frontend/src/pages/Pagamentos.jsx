import { useEffect, useState } from 'react'
import { CheckCircle, RefreshCw, Search, Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import Table from '../components/Table'
import Badge from '../components/Badge'
import StatCard from '../components/StatCard'
import EmptyState from '../components/EmptyState'
import { CreditCard, AlertCircle, TrendingUp } from 'lucide-react'

const inputCls = 'bg-bg-card border border-dim rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-accent/50 transition-colors placeholder-gray-600'
const selectCls = inputCls + ' appearance-none'

const mesHoje = () =>
  new Date().toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' }).replace('/', '/')

export default function Pagamentos() {
  const [aba, setAba]               = useState('lista')
  const [pagamentos, setPagamentos] = useState([])
  const [turmas, setTurmas]         = useState([])
  const [loading, setLoading]       = useState(false)

  // Gerar mensalidades
  const [mesGerar, setMesGerar]     = useState(mesHoje())
  const [gerando, setGerando]       = useState(false)

  // Devedores por mês
  const [mesDevedor, setMesDevedor] = useState(mesHoje())
  const [devedores, setDevedores]   = useState([])
  const [buscandoDev, setBuscandoDev] = useState(false)
  const [devedoresPorTurma, setDevedoresPorTurma] = useState([])
  const [mesTurma, setMesTurma]     = useState(mesHoje())
  const [turmaId, setTurmaId]       = useState('')

  // Caixa
  const [mesCaixa, setMesCaixa]     = useState(mesHoje())
  const [resumo, setResumo]         = useState(null)
  const [buscandoCaixa, setBuscandoCaixa] = useState(false)

  const loadPagamentos = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/pagamentos')
      setPagamentos(data)
    } catch {
      toast.error('Erro ao carregar pagamentos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPagamentos()
    api.get('/turmas').then(r => setTurmas(r.data)).catch(() => {})
  }, [])

  const handleGerar = async () => {
    if (!mesGerar) return toast.error('Informe o mês')
    setGerando(true)
    try {
      const { data } = await api.post(`/pagamentos/gerar-mes?mes=${encodeURIComponent(mesGerar)}`)
      toast.success(typeof data === 'string' ? data : 'Mensalidades geradas!')
      loadPagamentos()
    } catch (e) {
      toast.error(e.response?.data?.message ?? 'Erro ao gerar mensalidades')
    } finally {
      setGerando(false)
    }
  }

  const handleConfirmar = async (pagamento) => {
    try {
      const { data } = await api.patch(`/pagamentos/${pagamento.id}/confirmar`)
      toast.success(
        `Pago! ${data.valor?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) ?? ''}`
      )
      loadPagamentos()
    } catch (e) {
      toast.error(e.response?.data?.message ?? 'Erro ao confirmar')
    }
  }

  const buscarDevedores = async () => {
    if (!mesDevedor) return toast.error('Informe o mês')
    setBuscandoDev(true)
    try {
      const { data } = await api.get(`/pagamentos/devedores/busca?mes=${encodeURIComponent(mesDevedor)}`)
      setDevedores(data)
    } catch {
      toast.error('Erro ao buscar devedores')
    } finally {
      setBuscandoDev(false)
    }
  }

  const buscarDevedoresTurma = async () => {
    if (!mesTurma || !turmaId) return toast.error('Selecione mês e turma')
    try {
      const { data } = await api.get(`/pagamentos/devedores/turma?mes=${encodeURIComponent(mesTurma)}&turmaId=${turmaId}`)
      setDevedoresPorTurma(data)
    } catch {
      toast.error('Erro ao buscar')
    }
  }

  const buscarCaixa = async () => {
    if (!mesCaixa) return toast.error('Informe o mês')
    setBuscandoCaixa(true)
    try {
      const { data } = await api.get(`/pagamentos/resumo?mes=${encodeURIComponent(mesCaixa)}`)
      setResumo(data)
    } catch {
      toast.error('Erro ao buscar resumo')
    } finally {
      setBuscandoCaixa(false)
    }
  }

  const fmt = (v) => v?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) ?? 'R$ 0,00'

  const abas = [
    { key: 'lista',     label: 'Todos os pagamentos' },
    { key: 'gerar',     label: 'Gerar mensalidades'  },
    { key: 'devedores', label: 'Devedores'           },
    { key: 'caixa',     label: 'Resumo do caixa'     },
  ]

  const columns = [
    { key: 'aluno',   label: 'Aluno',   render: r => <span className="font-medium text-gray-200">{r.nomeAluno ?? r.aluno?.nome ?? '—'}</span> },
    { key: 'turma',   label: 'Turma',   render: r => r.turma?.nome ?? '—' },
    { key: 'mes',     label: 'Mês',     render: r => <span className="font-mono text-xs">{r.mes}</span> },
    { key: 'valor',   label: 'Valor',   render: r => fmt(r.valor) },
    {
      key: 'status', label: 'Status',
      render: r => <Badge color={r.pago ? 'success' : 'danger'}>{r.pago ? 'Pago' : 'Pendente'}</Badge>,
    },
    {
      key: 'dataPagamento', label: 'Data pagamento',
      render: r => r.dataPagamento
        ? new Date(r.dataPagamento).toLocaleDateString('pt-BR')
        : '—',
    },
    {
      key: 'acao', label: '',
      render: r => !r.pago ? (
        <button
          onClick={() => handleConfirmar(r)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-success/10 hover:bg-success/20 text-success text-xs rounded-lg border border-success/20 transition-colors font-medium"
        >
          <CheckCircle size={12} /> Confirmar
        </button>
      ) : null,
    },
  ]

  const btnPrimary = 'px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm rounded-lg transition-colors font-medium'

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 bg-bg-secondary border border-dim rounded-xl p-1 w-fit mb-6">
        {abas.map(a => (
          <button
            key={a.key}
            onClick={() => setAba(a.key)}
            className={`px-4 py-2 text-sm rounded-lg transition-all ${
              aba === a.key
                ? 'bg-accent text-white font-medium'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>

      {/* Lista */}
      {aba === 'lista' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">{pagamentos.length} pagamentos encontrados</p>
            <button onClick={loadPagamentos} className="p-2 text-gray-500 hover:text-gray-200 hover:bg-bg-card rounded-lg transition-colors">
              <RefreshCw size={14} />
            </button>
          </div>
          {loading ? (
            <p className="text-sm text-gray-500 text-center py-8">Carregando...</p>
          ) : pagamentos.length === 0 ? (
            <EmptyState icon={CreditCard} message="Nenhum pagamento encontrado" />
          ) : (
            <Table columns={columns} data={pagamentos} />
          )}
        </div>
      )}

      {/* Gerar mensalidades */}
      {aba === 'gerar' && (
        <div className="max-w-md space-y-4">
          <div className="bg-bg-secondary border border-dim rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} className="text-warning" />
              <h3 className="text-sm font-medium">Gerar mensalidades do mês</h3>
            </div>
            <p className="text-xs text-gray-500">
              Gera automaticamente os pagamentos para todos os alunos matriculados no mês informado.
            </p>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Mês / Ano</label>
              <input
                className={inputCls + ' w-full'}
                value={mesGerar}
                onChange={e => setMesGerar(e.target.value)}
                placeholder="MM/YYYY"
              />
              <p className="text-[10px] text-gray-600 mt-1">Formato: MM/YYYY — ex: 04/2025</p>
            </div>
            <button onClick={handleGerar} disabled={gerando} className={btnPrimary + ' w-full'}>
              {gerando ? 'Gerando...' : 'Gerar Mensalidades'}
            </button>
          </div>
        </div>
      )}

      {/* Devedores */}
      {aba === 'devedores' && (
        <div className="space-y-6">
          {/* Por mês */}
          <div className="bg-bg-secondary border border-dim rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-medium">Devedores por mês</h3>
            <div className="flex items-end gap-3">
              <div className="flex-1 max-w-xs">
                <label className="block text-xs text-gray-500 mb-1.5">Mês / Ano</label>
                <input className={inputCls + ' w-full'} value={mesDevedor} onChange={e => setMesDevedor(e.target.value)} placeholder="MM/YYYY" />
              </div>
              <button onClick={buscarDevedores} disabled={buscandoDev} className={btnPrimary}>
                <span className="flex items-center gap-2"><Search size={14} />{buscandoDev ? 'Buscando...' : 'Buscar'}</span>
              </button>
            </div>
            {devedores.length > 0 && (
              <div className="space-y-2 mt-2">
                <p className="text-xs text-gray-500">{devedores.length} devedor(es)</p>
                {devedores.map((d, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 px-3 bg-bg-card rounded-lg border border-dim">
                    <span className="text-sm text-gray-200">{d.nomeAluno}</span>
                    <Badge color="danger">{fmt(d.valor)}</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Por turma */}
          <div className="bg-bg-secondary border border-dim rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-medium">Devedores por turma</h3>
            <div className="flex items-end gap-3 flex-wrap">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Mês / Ano</label>
                <input className={inputCls} value={mesTurma} onChange={e => setMesTurma(e.target.value)} placeholder="MM/YYYY" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Turma</label>
                <select className={selectCls} value={turmaId} onChange={e => setTurmaId(e.target.value)}>
                  <option value="">Selecione</option>
                  {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                </select>
              </div>
              <button onClick={buscarDevedoresTurma} className={btnPrimary}>
                <span className="flex items-center gap-2"><Search size={14} /> Buscar</span>
              </button>
            </div>
            {devedoresPorTurma.length > 0 && (
              <div className="space-y-2 mt-2">
                {devedoresPorTurma.map((d, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 px-3 bg-bg-card rounded-lg border border-dim">
                    <span className="text-sm text-gray-200">{d.nomeAluno}</span>
                    <Badge color="danger">{fmt(d.valor)}</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Caixa */}
      {aba === 'caixa' && (
        <div className="space-y-5 max-w-xl">
          <div className="bg-bg-secondary border border-dim rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-medium">Resumo financeiro do mês</h3>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1.5">Mês / Ano</label>
                <input className={inputCls + ' w-full'} value={mesCaixa} onChange={e => setMesCaixa(e.target.value)} placeholder="MM/YYYY" />
              </div>
              <button onClick={buscarCaixa} disabled={buscandoCaixa} className={btnPrimary}>
                {buscandoCaixa ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
          </div>

          {resumo && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <StatCard label="Total Recebido"  value={fmt(resumo.totalRecebido)}  icon={TrendingUp}  color="success" sub={`${resumo.quantidadePagamentos} pagamentos`} />
                <StatCard label="Total Pendente"  value={fmt(resumo.totalPendente)}  icon={AlertCircle} color="danger"  />
                <StatCard label="Total Esperado"  value={fmt(resumo.totalEsperado)}  icon={CreditCard}  color="accent"  />
              </div>
              <div className="bg-bg-secondary border border-dim rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">Taxa de recebimento</span>
                  <span className="text-sm font-medium text-success">
                    {resumo.totalEsperado > 0
                      ? Math.round((resumo.totalRecebido / resumo.totalEsperado) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="w-full bg-bg-card rounded-full h-2">
                  <div
                    className="bg-success h-2 rounded-full transition-all"
                    style={{
                      width: resumo.totalEsperado > 0
                        ? `${Math.min(100, Math.round((resumo.totalRecebido / resumo.totalEsperado) * 100))}%`
                        : '0%',
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
