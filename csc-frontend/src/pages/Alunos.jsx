import { useEffect, useState } from 'react'
import { Search, Plus, Trash2, FileText, Edit2, GraduationCap } from 'lucide-react'
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

const emptyForm = { nome: '', cpf: '', data_nascimento: '', responsavelId: '', turmaId: '' }

function FormAluno({ form, setForm, turmas, responsaveis }) {
  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Nome completo">
          <input className={inputCls} value={form.nome} onChange={set('nome')} placeholder="Ex: João Silva" />
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
      <Field label="Data de nascimento">
        <input type="date" className={inputCls} value={form.data_nascimento} onChange={set('data_nascimento')} />
      </Field>
      <Field label="Responsável">
        <select className={selectCls} value={form.responsavelId} onChange={set('responsavelId')}>
          <option value="">Selecione um responsável</option>
          {responsaveis.map(r => (
            <option key={r.id} value={r.id}>{r.name} — {r.cpf}</option>
          ))}
        </select>
      </Field>
      <Field label="Turma">
        <select className={selectCls} value={form.turmaId} onChange={set('turmaId')}>
          <option value="">Selecione uma turma</option>
          {turmas.map(t => (
            <option key={t.id} value={t.id}>
              {t.nome}{t.valorMensalidade ? ` — R$ ${t.valorMensalidade}` : ''}
            </option>
          ))}
        </select>
      </Field>
    </div>
  )
}

