'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Bot, Send, Sparkles, Loader2, User } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Agent {
  id: string
  name: string
  model: string
  description?: string
  system_prompt?: string
  status?: string
  created_at: string
}

export default function AgentPlaygroundPage() {
  const params = useParams()
  const agentId = params.id as string
  const router = useRouter()

  const [agent, setAgent] = useState<Agent | null>(null)
  const [loadingAgent, setLoadingAgent] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function loadAgent() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('id', agentId)
        .single()

      if (error || !data) {
        router.push('/dashboard')
      } else {
        setAgent(data)
      }
      setLoadingAgent(false)
    }
    if (agentId) loadAgent()
  }, [agentId, router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, sending])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || sending) return

    const userMessage: Message = { role: 'user', content: input }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setSending(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          systemPrompt: agent?.system_prompt,
        }),
      })

      const data = await res.json()
      if (data.content) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.content }])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSending(false)
    }
  }

  if (loadingAgent) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-400">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 md:p-8">
      {/* Header */}
      <div className="max-w-5xl w-full mx-auto space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Volver al Panel
          </button>
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
            <Bot className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-bold text-slate-200">{agent?.name}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase font-mono">
              {agent?.model}
            </span>
          </div>
        </div>

        {/* Prompt Info Banner */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 flex items-start gap-3">
          <Sparkles className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-200">System Prompt del Agente:</span>
            <p className="italic mt-0.5 text-slate-300">&quot;{agent?.system_prompt}&quot;</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="max-w-5xl w-full mx-auto flex-1 my-6 overflow-y-auto bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 flex flex-col space-y-4 max-h-[60vh] scrollbar-thin">
        {messages.length === 0 ? (
          <div className="m-auto text-center space-y-3">
            <Bot className="h-12 w-12 text-slate-700 mx-auto" />
            <p className="text-sm text-slate-400">Playground de Pruebas en Vivo</p>
            <p className="text-xs text-slate-600">Escribe un mensaje para comenzar a probar las respuestas de {agent?.name}.</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 text-sm ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="h-8 w-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div
                className={`max-w-xl rounded-2xl px-4 py-3 whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-cyan-500 text-slate-950 font-medium'
                    : 'bg-slate-900 border border-slate-800 text-slate-200'
                }`}
              >
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div className="h-8 w-8 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center shrink-0">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))
        )}
        {sending && (
          <div className="flex gap-3 text-sm justify-start items-center">
            <div className="h-8 w-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
              <Bot className="h-4 w-4" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-slate-400 text-xs flex items-center gap-2">
              <Loader2 className="h-3 w-3 animate-spin text-cyan-400" /> Generando respuesta...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="max-w-5xl w-full mx-auto">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            placeholder={`Chatear con ${agent?.name}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
          >
            <Send className="h-4 w-4" /> Enviar
          </button>
        </form>
      </div>
    </div>
  )
}
