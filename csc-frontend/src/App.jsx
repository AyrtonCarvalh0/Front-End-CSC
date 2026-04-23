import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Alunos from './pages/Alunos'
import Professores from './pages/Professores'
import Turmas from './pages/Turmas'
import Responsaveis from './pages/Responsaveis'
import Pagamentos from './pages/Pagamentos'
import Relatorios from './pages/Relatorios'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1f2330',
            color: '#e8eaf0',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '10px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#2dd4a0', secondary: '#0a0b0e' } },
          error:   { iconTheme: { primary: '#ff5c7a', secondary: '#0a0b0e' } },
        }}
      />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard"    element={<Dashboard />} />
          <Route path="alunos"       element={<Alunos />} />
          <Route path="professores"  element={<Professores />} />
          <Route path="turmas"       element={<Turmas />} />
          <Route path="responsaveis" element={<Responsaveis />} />
          <Route path="pagamentos"   element={<Pagamentos />} />
          <Route path="relatorios"   element={<Relatorios />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
