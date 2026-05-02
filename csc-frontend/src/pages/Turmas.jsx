import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit2, BookOpen, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import Modal from '../components/Modal'
import Table from '../components/Table'
import Badge from '../components/Badge'
import EmptyState from '../components/EmptyState'

const inputCls = 'w-full bg-bg-card border border-dim rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-accent/50 transition-colors placeholder-gray-600'
const selectCls = inputCls + ' appearance-none'

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

const emptyForm = { nome: '', idadeMin: '', idadeMax: '', capacidade: '', valorMensalidade: '', professorId: '' }

function FormTurma({ form, setForm, professores }) {
  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))
  return (
    <div className="space-y-4">
      <Field label="Nome da turma">
        <input className={inputCls} value={form.nome} onChange={set('nome')} placeholder="Ex: Turma A" />
      </Field>
      <div className="grid grid-cols-3 gap-4">
        <Field label="Idade mínima">
          <input type="number" className={inputCls} value={form.idadeMin} onChange={set('idadeMin')} placeholder="0" />
        </Field>
        <Field label="Idade máxima">
          <input type="number" className={inputCls} value={form.idadeMax} onChange={set('idadeMax')} placeholder="18" />
        </Field>
        <Field label="Capacidade">
          <input type="number" className={inputCls} value={form.capacidade} onChange={set('capacidade')} placeholder="30" />
        </Field>
      </div>
      <Field label="Valor da mensalidade (R$)">
        <input type="number" step="0.01" className={inputCls} value={form.valorMensalidade} onChange={set('valorMensalidade')} placeholder="0,00" />
      </Field>
      <Field label="Professor responsável">
        <select className={selectCls} value={form.professorId} onChange={set('professorId')}>
          <option value="">Selecione um professor</option>
          {professores.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </Field>
    </div>
  )
}

