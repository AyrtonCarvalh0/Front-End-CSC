import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, GraduationCap, BookOpen,
  Heart, CreditCard, BarChart3, LogOut
} from 'lucide-react'

const nav = [
  { label: 'Visão Geral',  to: '/dashboard',    icon: LayoutDashboard },
  { label: 'Alunos',       to: '/alunos',        icon: GraduationCap   },
  { label: 'Professores',  to: '/professores',   icon: Users           },
  { label: 'Turmas',       to: '/turmas',        icon: BookOpen        },
  { label: 'Responsáveis', to: '/responsaveis',  icon: Heart           },
  { label: 'Pagamentos',   to: '/pagamentos',    icon: CreditCard      },
  { label: 'Relatórios',   to: '/relatorios',    icon: BarChart3       },
]

export default function Sidebar() {
  const user = JSON.parse(localStorage.getItem('csc_user') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('csc_token')
    localStorage.removeItem('csc_user')
    window.location.href = '/login'
  }

  return (
    <aside className="w-60 min-h-screen bg-bg-secondary border-r border-dim flex flex-col flex-shrink-0">
      <div className="px-6 py-7 border-b border-dim">
        <div className="text-xl font-semibold tracking-tight">
          CSC<span className="text-accent">.</span>
        </div>
        <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">
          Sistema Escolar
        </div>
      </div>

      <nav className="flex-1 p-3 pt-4">
        <p className="text-[10px] uppercase tracking-widest text-gray-600 px-3 mb-3">
          Menu
        </p>
        {nav.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-[9px] rounded-lg text-sm mb-1 transition-all duration-150 border ${
                isActive
                  ? 'bg-accent/10 text-accent border-accent/20'
                  : 'text-gray-400 border-transparent hover:bg-bg-tertiary hover:text-gray-200'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-dim space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-300">{user.login}</p>
            <p className="text-[10px] text-gray-600 uppercase tracking-wider">{user.role}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Sair"
            className="p-1.5 rounded-lg text-gray-600 hover:text-danger hover:bg-danger/10 transition-colors"
          >
            <LogOut size={14} />
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span className="w-2 h-2 rounded-full bg-success pulse-dot shadow-[0_0_6px_#2dd4a0]" />
          API conectada
        </div>
      </div>
    </aside>
  )
}
