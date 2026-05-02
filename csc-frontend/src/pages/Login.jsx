import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react'
import api from '../api/axios'

export default function Login() {
  const [form, setForm] = useState({ login: '', senha: '' })
  const [loading, setLoading] = useState(false)
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!form.login || !form.senha) return toast.error('Preencha todos os campos')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', form)
      localStorage.setItem('csc_token', data.token)
      localStorage.setItem('csc_user', JSON.stringify({ login: data.login, role: data.role }))
      toast.success(`Bem-vindo, ${data.login}!`)
      navigate('/dashboard')
    } catch {
      toast.error('Login ou senha inválidos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-3xl font-semibold tracking-tight mb-1">
            CSC<span className="text-accent">.</span>
          </div>
          <p className="text-sm text-gray-500">Sistema Escolar — Acesso restrito</p>
        </div>

        <form onSubmit={handleLogin}
          className="bg-bg-secondary border border-dim rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Login</label>
            <input
              className="w-full bg-bg-card border border-dim rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-accent/50 transition-colors"
              placeholder="seu.login"
              value={form.login}
              onChange={e => setForm(f => ({ ...f, login: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Senha</label>
            <div className="relative">
              <input
                type={mostrarSenha ? 'text' : 'password'}
                className="w-full bg-bg-card border border-DEFAULT rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none focus:border-accent/50 transition-colors"
                placeholder="••••••••"
                value={form.senha}
                onChange={e => setForm(f => ({ ...f, senha: e.target.value }))}
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                {mostrarSenha ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-accent hover:bg-accent-hover disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors mt-2">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
