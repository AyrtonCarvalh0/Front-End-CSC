import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Lock, User, Shield, CreditCard, GraduationCap } from 'lucide-react'
import api from '../api/axios'

export default function Login() {
  const [form, setForm]                 = useState({ login: '', senha: '' })
  const [loading, setLoading]           = useState(false)
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!form.login || !form.senha) {
      toast.error('Preencha login e senha')
      return
    }
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', {
        login: form.login,
        senha: form.senha,
      })
      localStorage.setItem('csc_token', data.token)
      localStorage.setItem('csc_user', JSON.stringify({
        login: data.login,
        role: data.role,
      }))
      toast.success(`Bem-vindo, ${data.login}!`)
      navigate('/dashboard')
    } catch (err) {
      let msg = 'Login ou senha inválidos'
      if (err.response?.data) {
        const d = err.response.data
        if (typeof d === 'string') msg = d
        else if (d.message) msg = d.message
        else if (d.error) msg = d.error
      }
      toast.error(msg, { duration: 4000 })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#080a0f' }}>

      {/* Lado esquerdo — identidade CSC */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden"
        style={{ background: '#0f1117', borderRight: '1px solid rgba(255,255,255,0.06)' }}>

        {/* Grade decorativa */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }} />

        {/* Glow central */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />

        <div className="relative z-10 text-center max-w-sm">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 rounded-2xl bg-accent/20 blur-xl scale-110" />
            <img src="/logo-csc.jpg" alt="CSC"
              className="relative w-32 h-32 object-contain rounded-2xl border border-white/10 shadow-2xl" />
          </div>

          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
            Colégio Silva Carvalho
          </h1>
          <p className="text-gray-500 mb-10">
            Sistema de Gestão Escolar
          </p>

          <div className="space-y-3 text-left">
            {[
              { icon: Shield,        text: 'Acesso seguro com autenticação JWT'  },
              { icon: CreditCard,    text: 'Controle financeiro automatizado'    },
              { icon: GraduationCap, text: 'Gestão completa de alunos e turmas'  },
            ].map(({ icon: Icon, text }, i) => (
              <div key={i}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border"
                style={{
                  background: 'rgba(59,130,246,0.05)',
                  borderColor: 'rgba(59,130,246,0.15)'
                }}>
                <Icon size={16} className="text-accent flex-shrink-0" />
                <span className="text-sm text-gray-400">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lado direito — formulário */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">

          {/* Logo mobile */}
          <div className="lg:hidden text-center mb-8">
            <img src="/logo-csc.jpg" alt="CSC"
              className="w-20 h-20 object-contain rounded-xl border border-white/10 mx-auto mb-3" />
            <h1 className="text-xl font-bold text-white">
              Colégio Silva Carvalho
            </h1>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white tracking-tight">Bem-vindo</h2>
            <p className="text-gray-500 text-sm mt-1">
              Entre com suas credenciais para acessar o sistema
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Login
              </label>
              <div className="relative">
                <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  className="w-full rounded-lg pl-10 pr-4 py-3 text-sm text-gray-200 font-medium focus:outline-none transition-all placeholder-gray-600"
                  style={{ background: '#191d28', border: '1px solid rgba(255,255,255,0.08)' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  placeholder="seu.login"
                  value={form.login}
                  onChange={e => setForm(f => ({ ...f, login: e.target.value }))}
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  className="w-full rounded-lg pl-10 pr-12 py-3 text-sm text-gray-200 font-medium focus:outline-none transition-all placeholder-gray-600"
                  style={{ background: '#191d28', border: '1px solid rgba(255,255,255,0.08)' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  placeholder="••••••••"
                  value={form.senha}
                  onChange={e => setForm(f => ({ ...f, senha: e.target.value }))}
                  autoComplete="current-password"
                />
                <button type="button"
                  onClick={() => setMostrarSenha(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors p-1">
                  {mostrarSenha ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 mt-2 bg-accent hover:bg-accent-hover disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-all duration-150 shadow-lg shadow-accent/20 flex items-center justify-center gap-2">
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : 'Entrar no sistema'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-600 mt-8">
            CSC © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  )
}
