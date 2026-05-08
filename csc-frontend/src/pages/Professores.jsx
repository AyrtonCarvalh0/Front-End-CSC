import { useEffect, useState } from 'react'
import { Search, Plus, Trash2, Edit2, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import Modal from '../components/Modal'
import ModalConfirmacao from '../components/ModalConfirmacao'
import Table from '../components/Table'
import EmptyState from '../components/EmptyState'
import { useConfirmacao } from '../hooks/useConfirmacao'

const inputCls = 'w-full bg-bg-card border border-dim rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-accent/50 transition-colors placeholder-gray-600'

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

const emptyForm = { name: '', cpf: '', telefone: '', email: '' }

function FormProf({ form, setForm }) {
  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Nome completo">
          <input className={inputCls} value={form.name} onChange={set('name')} placeholder="Ex: Maria Souza" />
        </Field>
        <Field label="CPF">
          <input
            className={inputCls}
            value={form.cpf}
            onChange={e => {
              const raw = e.target.value.replace(/\D/g, '').slice(0, 11)
              const fmt = raw
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
              setForm(f => ({ ...f, cpf: fmt }))
            }}
            placeholder="000.000.000-00"
            maxLength={14}
          />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Telefone">
          <input className={inputCls} value={form.telefone} onChange={set('telefone')} placeholder="(00) 00000-0000" />
        </Field>
        <Field label="Email">
          <input type="email" className={inputCls} value={form.email} onChange={set('email')} placeholder="professor@escola.com" />
        </Field>
      </div>
    </div>
  )
}

export default function Professores() {
  const [professores, setProfessores] = useState([])
  const [loading, setLoading]         = useState(true)
  const [busca, setBusca]             = useState('')
  const [modalCriar, setModalCriar]   = useState(false)
  const [modalEditar, setModalEditar] = useState(false)
  const [profSel, setProfSel]         = useState(null)
  const [form, setForm]               = useState(emptyForm)
  const { config, confirmar, fechar } = useConfirmacao()

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/professores')
      setProfessores(data)
    } catch {
      toast.error('Erro ao carregar professores')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtrados = professores.filter(p =>
    p.name?.toLowerCase().includes(busca.toLowerCase())
  )

  const handleCriar = async () => {
    if (!form.name || !form.cpf) return toast.error('Nome e CPF são obrigatórios')
    try {
      await api.post('/professores', form)
      toast.success('Professor cadastrado!')
      setModalCriar(false)
      setForm(emptyForm)
      load()
    } catch (e) {
      toast.error(e.response?.data?.message ?? 'Erro ao cadastrar')
    }
  }

  const handleEditar = async () => {
    try {
      await api.put(`/professores/${profSel.id}`, form)
      toast.success('Professor atualizado!')
      setModalEditar(false)
      load()
    } catch (e) {
      toast.error(e.response?.data?.message ?? 'Erro ao atualizar')
    }
  }

  const handleDeletar = (prof) => {
    confirmar({
      titulo: 'Deletar professor',
      mensagem: `Tem certeza que deseja remover o professor "${prof.name}"?`,
      tipo: 'danger',
      onConfirmar: async () => {
        try {
          await api.delete(`/professores/${prof.id}`)
          toast.success('Professor removido')
          load()
        } catch (e) {
          toast.error(e.response?.data?.message ?? 'Erro ao deletar')
        }
      },
    })
  }

  const abrirEditar = (prof) => {
    setProfSel(prof)
    setForm({ name: prof.name ?? '', cpf: prof.cpf ?? '', telefone: prof.telefone ?? '', email: prof.email ?? '' })
    setModalEditar(true)
  }

  const columns = [
    { key: 'name',     label: 'Nome',     render: r => <span className="font-medium text-gray-200">{r.name}</span> },
    { key: 'cpf',      label: 'CPF',      render: r => <span className="font-mono text-xs text-gray-400">{r.cpf}</span> },
    { key: 'telefone', label: 'Telefone', render: r => r.telefone ?? '—' },
    { key: 'email',    label: 'Email',    render: r => r.email ?? '—' },
    {
      key: 'acoes', label: 'Ações',
      render: r => (
        <div className="flex gap-2">
          <button
            onClick={e => { e.stopPropagation(); abrirEditar(r) }}
            className="p-1.5 rounded-lg text-gray-500 hover:text-warning hover:bg-warning/10 transition-colors"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={e => { e.stopPropagation(); handleDeletar(r) }}
            className="p-1.5 rounded-lg text-gray-500 hover:text-danger hover:bg-danger/10 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ]

  const btnPrimary   = 'px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm rounded-lg transition-colors font-medium'
  const btnSecondary = 'px-4 py-2 text-sm text-gray-400 hover:text-gray-200 transition-colors'

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            className="w-full bg-bg-secondary border border-dim rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-accent/50 transition-colors"
            placeholder="Buscar por nome..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
        </div>
        <button onClick={() => { setForm(emptyForm); setModalCriar(true) }} className={btnPrimary}>
          <span className="flex items-center gap-2"><Plus size={15} /> Novo Professor</span>
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500 py-8 text-center">Carregando...</p>
      ) : filtrados.length === 0 ? (
        <EmptyState icon={Users} message="Nenhum professor encontrado" />
      ) : (
        <Table columns={columns} data={filtrados} />
      )}

      <ModalConfirmacao
        open={config.open}
        onClose={fechar}
        onConfirmar={config.onConfirmar}
        titulo={config.titulo}
        mensagem={config.mensagem}
        tipo={config.tipo}
      />

      <Modal open={modalCriar} onClose={() => setModalCriar(false)} title="Cadastrar professor">
        <FormProf form={form} setForm={setForm} />
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={() => setModalCriar(false)} className={btnSecondary}>Cancelar</button>
          <button onClick={handleCriar} className={btnPrimary}>Cadastrar</button>
        </div>
      </Modal>

      <Modal open={modalEditar} onClose={() => setModalEditar(false)} title="Editar professor">
        <FormProf form={form} setForm={setForm} />
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={() => setModalEditar(false)} className={btnSecondary}>Cancelar</button>
          <button onClick={handleEditar} className={btnPrimary}>Salvar</button>
        </div>
      </Modal>
    </div>
  )
}
