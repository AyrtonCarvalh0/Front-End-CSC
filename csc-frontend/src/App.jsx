import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import PrivateRoute from './components/PrivateRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Alunos from './pages/Alunos'
import Professores from './pages/Professores'
import Turmas from './pages/Turmas'
import Responsaveis from './pages/Responsaveis'
import Pagamentos from './pages/Pagamentos'
import Relatorios from './pages/Relatorios'
import Usuarios from './pages/Usuarios'
import MeuPerfil from './pages/MeuPerfil'
import Auditoria from './pages/Auditoria'
import ChatWidget from './ChatWidget';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        containerStyle={{ zIndex: 9999 }}
        toastOptions={{
          style: {
            background: '#191d28',
            color: '#e2e8f0',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          },
          success: {
            iconTheme: { primary: '#22c55e', secondary: '#191d28' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#191d28' },
          },
        }}
      />
      
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <PrivateRoute><Layout /></PrivateRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard"    element={<Dashboard />} />
          <Route path="alunos"       element={<Alunos />} />
          <Route path="professores"  element={<Professores />} />
          <Route path="turmas"       element={<Turmas />} />
          <Route path="responsaveis" element={<Responsaveis />} />
          <Route path="pagamentos"   element={<Pagamentos />} />
          <Route path="relatorios"   element={<Relatorios />} />
          <Route path="usuarios"     element={<Usuarios />} />
          <Route path="meu-perfil"   element={<MeuPerfil />} />
          <Route path="auditoria"    element={<Auditoria />} />
        </Route>
      </Routes>

      {/* O ChatWidget entra aqui, flutuando globalmente em todas as rotas */}
      <ChatWidget />
      
    </BrowserRouter>
  )
}