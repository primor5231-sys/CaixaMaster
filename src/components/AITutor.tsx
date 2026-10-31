import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, ChatMessage } from '../types';
import { Bot, Send, Sparkles, User, Lightbulb, RefreshCw, MessageSquare } from 'lucide-react';
import { playSound } from '../services/soundEffects';

interface AITutorProps {
  profile: UserProfile;
  initialPrompt?: string;
}

export const AITutor: React.FC<AITutorProps> = ({ profile, initialPrompt }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'tutor',
      text: `Olá, futuro Técnico Bancário da Caixa! 🏦✨\n\nEu sou o seu **Tutor CaixaMaster**, especialista no edital e nas bancas oficiais (Cesgranrio e Cebraspe).\n\nVocê pode me fazer qualquer pergunta sobre:\n* **Conhecimentos Bancários** (CMN, BACEN, SELIC, FGC, Pix, Open Finance)\n* **Produtos CEF** (FGTS, Penhor, Habitação Minha Casa Minha Vida, Poupança)\n* **Português & Redação** da Cesgranrio\n* **Matemática Financeira** (SAC vs Price, Juros compostos)\n* **TI & Segurança da Informação**\n\nComo posso ajudar seus estudos hoje rumo à posse?`,
      timestamp: Date.now(),
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    'Explique de forma simples o que é a Lei de Responsabilidade Fiscal para o meu concurso',
    'Explique a diferença entre CMN e BACEN para o concurso da Caixa',
    'Quais são os produtos exclusivos da Caixa e como funciona o Penhor?',
    'Como cai a regra de juros SAC e Price na Cesgranrio?',
    'Quais os 5 princípios do Artigo 37 (LIMPE) e como a banca cobra?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (initialPrompt) {
      sendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);
    playSound('click', profile.soundEnabled);

    try {
      const res = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            content: m.text,
          })),
          context: {
            targetRole: profile.targetRole,
            subject: 'Geral',
          },
        }),
      });

      const data = await res.json();
      const tutorReply = data.reply || 'Desculpe, ocorreu uma instabilidade momentânea na resposta do Tutor.';

      const tutorMsg: ChatMessage = {
        id: `tut_${Date.now()}`,
        sender: 'tutor',
        text: tutorReply,
        timestamp: Date.now(),
        isFallback: data.isFallback,
      };

      setMessages((prev) => [...prev, tutorMsg]);
      playSound('coin', profile.soundEnabled);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `tut_err_${Date.now()}`,
          sender: 'tutor',
          text: 'Não consegui me conectar com o servidor no momento. Verifique sua conexão com a internet.',
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage(inputValue);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pb-28 pt-4 flex flex-col h-[calc(100vh-8.5rem)]">
      {/* Header */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-[#003366] to-[#004d80] border border-sky-400/20 shadow-xl mb-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#00A3E0] to-[#004481] border border-sky-300/40 flex items-center justify-center shadow-lg glow-cef">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-base font-black flex items-center gap-2">
              Tutor CaixaMaster (IA)
              <span className="text-[10px] bg-[#F39200] text-slate-950 px-1.5 py-0.5 rounded font-black">
                OFICIAL
              </span>
            </h1>
            <p className="text-xs text-sky-200">
              Professor com inteligência no edital da Caixa Econômica Federal
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            playSound('click', profile.soundEnabled);
            setMessages([
              {
                id: 'welcome_reset',
                sender: 'tutor',
                text: 'Chat reiniciado! Qual assunto do edital da Caixa você deseja dominar agora?',
                timestamp: Date.now(),
              },
            ]);
          }}
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
          title="Limpar Conversa"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Quick Questions */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-2 scrollbar-none">
        {suggestedPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => sendMessage(prompt)}
            className="flex-shrink-0 px-3 py-1.5 rounded-xl bg-[#002244] border border-[#003870] hover:border-sky-400 text-sky-200 hover:text-white text-xs font-medium transition cursor-pointer shadow-sm flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 text-[#FFA41C]" />
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto space-y-4 p-2 pr-1">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm shadow ${
                  isUser
                    ? 'bg-[#F39200] text-slate-950 font-bold'
                    : 'bg-[#004481] border border-sky-400/40 text-sky-200'
                }`}
              >
                {isUser ? profile.avatar : <Bot className="w-4 h-4 text-sky-300" />}
              </div>

              <div
                className={`max-w-[85%] rounded-3xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-md ${
                  isUser
                    ? 'bg-[#005599] text-white rounded-tr-none'
                    : 'bg-[#002244] border border-[#003870] text-slate-100 rounded-tl-none'
                }`}
              >
                {msg.text}
                {msg.isFallback && (
                  <div className="mt-2 text-[10px] text-amber-300/80 border-t border-white/10 pt-1">
                    * Resposta do banco de mentoria Caixa.
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#004481] border border-sky-400/40 flex items-center justify-center">
              <Bot className="w-4 h-4 text-sky-300 animate-spin" />
            </div>
            <div className="bg-[#002244] border border-[#003870] rounded-2xl px-4 py-3 text-xs text-sky-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-[#F39200] animate-pulse delay-100" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse delay-200" />
              <span className="text-slate-400 ml-1">O Tutor CaixaMaster está formulando a explicação didática...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="pt-2">
        <div className="flex items-center gap-2 p-2 rounded-2xl bg-[#002244] border-2 border-[#004481] focus-within:border-sky-400 shadow-xl transition">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pergunte qualquer dúvida do edital da Caixa..."
            className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={() => sendMessage(inputValue)}
            disabled={!inputValue.trim() || isTyping}
            className={`p-2.5 rounded-xl font-bold transition flex items-center justify-center ${
              inputValue.trim() && !isTyping
                ? 'bg-[#F39200] text-slate-950 hover:bg-[#FFA41C] shadow cursor-pointer active:scale-95'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
