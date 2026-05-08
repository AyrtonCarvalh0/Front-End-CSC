import { useEffect, useState } from 'react'
import { Plus, Trash2, Key, Shield, User } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import Modal from '../components/Modal'
import ModalConfirmacao from '../components/ModalConfirmacao'
import Badge from '../components/Badge'
import EmptyState from '../components/EmptyState'
import { useConfirmacao } from '../hooks/useConfirmacao'

const inputCls = 'w-full bg-bg-card border border-dim rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-accent/50 transition-colors'
const selectCls = inputCls + ' appearance-none'

function FormCadastro({ form, setForm }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-gray-500 mb-1.5">Login</label>
        <input className={inputCls}
          value={form.login}
          onChange={e => setForm(f => ({ ...f, login: e.target.value }))}
          placeholder="ex: secretaria01" />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1.5">Senha</label>
        <input type="password" className={inputCls}
          value={form.senha}
          onChange={e => setForm(f => ({ ...f, senha: e.target.value }))}
          placeholder="mínimo 6 caracteres" />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1.5">Nível de acesso</label>
        <select className={selectCls}
          value={form.role}
          onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
          <option value="SECRETARIA">Secretaria — acesso padrão</option>
          <option value="ADMIN">Admin — acesso total</option>
        </select>
      </div>
    </div>
  )
}

function FormResetSenha({ form, setForm }) {
  return (
    <div className="space-y-4">
      <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
        <p className="text-xs text-warning">
          Esta ação vai redefinir a senha do usuário.
          Informe a nova senha e repasse para ele.
        </p>
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1.5">Nova senha</label>
        <input type="password" className={inputCls}
          value={form.novaSenha}
          onChange={e => setForm(f => ({ ...f, novaSenha: e.target.value }))}
          placeholder="mínimo 6 caracteres" />
      </div>
    </div>
  )
}