export default function Alunos() {
  const [alunos, setAlunos]               = useState([])
  const [turmas, setTurmas]               = useState([])
  const [responsaveis, setResponsaveis]   = useState([])
  const [loading, setLoading]             = useState(true)
  const [busca, setBusca]                 = useState('')
  const [modalCriar, setModalCriar]       = useState(false)
  const [modalEditar, setModalEditar]     = useState(false)
  const [modalFicha, setModalFicha]       = useState(false)
  const [fichaData, setFichaData]         = useState(null)
  const [alunoSel, setAlunoSel]           = useState(null)
  const [form, setForm]                   = useState(emptyForm)

  const load = async () => {
    setLoading(true)
    try {
      const [a, t, r] = await Promise.all([
        api.get('/aluno'),
        api.get('/turmas'),
        api.get('/responsavel'),
      ])
      setAlunos(a.data)
      setTurmas(t.data)
      setResponsaveis(r.data)
    } catch {
      toast.error('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const alunosFiltrados = alunos.filter(a =>
    a.nome?.toLowerCase().includes(busca.toLowerCase()) ||
    a.cpf?.includes(busca)
  )

  const handleCriar = async () => {
    if (!form.nome || !form.cpf) return toast.error('Nome e CPF são obrigatórios')
    try {
      await api.post('/aluno', {
        nome: form.nome,
        cpf: form.cpf,
        data_nascimento: form.data_nascimento || null,
        responsavel: form.responsavelId ? { id: form.responsavelId } : null,
        turma: form.turmaId ? { id: form.turmaId } : null,
      })
      toast.success('Aluno cadastrado!')
      setModalCriar(false)
      setForm(emptyForm)
      load()
    } catch (e) {
      toast.error(e.response?.data?.message ?? 'Erro ao cadastrar')
    }
  }

  const handleEditar = async () => {
    try {
      await api.put(`/aluno/${alunoSel.id}`, {
        nome: form.nome,
        cpf: form.cpf,
        data_nascimento: form.data_nascimento || null,
        responsavel: form.responsavelId ? { id: form.responsavelId } : null,
        turma: form.turmaId ? { id: form.turmaId } : null,
      })
      toast.success('Aluno atualizado!')
      setModalEditar(false)
      load()
    } catch (e) {
      toast.error(e.response?.data?.message ?? 'Erro ao atualizar')
    }
  }

  const handleDeletar = async (aluno) => {
    if (!confirm(`Deletar ${aluno.nome}?`)) return
    try {
      await api.delete(`/aluno/${aluno.id}`)
      toast.success('Aluno removido')
      load()
    } catch (e) {
      toast.error(e.response?.data?.message ?? 'Erro ao deletar')
    }
  }

  const handleFicha = async (aluno) => {
    try {
      const { data } = await api.get(`/aluno/ficha/${aluno.cpf}`)
      setFichaData(data)
      setModalFicha(true)
    } catch {
      toast.error('Erro ao carregar ficha')
    }
  }

  const abrirEditar = (aluno) => {
    setAlunoSel(aluno)
    setForm({
      nome: aluno.nome ?? '',
      cpf: aluno.cpf ?? '',
      data_nascimento: aluno.data_nascimento ?? '',
      responsavelId: aluno.responsavel?.id ?? '',
      turmaId: aluno.turma?.id ?? '',
    })
    setModalEditar(true)
  }

  const columns = [
    {
      key: 'nome', label: 'Nome',
      render: r => <span className="font-medium text-gray-200">{r.nome}</span>,
    },
    {
      key: 'cpf', label: 'CPF',
      render: r => <span className="font-mono text-xs text-gray-400">{r.cpf}</span>,
    },
    {
      key: 'turma', label: 'Turma',
      render: r => r.turma ? <Badge color="accent">{r.turma.nome}</Badge> : <Badge>Sem turma</Badge>,
    },
    {
      key: 'responsavel', label: 'Responsável',
      render: r => r.responsavel?.name ?? '—',
    },
    {
      key: 'acoes', label: 'Ações',
      render: r => (
        <div className="flex gap-2">
          <button
            onClick={e => { e.stopPropagation(); handleFicha(r) }}
            title="Ver ficha"
            className="p-1.5 rounded-lg text-gray-500 hover:text-accent hover:bg-accent/10 transition-colors"
          >
            <FileText size={14} />
          </button>
          <button
            onClick={e => { e.stopPropagation(); abrirEditar(r) }}
            title="Editar"
            className="p-1.5 rounded-lg text-gray-500 hover:text-warning hover:bg-warning/10 transition-colors"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={e => { e.stopPropagation(); handleDeletar(r) }}
            title="Deletar"
            className="p-1.5 rounded-lg text-gray-500 hover:text-danger hover:bg-danger/10 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ]

  const btnPrimary = 'px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm rounded-lg transition-colors font-medium'
  const btnSecondary = 'px-4 py-2 text-sm text-gray-400 hover:text-gray-200 transition-colors'

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            className="w-full bg-bg-secondary border border-dim rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-accent/50 transition-colors"
            placeholder="Buscar por nome ou CPF..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
        </div>
        <button onClick={() => { setForm(emptyForm); setModalCriar(true) }} className={btnPrimary}>
          <span className="flex items-center gap-2"><Plus size={15} /> Novo Aluno</span>
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500 py-8 text-center">Carregando...</p>
      ) : alunosFiltrados.length === 0 ? (
        <EmptyState icon={GraduationCap} message="Nenhum aluno encontrado" />
      ) : (
        <Table columns={columns} data={alunosFiltrados} />
      )}

      <Modal open={modalCriar} onClose={() => setModalCriar(false)} title="Cadastrar aluno">
        <FormAluno form={form} setForm={setForm} turmas={turmas} responsaveis={responsaveis} />
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={() => setModalCriar(false)} className={btnSecondary}>Cancelar</button>
          <button onClick={handleCriar} className={btnPrimary}>Cadastrar</button>
        </div>
      </Modal>

      <Modal open={modalEditar} onClose={() => setModalEditar(false)} title="Editar aluno">
        <FormAluno form={form} setForm={setForm} turmas={turmas} responsaveis={responsaveis} />
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={() => setModalEditar(false)} className={btnSecondary}>Cancelar</button>
          <button onClick={handleEditar} className={btnPrimary}>Salvar</button>
        </div>
      </Modal>

      <Modal open={modalFicha} onClose={() => setModalFicha(false)} title="Ficha do Aluno" size="lg">
        {fichaData && (
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-bg-card rounded-lg p-4 border border-dim">
                <p className="text-xs text-gray-500 mb-1">Aluno</p>
                <p className="font-medium">{fichaData.nomeAluno}</p>
              </div>
              <div className="bg-bg-card rounded-lg p-4 border border-dim">
                <p className="text-xs text-gray-500 mb-1">Turma</p>
                <p className="font-medium">{fichaData.turma ?? '—'}</p>
              </div>
              <div className="bg-bg-card rounded-lg p-4 border border-dim">
                <p className="text-xs text-gray-500 mb-1">Responsável</p>
                <p className="font-medium">{fichaData.nomeResponsavel}</p>
              </div>
            </div>

            <div className="bg-danger/10 border border-danger/20 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Total em aberto</p>
              <p className="text-xl font-semibold text-danger">
                {fichaData.valorTotalEmAberto?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) ?? 'R$ 0,00'}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Histórico de mensalidades</p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {!fichaData.mensalidades?.length ? (
                  <p className="text-sm text-gray-600 text-center py-4">Nenhuma mensalidade encontrada</p>
                ) : fichaData.mensalidades.map(m => (
                  <div key={m.id} className="flex items-center justify-between py-2.5 px-3 bg-bg-card rounded-lg border border-dim">
                    <div className="flex items-center gap-3">
                      <Badge color={m.pago ? 'success' : 'danger'}>{m.pago ? 'Pago' : 'Pendente'}</Badge>
                      <span className="text-sm font-mono text-gray-400">{m.mes}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium">
                        {m.valor?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                      {m.dataPagamento && (
                        <p className="text-xs text-gray-600">
                          {new Date(m.dataPagamento).toLocaleDateString('pt-BR')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