export default function Turmas() {
  const [turmas, setTurmas]           = useState([])
  const [professores, setProfessores] = useState([])
  const [loading, setLoading]         = useState(true)
  const [modalCriar, setModalCriar]   = useState(false)
  const [modalEditar, setModalEditar] = useState(false)
  const [modalAlunos, setModalAlunos] = useState(false)
  const [turmaSel, setTurmaSel]       = useState(null)
  const [alunosDaTurma, setAlunosDaTurma] = useState([])
  const [form, setForm]               = useState(emptyForm)

  const load = async () => {
    setLoading(true)
    try {
      const [t, p] = await Promise.all([api.get('/turmas'), api.get('/professores')])
      setTurmas(t.data)
      setProfessores(p.data)
    } catch {
      toast.error('Erro ao carregar turmas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const payload = () => ({
    nome: form.nome,
    idadeMin: form.idadeMin ? Number(form.idadeMin) : null,
    idadeMax: form.idadeMax ? Number(form.idadeMax) : null,
    capacidade: form.capacidade ? Number(form.capacidade) : null,
    valorMensalidade: form.valorMensalidade ? Number(form.valorMensalidade) : null,
    professor: form.professorId ? { id: form.professorId } : null,
  })

  const handleCriar = async () => {
    if (!form.nome) return toast.error('Nome é obrigatório')
    try {
      await api.post('/turmas', payload())
      toast.success('Turma criada!')
      setModalCriar(false)
      setForm(emptyForm)
      load()
    } catch (e) {
      toast.error(e.response?.data?.message ?? 'Erro ao criar')
    }
  }

  const handleEditar = async () => {
    try {
      await api.put(`/turmas/${turmaSel.id}`, payload())
      toast.success('Turma atualizada!')
      setModalEditar(false)
      load()
    } catch (e) {
      toast.error(e.response?.data?.message ?? 'Erro ao atualizar')
    }
  }

  const handleDeletar = async (turma) => {
    if (!confirm(`Deletar ${turma.nome}?`)) return
    try {
      await api.delete(`/turmas/${turma.id}`)
      toast.success('Turma removida')
      load()
    } catch (e) {
      toast.error(e.response?.data?.message ?? 'Erro ao deletar')
    }
  }

  const handleVerAlunos = async (turma) => {
    try {
      let lista = []
      const r1 = await api.get(`/turmas/${turma.id}/alunos`)
      if (r1.data.length > 0) {
        lista = r1.data
      } else {
        const r2 = await api.get('/aluno')
        lista = r2.data.filter(a => a.turma?.id === turma.id)
      }
      setAlunosDaTurma(lista)
      setTurmaSel(turma)
      setModalAlunos(true)
    } catch {
      toast.error('Erro ao carregar alunos da turma')
    }
  }

  const abrirEditar = (turma) => {
    setTurmaSel(turma)
    setForm({
      nome: turma.nome ?? '',
      idadeMin: turma.idadeMin ?? '',
      idadeMax: turma.idadeMax ?? '',
      capacidade: turma.capacidade ?? '',
      valorMensalidade: turma.valorMensalidade ?? '',
      professorId: turma.professor?.id ?? '',
    })
    setModalEditar(true)
  }

  const fmt = (v) => v?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) ?? '—'

  const columns = [
    { key: 'nome',       label: 'Nome',        render: r => <span className="font-medium text-gray-200">{r.nome}</span> },
    { key: 'faixa',      label: 'Faixa etária', render: r => r.idadeMin != null ? `${r.idadeMin} – ${r.idadeMax} anos` : '—' },
    { key: 'capacidade', label: 'Capacidade',   render: r => r.capacidade ?? '—' },
    {
      key: 'valor', label: 'Mensalidade',
      render: r => r.valorMensalidade
        ? <Badge color="accent">{fmt(r.valorMensalidade)}</Badge>
        : <Badge>Sem valor</Badge>,
    },
    { key: 'professor', label: 'Professor', render: r => r.professor?.name ?? '—' },
    {
      key: 'acoes', label: 'Ações',
      render: r => (
        <div className="flex gap-2">
          <button
            onClick={e => { e.stopPropagation(); handleVerAlunos(r) }}
            title="Ver alunos"
            className="p-1.5 rounded-lg text-gray-500 hover:text-accent hover:bg-accent/10 transition-colors"
          >
            <Users size={14} />
          </button>
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
      <div className="flex justify-end">
        <button onClick={() => { setForm(emptyForm); setModalCriar(true) }} className={btnPrimary}>
          <span className="flex items-center gap-2"><Plus size={15} /> Nova Turma</span>
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500 py-8 text-center">Carregando...</p>
      ) : turmas.length === 0 ? (
        <EmptyState icon={BookOpen} message="Nenhuma turma cadastrada" />
      ) : (
        <Table columns={columns} data={turmas} />
      )}

      <Modal open={modalCriar} onClose={() => setModalCriar(false)} title="Nova turma">
        <FormTurma form={form} setForm={setForm} professores={professores} />
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={() => setModalCriar(false)} className={btnSecondary}>Cancelar</button>
          <button onClick={handleCriar} className={btnPrimary}>Criar</button>
        </div>
      </Modal>

      <Modal open={modalEditar} onClose={() => setModalEditar(false)} title="Editar turma">
        <FormTurma form={form} setForm={setForm} professores={professores} />
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={() => setModalEditar(false)} className={btnSecondary}>Cancelar</button>
          <button onClick={handleEditar} className={btnPrimary}>Salvar</button>
        </div>
      </Modal>

      <Modal open={modalAlunos} onClose={() => setModalAlunos(false)} title={`Alunos — ${turmaSel?.nome}`} size="lg">
        {alunosDaTurma.length === 0 ? (
          <p className="text-sm text-gray-600 text-center py-8">Nenhum aluno nesta turma</p>
        ) : (
          <div className="space-y-2">
            {alunosDaTurma.map(a => (
              <div key={a.id} className="flex items-center justify-between py-2.5 px-3 bg-bg-card rounded-lg border border-dim">
                <span className="text-sm text-gray-200">{a.nome}</span>
                <span className="text-xs font-mono text-gray-500">{a.cpf}</span>
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-600 mt-4">{alunosDaTurma.length} aluno(s)</p>
      </Modal>
    </div>
  )
}