export default function Usuarios() {
  const [usuarios, setUsuarios]         = useState([])
  const [loading, setLoading]           = useState(true)
  const [modalCriar, setModalCriar]     = useState(false)
  const [modalReset, setModalReset]     = useState(false)
  const [usuarioSel, setUsuarioSel]     = useState(null)
  const [formCadastro, setFormCadastro] = useState({ login: '', senha: '', role: 'SECRETARIA' })
  const [formReset, setFormReset]       = useState({ novaSenha: '' })

  const userAtual = JSON.parse(localStorage.getItem('csc_user') || '{}')
  const { config, confirmar, fechar } = useConfirmacao()

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/auth/usuarios')
      setUsuarios(data)
    } catch {
      toast.error('Erro ao carregar usuários')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleCadastrar = async () => {
    if (!formCadastro.login || !formCadastro.senha) {
      return toast.error('Preencha login e senha')
    }
    if (formCadastro.senha.length < 6) {
      return toast.error('Senha deve ter pelo menos 6 caracteres')
    }
    try {
      await api.post('/auth/cadastrar', { ...formCadastro, role: formCadastro.role })
      toast.success('Usuário criado!')
      setModalCriar(false)
      setFormCadastro({ login: '', senha: '', role: 'SECRETARIA' })
      load()
    } catch (e) {
      toast.error(e.response?.data?.message ?? e.response?.data ?? 'Erro ao criar usuário')
    }
  }

  const handleDeletar = (usuario) => {
    if (usuario.login === userAtual.login) {
      return toast.error('Você não pode deletar sua própria conta')
    }
    confirmar({
      titulo: 'Deletar usuário',
      mensagem: `Tem certeza que deseja remover o usuário "${usuario.login}"? Ele perderá acesso ao sistema imediatamente.`,
      tipo: 'danger',
      onConfirmar: async () => {
        try {
          await api.delete(`/auth/usuarios/${usuario.id}`)
          toast.success('Usuário removido')
          load()
        } catch (e) {
          toast.error(e.response?.data?.message ?? 'Erro ao deletar')
        }
      },
    })
  }

  const handleResetSenha = async () => {
    if (!formReset.novaSenha || formReset.novaSenha.length < 6) {
      return toast.error('Senha deve ter pelo menos 6 caracteres')
    }
    try {
      await api.put(`/auth/usuarios/${usuarioSel.id}/resetar-senha`, { novaSenha: formReset.novaSenha })
      toast.success(`Senha de "${usuarioSel.login}" resetada!`)
      setModalReset(false)
      setFormReset({ novaSenha: '' })
    } catch (e) {
      toast.error(e.response?.data?.message ?? 'Erro ao resetar senha')
    }
  }

  const abrirReset = (usuario) => {
    setUsuarioSel(usuario)
    setFormReset({ novaSenha: '' })
    setModalReset(true)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 mt-1">
            Gerencie os usuários que têm acesso ao sistema
          </p>
        </div>
        <button
          onClick={() => setModalCriar(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent
            hover:bg-accent-hover text-white text-sm rounded-lg
            transition-colors font-medium">
          <Plus size={15} /> Novo Usuário
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-bg-secondary border border-dim rounded-xl p-4 flex items-start gap-3">
          <div className="p-2 bg-accent/10 border border-accent/20 rounded-lg">
            <Shield size={16} className="text-accent" />
          </div>
          <div>
            <p className="text-sm font-medium">Admin</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Acesso total — pode criar/deletar usuários, turmas e todos os registros
            </p>
          </div>
        </div>
        <div className="bg-bg-secondary border border-dim rounded-xl p-4 flex items-start gap-3">
          <div className="p-2 bg-purple/10 border border-purple/20 rounded-lg">
            <User size={16} className="text-purple" />
          </div>
          <div>
            <p className="text-sm font-medium">Secretaria</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Acesso padrão — pode cadastrar alunos, lançar pagamentos e ver relatórios
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500 py-8 text-center">Carregando...</p>
      ) : usuarios.length === 0 ? (
        <EmptyState icon={User} message="Nenhum usuário encontrado" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-dim">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dim bg-bg-card/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Login</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Nível</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u, i) => (
                <tr key={u.id ?? i} className="border-b border-dim last:border-0 transition-colors hover:bg-bg-card/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-xs font-medium text-accent">
                        {u.login[0].toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-200">{u.login}</span>
                      {u.login === userAtual.login && (
                        <Badge color="accent">você</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge color={u.role === 'ADMIN' ? 'accent' : 'purple'}>
                      {u.role === 'ADMIN' ? '⚡ Admin' : '👤 Secretaria'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => abrirReset(u)}
                        title="Resetar senha"
                        className="p-1.5 rounded-lg text-gray-500 hover:text-warning hover:bg-warning/10 transition-colors">
                        <Key size={14} />
                      </button>
                      {u.login !== userAtual.login && (
                        <button
                          onClick={() => handleDeletar(u)}
                          title="Deletar usuário"
                          className="p-1.5 rounded-lg text-gray-500 hover:text-danger hover:bg-danger/10 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ModalConfirmacao
        open={config.open}
        onClose={fechar}
        onConfirmar={config.onConfirmar}
        titulo={config.titulo}
        mensagem={config.mensagem}
        tipo={config.tipo}
      />

      <Modal open={modalCriar} onClose={() => setModalCriar(false)} title="Criar novo usuário">
        <FormCadastro form={formCadastro} setForm={setFormCadastro} />
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={() => setModalCriar(false)}
            className="px-4 py-2 text-sm text-gray-400 hover:text-gray-200 transition-colors">
            Cancelar
          </button>
          <button onClick={handleCadastrar}
            className="px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm rounded-lg transition-colors">
            Criar usuário
          </button>
        </div>
      </Modal>

      <Modal open={modalReset} onClose={() => setModalReset(false)}
        title={`Resetar senha — ${usuarioSel?.login}`}>
        <FormResetSenha form={formReset} setForm={setFormReset} />
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={() => setModalReset(false)}
            className="px-4 py-2 text-sm text-gray-400 hover:text-gray-200 transition-colors">
            Cancelar
          </button>
          <button onClick={handleResetSenha}
            className="px-4 py-2 bg-warning hover:bg-warning/80 text-white text-sm rounded-lg transition-colors">
            Resetar senha
          </button>
        </div>
      </Modal>
    </div>
  )
}
