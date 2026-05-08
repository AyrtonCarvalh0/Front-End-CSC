import { useState, useEffect } from 'react'
import { Search, BarChart3 } from 'lucide-react'
import { TrendingUp, AlertCircle, CreditCard } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import StatCard from '../components/StatCard'
import Badge from '../components/Badge'
import EmptyState from '../components/EmptyState'
import BotaoExportar from '../components/BotaoExportar'

const inputCls = 'bg-bg-card border border-dim rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-accent/50 transition-colors placeholder-gray-600'
const selectCls = inputCls + ' appearance-none'

// <input type="month"> returns "YYYY-MM"; API expects "MM/YYYY"
const toApiMes = (val) => {
  if (!val) return ''
  const [ano, mes] = val.split('-')
  return `${mes}/${ano}`
}

const mesHoje = () => {
  const now = new Date()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  return `${now.getFullYear()}-${mm}`
}

export default function Relatorios() {
  const [turmas, setTurmas]         = useState([])

  // Resumo financeiro
  const [mesFin, setMesFin]         = useState(mesHoje())
  const [resumo, setResumo]         = useState(null)
  const [buscandoFin, setBuscandoFin] = useState(false)

  // Todos os devedores
  const [todosDevedores, setTodosDevedores] = useState([])
  const [loadingDev, setLoadingDev] = useState(false)
  const [devCarregados, setDevCarregados] = useState(false)

  // Inadimplência por turma
  const [mesTurma, setMesTurma]     = useState(mesHoje())
  const [turmaId, setTurmaId]       = useState('')
  const [devTurma, setDevTurma]     = useState([])
  const [buscandoTurma, setBuscandoTurma] = useState(false)

  useEffect(() => {
    api.get('/turmas').then(r => setTurmas(r.data)).catch(() => {})
  }, [])

  const buscarResumo = async () => {
    if (!mesFin) return toast.error('Informe o mês')
    setBuscandoFin(true)
    try {
      const { data } = await api.get(`/pagamentos/resumo?mes=${encodeURIComponent(toApiMes(mesFin))}`)
      setResumo(data)
    } catch {
      toast.error('Erro ao buscar resumo')
    } finally {
      setBuscandoFin(false)
    }
  }

  const carregarTodosDevedores = async () => {
    setLoadingDev(true)
    setDevCarregados(true)
    try {
      const { data } = await api.get('/pagamentos/devedores')
      setTodosDevedores(data)
    } catch {
      toast.error('Erro ao buscar devedores')
    } finally {
      setLoadingDev(false)
    }
  }

  const buscarDevedoresTurma = async () => {
    if (!mesTurma || !turmaId) return toast.error('Selecione mês e turma')
    setBuscandoTurma(true)
    try {
      const { data } = await api.get(
        `/pagamentos/devedores/turma?mes=${encodeURIComponent(toApiMes(mesTurma))}&turmaId=${turmaId}`
      )
      setDevTurma(data)
    } catch {
      toast.error('Erro ao buscar')
    } finally {
      setBuscandoTurma(false)
    }
  }

  const fmt = (v) => v?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) ?? 'R$ 0,00'

  const pct = resumo && resumo.totalEsperado > 0
    ? Math.min(100, Math.round((resumo.totalRecebido / resumo.totalEsperado) * 100))
    : 0

  // GET /pagamentos/devedores returns full payment objects with nested aluno
  const totalDevido = todosDevedores.reduce((sum, d) => sum + (d.valor ?? 0), 0)

  const btnPrimary = 'px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm rounded-lg transition-colors font-medium'

  return (
    <div className="space-y-8">
      {/* 1. Resumo financeiro */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            Resumo financeiro mensal
          </h2>
          <BotaoExportar
            titulo={`Resumo Financeiro — ${toApiMes(mesFin)}`}
            colunas={[
              { header: 'Mês',             accessor: r => r.mes ?? toApiMes(mesFin) },
              { header: 'Total Recebido',  accessor: r => r.totalRecebido?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) },
              { header: 'Total Pendente',  accessor: r => r.totalPendente?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) },
              { header: 'Total Esperado',  accessor: r => r.totalEsperado?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) },
              { header: 'Qtd Pagamentos',  accessor: r => r.quantidadePagamentos },
            ]}
            dados={resumo ? [resumo] : []}
            nomeArquivo={`resumo-financeiro-${toApiMes(mesFin)?.replace('/', '-')}`}
          />
        </div>
        <div className="bg-bg-secondary border border-dim rounded-xl p-5 space-y-4 max-w-xl">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1.5">Mês / Ano</label>
              <input
                type="month"
                className={inputCls + ' w-full'}
                value={mesFin}
                onChange={e => setMesFin(e.target.value)}
              />
            </div>
            <button onClick={buscarResumo} disabled={buscandoFin} className={btnPrimary}>
              <span className="flex items-center gap-2"><Search size={14} />{buscandoFin ? 'Buscando...' : 'Buscar'}</span>
            </button>
          </div>
        </div>

        {resumo && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard label="Total Recebido"  value={fmt(resumo.totalRecebido)}  icon={TrendingUp}  color="success" sub={`${resumo.quantidadePagamentos} pagamentos`} />
              <StatCard label="Total Pendente"  value={fmt(resumo.totalPendente)}  icon={AlertCircle} color="danger"  />
              <StatCard label="Total Esperado"  value={fmt(resumo.totalEsperado)}  icon={CreditCard}  color="accent"  />
            </div>
            <div className="bg-bg-secondary border border-dim rounded-xl p-5 max-w-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">Taxa de recebimento — {toApiMes(mesFin)}</span>
                <span className={`text-sm font-semibold ${pct >= 80 ? 'text-success' : pct >= 50 ? 'text-warning' : 'text-danger'}`}>
                  {pct}%
                </span>
              </div>
              <div className="w-full bg-bg-card rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    pct >= 80 ? 'bg-success' : pct >= 50 ? 'bg-warning' : 'bg-danger'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-[10px] text-gray-600 mt-2">
                {fmt(resumo.totalRecebido)} de {fmt(resumo.totalEsperado)} esperados
              </p>
            </div>
          </div>
        )}
      </section>

      {/* 2. Todos os devedores */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            Lista geral de inadimplentes
          </h2>
          <div className="flex items-center gap-3">
            <BotaoExportar
              titulo="Relatório de Inadimplência"
              colunas={[
                { header: 'Aluno', accessor: d => d.aluno?.nome ?? d.nomeAluno ?? '—' },
                { header: 'Mês',   accessor: d => d.mes },
                { header: 'Valor', accessor: d => d.valor?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) },
              ]}
              dados={todosDevedores}
              nomeArquivo="inadimplentes"
            />
            {!devCarregados && (
              <button onClick={carregarTodosDevedores} className={btnPrimary}>
                <span className="flex items-center gap-2"><Search size={14} /> Carregar devedores</span>
              </button>
            )}
          </div>
        </div>

        {loadingDev ? (
          <p className="text-sm text-gray-500 text-center py-6">Carregando...</p>
        ) : devCarregados && todosDevedores.length === 0 ? (
          <EmptyState icon={BarChart3} message="Nenhum devedor encontrado" />
        ) : todosDevedores.length > 0 ? (
          <div className="bg-bg-secondary border border-dim rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-dim flex items-center justify-between">
              <span className="text-xs text-gray-500">{todosDevedores.length} devedor(es)</span>
              <Badge color="danger">Total: {fmt(totalDevido)}</Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dim bg-bg-card/50">
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Aluno</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Mês</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {todosDevedores.map((d, i) => (
                    <tr key={d.id ?? i} className="border-b border-dim last:border-0">
                      <td className="px-4 py-3 text-gray-300">{d.aluno?.nome ?? d.nomeAluno ?? '—'}</td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{d.mes}</td>
                      <td className="px-4 py-3"><Badge color="danger">{fmt(d.valor)}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </section>

      {/* 3. Inadimplência por turma */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            Inadimplência por turma
          </h2>
          <BotaoExportar
            titulo={`Inadimplência por Turma — ${toApiMes(mesTurma)}`}
            colunas={[
              { header: 'Aluno', accessor: d => d.nomeAluno },
              { header: 'Mês',   accessor: d => d.mes },
              { header: 'Valor', accessor: d => d.valor?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) },
            ]}
            dados={devTurma}
            nomeArquivo={`inadimplencia-turma-${toApiMes(mesTurma)?.replace('/', '-')}`}
          />
        </div>
        <div className="bg-bg-secondary border border-dim rounded-xl p-5 space-y-4">
          <div className="flex items-end gap-3 flex-wrap">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Mês / Ano</label>
              <input type="month" className={inputCls} value={mesTurma} onChange={e => setMesTurma(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Turma</label>
              <select className={selectCls} value={turmaId} onChange={e => setTurmaId(e.target.value)}>
                <option value="">Selecione uma turma</option>
                {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
              </select>
            </div>
            <button onClick={buscarDevedoresTurma} disabled={buscandoTurma} className={btnPrimary}>
              <span className="flex items-center gap-2">
                <Search size={14} />{buscandoTurma ? 'Buscando...' : 'Buscar'}
              </span>
            </button>
          </div>

          {devTurma.length > 0 && (
            <div className="space-y-2 mt-2">
              <p className="text-xs text-gray-500">{devTurma.length} devedor(es) nesta turma</p>
              {devTurma.map((d, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 px-3 bg-bg-card rounded-lg border border-dim">
                  <span className="text-sm text-gray-200">{d.nomeAluno}</span>
                  <Badge color="danger">{fmt(d.valor)}</Badge>
                </div>
              ))}
            </div>
          )}
          {devTurma.length === 0 && buscandoTurma === false && turmaId && (
            <p className="text-xs text-gray-600 text-center py-4">Sem devedores nesta turma para o período</p>
          )}
        </div>
      </section>
    </div>
  )
}
