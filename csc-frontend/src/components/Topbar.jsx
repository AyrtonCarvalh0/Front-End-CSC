import { useLocation } from 'react-router-dom'

const titles = {
  '/dashboard':    'Visão Geral',
  '/alunos':       'Alunos',
  '/professores':  'Professores',
  '/turmas':       'Turmas',
  '/responsaveis': 'Responsáveis',
  '/pagamentos':   'Pagamentos',
  '/relatorios':   'Relatórios',
}

export default function Topbar() {
  const { pathname } = useLocation()
  const now = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
  })

  return (
    <header className="h-[60px] bg-bg-secondary border-b border-dim flex items-center px-7 gap-4 flex-shrink-0">
      <h1 className="flex-1 text-base font-medium">
        {titles[pathname] ?? 'CSC'}
      </h1>
      <span className="text-xs text-gray-500 font-mono bg-bg-card border border-dim rounded-full px-3 py-1 capitalize">
        {now}
      </span>
    </header>
  )
}
