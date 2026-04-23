import { useEffect, useState } from 'react'
import { GraduationCap, Users, BookOpen, CreditCard, TrendingUp, AlertCircle } from 'lucide-react'
import api from '../api/axios'
import StatCard from '../components/StatCard'
import Badge from '../components/Badge'

export default function Dashboard() {
  const [alunos, setAlunos]           = useState([])
  const [turmas, setTurmas]           = useState([])
  const [professores, setProfessores] = useState([])
  const [resumo, setResumo]           = useState(null)
  const [devedores, setDevedores]     = useState([])
  const [loading, setLoading]         = useState(true)

  const mesAtual = new Date().toLocaleDateString('pt-BR', {
    month: '2-digit', year: 'numeric',
  }).replace('/', '/')

  useEffect(() => {
    Promise.allSettled([
      api.get('/aluno'),
      api.get('/turmas'),
      api.get('/professores'),
      api.get(`/pagamentos/resumo?mes=${mesAtual}`),
      api.get(`/pagamentos/devedores/busca?mes=${mesAtual}`),
    ]).then(([a, t, p, r, d]) => {
      if (a.status === 'fulfilled') setAlunos(a.value.data)
      if (t.status === 'fulfilled') setTurmas(t.value.data)
      if (p.status === 'fulfilled') setProfessores(p.value.data)
      if (r.status === 'fulfilled') setResumo(r.value.data)
      if (d.status === 'fulfilled') setDevedores(d.value.data)
      setLoading(false)
    })
  }, [])

  const fmt = (v) =>
    v?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) ?? 'R$ 0,00'

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
        Carregando...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total de Alunos" value={alunos.length}      icon={GraduationCap} color="accent"  sub="matriculados" />
        <StatCard label="Professores"     value={professores.length} icon={Users}         color="purple"  sub="ativos" />
        <StatCard label="Turmas"          value={turmas.length}      icon={BookOpen}      color="warning" sub="ativas" />
        <StatCard label="Inadimplentes"   value={devedores.length}   icon={AlertCircle}   color="danger"  sub={`em ${mesAtual}`} />
      </div>

      {resumo && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <StatCard label="Recebido no mês" value={fmt(resumo.totalRecebido)} icon={TrendingUp}  color="success" />
          <StatCard label="Pendente no mês" value={fmt(resumo.totalPendente)} icon={AlertCircle} color="danger"  />
          <StatCard label="Total esperado"  value={fmt(resumo.totalEsperado)} icon={CreditCard}  color="accent"  sub={`${resumo.quantidadePagamentos} pagamentos`} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-bg-secondary border border-dim rounded-xl p-5">
          <h3 className="text-sm font-medium mb-4">Turmas ativas</h3>
          <div className="space-y-2">
            {turmas.length === 0 ? (
              <p className="text-sm text-gray-600 py-4 text-center">Nenhuma turma cadastrada</p>
            ) : turmas.map(t => (
              <div key={t.id} className="flex items-center justify-between py-2 border-b border-dim last:border-0">
                <span className="text-sm text-gray-300">{t.nome}</span>
                <Badge color="accent">
                  {t.valorMensalidade
                    ? t.valorMensalidade.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                    : '—'}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-bg-secondary border border-dim rounded-xl p-5">
          <h3 className="text-sm font-medium mb-4">
            Inadimplentes — <span className="text-gray-500">{mesAtual}</span>
          </h3>
          {devedores.length === 0 ? (
            <p className="text-sm text-gray-600 py-6 text-center">Nenhum devedor este mês 🎉</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {devedores.map((d, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-dim last:border-0">
                  <span className="text-sm text-gray-300">{d.nomeAluno}</span>
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
