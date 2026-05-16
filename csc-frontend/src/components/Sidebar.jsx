import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, GraduationCap, BookOpen,
  Heart, CreditCard, BarChart3, Shield, UserCircle, LogOut,
  ClipboardList
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

const adminNav = [
  { label: 'Usuários',   to: '/usuarios',   icon: Shield        },
  { label: 'Auditoria',  to: '/auditoria',  icon: ClipboardList },
  { label: 'Meu Perfil', to: '/meu-perfil', icon: UserCircle    },
]

export default function Sidebar() {
  const user = JSON.parse(localStorage.getItem('csc_user') || '{}')
  const isAdmin = user.role === 'ADMIN'

  const handleLogout = () => {
    localStorage.removeItem('csc_token')
    localStorage.removeItem('csc_user')
    window.location.href = '/login'
  }

  return (
    <aside className="w-[240px] min-h-screen flex flex-col flex-shrink-0 border-r"
      style={{ background: '#0f1117', borderColor: 'rgba(255,255,255,0.06)' }}>

      {/* Logo */}
      <div className="px-5 py-6 flex flex-col items-center gap-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="relative">
          <div className="absolute inset-0 rounded-xl bg-accent/20 blur-md" />
          <img src="/logo-csc.jpg" alt="CSC"
            className="relative w-16 h-16 object-contain rounded-xl border border-white/10" />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-white leading-tight">
            Colégio Silva Carvalho
          </p>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">
            Sistema de Gestão
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-[10px] uppercase tracking-widest text-gray-600 px-3 mb-3 font-semibold">
          Menu
        </p>
        {nav.map(({ label, to, icon: Icon }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
              ${isActive
                ? 'bg-accent text-white shadow-lg shadow-accent/20'
                : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
              }`
            }>
            <Icon size={15} />
            {label}
          </NavLink>
        ))}

        {isAdmin && (
          <>
            <p className="text-[10px] uppercase tracking-widest text-gray-600 px-3 pt-4 pb-2 font-semibold">
              Administração
            </p>
            {adminNav.map(({ label, to, icon: Icon }) => (
              <NavLink key={to} to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                  ${isActive
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                  }`
                }>
                <Icon size={15} />
                {label}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center text-accent text-sm font-bold">
              {user.login?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-200">
                {user.login}
              </p>
              <p className="text-[10px] text-gray-500">
                {user.role === 'ADMIN' ? 'Administrador' : 'Secretaria'}
              </p>
            </div>
          </div>
          <button onClick={handleLogout} title="Sair"
            className="p-1.5 rounded-lg text-gray-600 hover:text-danger hover:bg-danger/10 transition-colors">
            <LogOut size={14} />
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span className="w-1.5 h-1.5 rounded-full bg-success pulse-dot" />
          Sistema online
        </div>
      </div>
    </aside>
  )
}
