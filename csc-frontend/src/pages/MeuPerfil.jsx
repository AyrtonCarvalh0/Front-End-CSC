import { useState } from 'react'
import { Eye, EyeOff, Lock, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'

const inputCls = 'w-full bg-bg-card border border-dim rounded-lg px-3 pl-10 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-accent/50 transition-colors'

function CampoSenha({ label, field, showField, form, setForm, mostrar, setMostrar }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1.5">{label}</label>
      <div className="relative">
        <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type={mostrar[showField] ? 'text' : 'password'}
          className={inputCls + ' pr-10'}
          value={form[field]}
          onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
          placeholder="••••••••"
        />
        <button type="button"
          onClick={() => setMostrar(m => ({ ...m, [showField]: !m[showField] }))}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
          {mostrar[showField] ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  )
}

export default function MeuPerfil() {
  const user = JSON.parse(localStorage.getItem('csc_user') || '{}')
  const [form, setForm] = useState({ senhaAtual: '', novaSenha: '', confirmar: '' })
  const [mostrar, setMostrar] = useState({ atual: false, nova: false, confirmar: false })
  const [loading, setLoading] = useState(false)

  const handleTrocar = async (e) => {
    e.preventDefault()
    if (!form.senhaAtual || !form.novaSenha || !form.confirmar) {
      return toast.error('Preencha todos os campos')
    }
    if (form.novaSenha.length < 6) {
      return toast.error('Nova senha deve ter pelo menos 6 caracteres')
    }
    if (form.novaSenha !== form.confirmar) {
      return toast.error('As senhas não coincidem')
    }
    setLoading(true)
    try {
      await api.put('/auth/trocar-senha', {
        senhaAtual: form.senhaAtual,
        novaSenha: form.novaSenha,
      })
      toast.success('Senha alterada com sucesso!')
      setForm({ senhaAtual: '', novaSenha: '', confirmar: '' })
    } catch (e) {
      toast.error(e.response?.data ?? 'Erro ao alterar senha')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <div className="bg-bg-secondary border border-dim rounded-xl p-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-2xl font-semibold text-accent">
          {user.login?.[0]?.toUpperCase()}
        </div>
        <div>
          <p className="font-medium text-lg">{user.login}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {user.role === 'ADMIN' ? 'Administrador' : 'Secretaria'}
          </p>
        </div>
      </div>

      <div className="bg-bg-secondary border border-dim rounded-xl p-5">
        <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
          <Lock size={14} className="text-accent" />
          Alterar senha
        </h3>

        <form onSubmit={handleTrocar} className="space-y-4">
          <CampoSenha label="Senha atual"         field="senhaAtual" showField="atual"
            form={form} setForm={setForm} mostrar={mostrar} setMostrar={setMostrar} />
          <CampoSenha label="Nova senha"           field="novaSenha"  showField="nova"
            form={form} setForm={setForm} mostrar={mostrar} setMostrar={setMostrar} />
          <CampoSenha label="Confirmar nova senha" field="confirmar"  showField="confirmar"
            form={form} setForm={setForm} mostrar={mostrar} setMostrar={setMostrar} />

          {form.novaSenha && (
            <div className="space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map(n => (
                  <div key={n} className={`h-1 flex-1 rounded-full transition-all ${
                    form.novaSenha.length >= n * 3
                      ? n <= 1 ? 'bg-danger'
                      : n <= 2 ? 'bg-warning'
                      : n <= 3 ? 'bg-accent'
                      : 'bg-success'
                      : 'bg-bg-card'
                  }`} />
                ))}
              </div>
              <p className="text-xs text-gray-500">
                {form.novaSenha.length < 6 ? 'Muito curta'
                  : form.novaSenha.length < 9 ? 'Fraca'
                  : form.novaSenha.length < 12 ? 'Boa'
                  : 'Forte'}
              </p>
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-accent hover:bg-accent-hover disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><CheckCircle size={14} /> Salvar nova senha</>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
