import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Eye, EyeOff, GraduationCap, Lock, User } from 'lucide-react'
import api from '../api/axios'

export default function Login() {
  const [form, setForm] = useState({ login: '', senha: '' })
  const [loading, setLoading] = useState(false)
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
      console.log('Erro login:', err.response)

      let msg = 'Login ou senha inválidos'

      if (err.response?.data) {
        const data = err.response.data
        if (typeof data === 'string') {
          msg = data
        } else if (data.message) {
          msg = data.message
        } else if (data.error) {
          msg = data.error
        }
      }

      toast.error(msg, {
        duration: 4000,
        style: {
          background: '#1f2330',
          color: '#ff5c7a',
          border: '1px solid rgba(255,92,122,0.3)',
          borderRadius: '10px',
          fontSize: '14px',
        },
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary flex">

      {/* Lado esquerdo — decorativo */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden
        bg-gradient-to-br from-accent/20 via-bg-secondary to-bg-primary
        flex-col items-center justify-center p-12">

        {/* Círculos decorativos */}
        <div className="absolute top-[-80px] left-[-80px] w-80 h-80
          rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-[-60px] right-[-60px] w-64 h-64
          rounded-full bg-purple/10 blur-3xl" />
        <div className="absolute top-1/2 right-[-40px] w-48 h-48
          rounded-full bg-success/10 blur-2xl" />

        {/* Conteúdo */}
        <div className="relative z-10 text-center max-w-sm">
          <div className="inline-flex items-center justify-center
            w-20 h-20 rounded-2xl bg-accent/10 border border-accent/20
            mb-8 mx-auto">
            <GraduationCap size={40} className="text-accent" />
          </div>

          <h1 className="text-4xl font-semibold tracking-tight mb-4">
            CSC<span className="text-accent">.</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-8">
            Sistema de Gestão Escolar
          </p>

          {/* Cards de features */}
          <div className="space-y-3 text-left">
            {[
              { icon: '📊', text: 'Controle financeiro completo' },
              { icon: '👨‍👩‍👧', text: 'Gestão de alunos e turmas' },
              { icon: '💳', text: 'Acompanhamento de mensalidades' },
            ].map((item, i) => (
              <div key={i}
                className="flex items-center gap-3 px-4 py-3
                  bg-white/5 border border-white/10 rounded-xl
                  backdrop-blur-sm">
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm text-gray-300">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lado direito — formulário */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">

          {/* Logo mobile */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center
              w-14 h-14 rounded-xl bg-accent/10 border border-accent/20 mb-4">
              <GraduationCap size={28} className="text-accent" />
            </div>
            <h1 className="text-2xl font-semibold">
              CSC<span className="text-accent">.</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Sistema de Gestão Escolar
            </p>
          </div>

          {/* Header do form */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight">
              Bem-vindo de volta
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Entre com suas credenciais para acessar o sistema
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleLogin} className="space-y-4">

            {/* Campo login */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">
                Login
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                  <User size={15} />
                </div>
                <input
                  className="w-full bg-bg-secondary border border-dim
                    rounded-xl pl-10 pr-4 py-3 text-sm text-gray-200
                    focus:outline-none focus:border-accent/50
                    focus:bg-bg-tertiary transition-all placeholder-gray-600"
                  placeholder="seu.login"
                  value={form.login}
                  onChange={e => setForm(f => ({ ...f, login: e.target.value }))}
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Campo senha */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">
                Senha
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                  <Lock size={15} />
                </div>
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  className="w-full bg-bg-secondary border border-dim
                    rounded-xl pl-10 pr-12 py-3 text-sm text-gray-200
                    focus:outline-none focus:border-accent/50
                    focus:bg-bg-tertiary transition-all placeholder-gray-600"
                  placeholder="••••••••"
                  value={form.senha}
                  onChange={e => setForm(f => ({ ...f, senha: e.target.value }))}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2
                    text-gray-500 hover:text-gray-300 transition-colors p-1">
                  {mostrarSenha ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Botão entrar */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 bg-accent hover:bg-accent-hover
                disabled:opacity-50 disabled:cursor-not-allowed
                text-white text-sm font-medium rounded-xl
                transition-all duration-150 flex items-center justify-center gap-2
                shadow-lg shadow-accent/20">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30
                    border-t-white rounded-full animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar no sistema'
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-gray-600 mt-8">
            CSC — Sistema Escolar © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  )
}
