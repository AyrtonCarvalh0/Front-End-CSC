import React, { useState, useRef, useEffect } from 'react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'agent', text: 'Olá! Sou o assistente de IA do Colégio Silva Carvalho. Como posso ajudar você hoje?' }
  ]);


  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

   
    const token = localStorage.getItem('csc_token');
    try {
      const response = await fetch('http://localhost:8001/agente/perguntar', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ pergunta: userMessage })
      });

      if (!response.ok) {
        throw new Error('Falha na comunicação com o agente.');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'agent', text: data.resposta }]);
      
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'agent', text: 'Desculpe, ocorreu um erro ao processar sua solicitação. Verifique sua conexão ou se você está logado.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      
      {/* Janela do Chat */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[500px] bg-white shadow-2xl rounded-2xl flex flex-col mb-4 border border-gray-200 overflow-hidden animate-fade-in-up">
          
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
            <div>
              <h3 className="font-bold text-lg">Agente CSC</h3>
              <p className="text-blue-100 text-xs">Inteligência Artificial Escolar</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200 text-2xl leading-none">
              &times;
            </button>
          </div>

          {/* Área de Mensagens */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-sm' 
                      : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 text-gray-500 text-xs p-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
                  <span className="animate-bounce">●</span><span className="animate-bounce delay-75">●</span><span className="animate-bounce delay-150">●</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input de Texto */}
          <div className="p-3 bg-white border-t border-gray-200">
            <form onSubmit={handleSend} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pergunte sobre turmas, alunos..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm text-gray-900 placeholder-gray-400"
                disabled={isLoading}
             />
              <button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="bg-blue-600 text-white px-4 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bolinha Virtual (Botão Flutuante) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? 'hidden' : 'flex'} w-16 h-16 bg-blue-600 rounded-full text-white shadow-xl items-center justify-center hover:bg-blue-700 hover:scale-105 transition-all duration-200 cursor-pointer border-4 border-white`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
      </button>

    </div>
  );
}