import { useState } from 'react'

export function useConfirmacao() {
  const [config, setConfig] = useState({
    open: false,
    titulo: '',
    mensagem: '',
    tipo: 'danger',
    onConfirmar: () => {},
  })

  const confirmar = ({ titulo, mensagem, tipo = 'danger', onConfirmar }) => {
    setConfig({ open: true, titulo, mensagem, tipo, onConfirmar })
  }

  const fechar = () => setConfig(c => ({ ...c, open: false }))

  return { config, confirmar, fechar }
}
