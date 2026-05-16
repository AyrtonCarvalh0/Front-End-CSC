import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts'
import {
  GraduationCap, Users, BookOpen, AlertCircle,
  TrendingUp, TrendingDown, CreditCard, Clock
} from 'lucide-react'
import api from '../api/axios'
import StatCard from '../components/StatCard'
import Badge from '../components/Badge'

const COLORS = ['#4f7cff', '#2dd4a0', '#ffb347', '#a78bfa', '#ff5c7a']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bg-card border border-dim rounded-lg p-3 text-xs shadow-xl">
        <p className="font-medium text-gray-200 mb-2">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString('pt-BR', {
              style: 'currency', currency: 'BRL'
            })}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bg-card border border-dim rounded-lg p-3 text-xs shadow-xl">
        <p className="font-medium text-gray-200">{payload[0].name}</p>
        <p className="text-accent">{payload[0].value} aluno(s)</p>
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const [alunos, setAlunos]                       = useState([])
  const [turmas, setTurmas]                       = useState([])
  const [professores, setProfessores]             = useState([])
  const [resumo, setResumo]                       = useState(null)
  const [devedores, setDevedores]                 = useState([])
  const [historico, setHistorico]                 = useState([])
  const [porTurma, setPorTurma]                   = useState([])
  const [vencimentos, setVencimentos]             = useState([])
  const [loading, setLoading]                     = useState(true)
  const [resumoMesAnterior, setResumoMesAnterior] = useState(null)

  const mesAtual = new Date().toLocaleDateString('pt-BR', {
    month: '2-digit', year: 'numeric'
  }).replace('/', '/')

  const getMesAnterior = () => {
    const d = new Date()
    d.setMonth(d.getMonth() - 1)
    return d.toLocaleDateString('pt-BR', {
      month: '2-digit', year: 'numeric'
    }).replace('/', '/')
  }

  useEffect(() => {
    Promise.allSettled([
      api.get('/aluno'),
      api.get('/turmas'),
      api.get('/professores'),
      api.get(`/pagamentos/resumo?mes=${mesAtual}`),
      api.get('/pagamentos/devedores'),
      api.get('/pagamentos/historico-mensal'),
      api.get('/aluno/por-turma'),
      api.get('/pagamentos/proximos-vencimentos'),
      api.get(`/pagamentos/resumo?mes=${getMesAnterior()}`),
    ]).then(([a, t, p, r, d, h, pt, v, ra]) => {
      if (a.status  === 'fulfilled') setAlunos(a.value.data)
      if (t.status  === 'fulfilled') setTurmas(t.value.data)
      if (p.status  === 'fulfilled') setProfessores(p.value.data)
      if (r.status  === 'fulfilled') setResumo(r.value.data)
      if (d.status  === 'fulfilled') setDevedores(d.value.data)
      if (h.status  === 'fulfilled') setHistorico(h.value.data)
      if (pt.status === 'fulfilled') setPorTurma(pt.value.data)
      if (v.status  === 'fulfilled') setVencimentos(v.value.data)
      if (ra.status === 'fulfilled') setResumoMesAnterior(ra.value.data)
      setLoading(false)
    })
  }, [])

  const fmt = (v) => v?.toLocaleString('pt-BR', {
    style: 'currency', currency: 'BRL'
  }) ?? 'R$ 0,00'

  const calcCrescimento = () => {
    if (!resumo || !resumoMesAnterior) return null
    const atual    = resumo.totalRecebido || 0
    const anterior = resumoMesAnterior.totalRecebido || 0
    if (anterior === 0) return null
    return parseFloat(((atual - anterior) / anterior * 100).toFixed(1))
  }

  const crescimento = calcCrescimento()

  const pctRecebido = resumo && resumo.totalEsperado > 0
    ? Math.round((resumo.totalRecebido / resumo.totalEsperado) * 100)
    : 0

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex items-center gap-3 text-gray-500 text-sm">
        <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        Carregando dashboard...
      </div>
    </div>
  )

  return (
    <div className="space-y-6">

      {/* Stats principais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total de Alunos" value={alunos.length}
          icon={GraduationCap} color="accent"  sub="matriculados" />
        <StatCard label="Professores"     value={professores.length}
          icon={Users}         color="purple"  sub="ativos" />
        <StatCard label="Turmas"          value={turmas.length}
          icon={BookOpen}      color="warning" sub="ativas" />
        <StatCard label="Inadimplentes"   value={devedores.length}
          icon={AlertCircle}   color="danger"  sub="todos os meses" />
      </div>

      {/* Financeiro do mês com crescimento */}
      {resumo && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-bg-secondary border border-dim rounded-xl p-5">
            <p className="text-xs text-gray-500 mb-1">Recebido no mês</p>
            <p className="text-2xl font-semibold text-success">
              {fmt(resumo.totalRecebido)}
            </p>
            {crescimento !== null && (
              <div className={`flex items-center gap-1 mt-2 text-xs ${
                crescimento >= 0 ? 'text-success' : 'text-danger'
              }`}>
                {crescimento >= 0
                  ? <TrendingUp size={12} />
                  : <TrendingDown size={12} />}
                {crescimento >= 0 ? '+' : ''}{crescimento}% vs mês anterior
              </div>
            )}
          </div>

          <div className="bg-bg-secondary border border-dim rounded-xl p-5">
            <p className="text-xs text-gray-500 mb-1">Pendente no mês</p>
            <p className="text-2xl font-semibold text-danger">
              {fmt(resumo.totalPendente)}
            </p>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progresso de arrecadação</span>
                <span>{pctRecebido}%</span>
              </div>
              <div className="w-full bg-bg-card rounded-full h-1.5">
                <div
                  className="bg-success h-1.5 rounded-full transition-all duration-700"
                  style={{ width: `${pctRecebido}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-bg-secondary border border-dim rounded-xl p-5">
            <p className="text-xs text-gray-500 mb-1">Total esperado</p>
            <p className="text-2xl font-semibold text-accent">
              {fmt(resumo.totalEsperado)}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {resumo.quantidadePagamentos} pagamentos gerados
            </p>
          </div>
        </div>
      )}

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Histórico 6 meses */}
        <div className="lg:col-span-2 bg-bg-secondary border border-dim rounded-xl p-5">
          <h3 className="text-sm font-medium mb-5">Arrecadação — últimos 6 meses</h3>
          {historico.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={historico} barGap={4}>
                <CartesianGrid strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#6b7280' }}
                  axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }}
                  axisLine={false} tickLine={false}
                  tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                  formatter={value => value === 'recebido' ? 'Recebido' : 'Pendente'}
                />
                <Bar dataKey="recebido" fill="#2dd4a0" radius={[4, 4, 0, 0]} name="recebido" />
                <Bar dataKey="pendente" fill="#ff5c7a" radius={[4, 4, 0, 0]} name="pendente" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-600 text-sm">
              Nenhum dado de pagamento encontrado
            </div>
          )}
        </div>

        {/* Alunos por turma */}
        <div className="bg-bg-secondary border border-dim rounded-xl p-5">
          <h3 className="text-sm font-medium mb-5">Alunos por turma</h3>
          {porTurma.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={porTurma}
                    dataKey="quantidade"
                    nameKey="turma"
                    cx="50%" cy="50%"
                    innerRadius={45} outerRadius={70}
                    paddingAngle={3}
                  >
                    {porTurma.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-3">
                {porTurma.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full"
                        style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-gray-400">{item.turma}</span>
                    </div>
                    <span className="font-medium text-gray-200">{item.quantidade}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-600 text-sm">
              Nenhum aluno matriculado
            </div>
          )}
        </div>
      </div>

      {/* Próximos vencimentos + Inadimplentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <div className="bg-bg-secondary border border-dim rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={15} className="text-warning" />
            <h3 className="text-sm font-medium">Pendentes este mês</h3>
            {vencimentos.length > 0 && (
              <span className="ml-auto bg-warning/10 text-warning border border-warning/20
                text-xs px-2 py-0.5 rounded-full font-medium">
                {vencimentos.length}
              </span>
            )}
          </div>
          {vencimentos.length === 0 ? (
            <p className="text-sm text-gray-600 py-6 text-center">
              Nenhum vencimento pendente
            </p>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {vencimentos.map((v, i) => (
                <div key={i}
                  className="flex items-center justify-between py-2.5 px-3
                    bg-bg-card rounded-lg border border-dim">
                  <div>
                    <p className="text-sm font-medium text-gray-200">{v.nomeAluno}</p>
                    <p className="text-xs text-gray-500">{v.turma}</p>
                  </div>
                  <Badge color="warning">
                    {v.valor?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-bg-secondary border border-dim rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={15} className="text-danger" />
            <h3 className="text-sm font-medium">Todos os inadimplentes</h3>
            {devedores.length > 0 && (
              <span className="ml-auto bg-danger/10 text-danger border border-danger/20
                text-xs px-2 py-0.5 rounded-full font-medium">
                {devedores.length}
              </span>
            )}
          </div>
          {devedores.length === 0 ? (
            <p className="text-sm text-gray-600 py-6 text-center">
              Nenhum devedor este mês
            </p>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {devedores.map((d, i) => (
                <div key={i}
                  className="flex items-center justify-between py-2.5 px-3
                    bg-bg-card rounded-lg border border-dim">
                  <div>
                    <p className="text-sm text-gray-300">{d.nomeAluno}</p>
                    <p className="text-xs text-gray-500">{d.mes}</p>
                  </div>
                  <Badge color="danger">
                    {d.valor?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
