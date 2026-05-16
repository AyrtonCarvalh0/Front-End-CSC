import { useLocation } from 'react-router-dom'

const titles = {
  '/dashboard':    'Visão Geral',
  '/alunos':       'Alunos',
  '/professores':  'Professores',
  '/turmas':       'Turmas',
  '/responsaveis': 'Responsáveis',
  '/pagamentos':   'Pagamentos',
  '/relatorios':   'Relatórios',
  '/usuarios':     'Usuários',
  '/meu-perfil':   'Meu Perfil',
  '/auditoria':    'Auditoria',
}

export default function Topbar() {
  const { pathname } = useLocation()
  const title = titles[pathname] ?? 'CSC'
  const now = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
  })

  return (
    <header style={{
      background: '#0f1117',
      borderBottom: '1px solid rgba(255,255,255,0.06)'
    }} className="h-[60px] flex items-center px-6 gap-4 flex-shrink-0">
      <h1 className="flex-1 text-base font-semibold text-gray-100">
        {title}
      </h1>
      <span className="text-xs text-gray-500 font-mono bg-white/5 border border-white/5 rounded-full px-3 py-1.5 capitalize hidden md:block">
        {now}
      </span>
    </header>
  )
}
