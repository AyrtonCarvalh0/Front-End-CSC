import { useEffect, useState } from 'react'
import { Search, Plus, Trash2, Edit2, Heart } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import Modal from '../components/Modal'
import Table from '../components/Table'
import EmptyState from '../components/EmptyState'

const inputCls = 'w-full bg-bg-card border border-dim rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-accent/50 transition-colors placeholder-gray-600'

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

const emptyForm = { name: '', cpf: '', endereco: '', telefone: '', email: '' }

export default function Responsaveis() {
  const [responsaveis, setResponsaveis] = useState([])
  const [loading, setLoading]           = useState(true)
  const [busca, setBusca]               = useState('')
  const [modalCriar, setModalCriar]     = useState(false)
  const [modalEditar, setModalEditar]   = useState(false)
  const [respSel, setRespSel]           = useState(null)
  const [form, setForm]                 = useState(emptyForm)

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/responsavel')
      setResponsaveis(data)
    } catch {
      toast.error('Erro ao carregar responsáveis')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleBusca = async (nome) => {
    setBusca(nome)
    if (!nome.trim()) { load(); return }
    try {
      const { data } = await api.get(`/responsavel/buscar-nome?nome=${encodeURIComponent(nome)}`)
      setResponsaveis(Array.isArray(data) ? data : [data])
    } catch {
      setResponsaveis([])
    }
  }

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleCriar = async () => {
    if (!form.name || !form.cpf) return toast.error('Nome e CPF são obrigatórios')
    try {
      await api.post('/responsavel', form)
      toast.success('Responsável cadastrado!')
      setModalCriar(false)
      setForm(emptyForm)
      load()
    } catch (e) {
      toast.error(e.response?.data?.message ?? 'Erro ao cadastrar')
    }
  }

  const handleEditar = async () => {
    try {
      await api.put(`/responsavel/${respSel.id}`, form)
      toast.success('Responsável atualizado!')
      setModalEditar(false)
      load()
    } catch (e) {
      toast.error(e.response?.data?.message ?? 'Erro ao atualizar')
    }
  }

  const handleDeletar = async (resp) => {
    if (!confirm(`Deletar ${resp.name}?`)) return
    try {
      await api.delete(`/responsavel/${resp.id}`)
      toast.success('Responsável removido')
      load()
    } catch (e) {
      toast.error(e.response?.data?.message ?? 'Erro ao deletar')
    }
  }

  const abrirEditar = (resp) => {
    setRespSel(resp)
    setForm({
      name: resp.name ?? '',
      cpf: resp.cpf ?? '',
      endereco: resp.endereco ?? '',
      telefone: resp.telefone ?? '',
      email: resp.email ?? '',
    })
    setModalEditar(true)
  }

  function FormResp() {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Nome completo">
            <input className={inputCls} value={form.name} onChange={set('name')} placeholder="Ex: Ana Lima" />
          </Field>
          <Field label="CPF">
            <input className={inputCls} value={form.cpf} onChange={set('cpf')} placeholder="000.000.000-00" />
          </Field>
        </div>
        <Field label="Endereço">
          <input className={inputCls} value={form.endereco} onChange={set('endereco')} placeholder="Rua, número, bairro..." />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Telefone">
            <input className={inputCls} value={form.telefone} onChange={set('telefone')} placeholder="(00) 00000-0000" />
          </Field>
          <Field label="Email">
            <input type="email" className={inputCls} value={form.email} onChange={set('email')} placeholder="email@exemplo.com" />
          </Field>
        </div>
      </div>
    )
  }

  const columns = [
    { key: 'name',     label: 'Nome',     render: r => <span className="font-medium text-gray-200">{r.name}</span> },
    { key: 'cpf',      label: 'CPF',      render: r => <span className="font-mono text-xs text-gray-400">{r.cpf}</span> },
    { key: 'telefone', label: 'Telefone', render: r => r.telefone ?? '—' },
    { key: 'email',    label: 'Email',    render: r => r.email ?? '—' },
    { key: 'endereco', label: 'Endereço', render: r => <span className="text-gray-500 max-w-[200px] truncate block">{r.endereco ?? '—'}</span> },
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
            onChange={e => handleBusca(e.target.value)}
          />
        </div>
        <button onClick={() => { setForm(emptyForm); setModalCriar(true) }} className={btnPrimary}>
          <span className="flex items-center gap-2"><Plus size={15} /> Novo Responsável</span>
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500 py-8 text-center">Carregando...</p>
      ) : responsaveis.length === 0 ? (
        <EmptyState icon={Heart} message="Nenhum responsável encontrado" />
      ) : (
        <Table columns={columns} data={responsaveis} />
      )}

      <Modal open={modalCriar} onClose={() => setModalCriar(false)} title="Cadastrar responsável">
        <FormResp />
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={() => setModalCriar(false)} className={btnSecondary}>Cancelar</button>
          <button onClick={handleCriar} className={btnPrimary}>Cadastrar</button>
        </div>
      </Modal>

      <Modal open={modalEditar} onClose={() => setModalEditar(false)} title="Editar responsável">
        <FormResp />
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={() => setModalEditar(false)} className={btnSecondary}>Cancelar</button>
          <button onClick={handleEditar} className={btnPrimary}>Salvar</button>
        </div>
      </Modal>
    </div>
  )
}
