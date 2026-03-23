import { useState, useRef, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { useFinanzas } from "../context/FinanzasContext"
import { Send, Bot, User, Trash2, Sparkles } from "lucide-react"

const fmt = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)

const SUGERENCIAS = [
  "¿En qué categoría gasto más?",
  "¿Cómo va mi balance este mes?",
  "¿Cuánto puedo ahorrar al mes?",
  "Dame consejos para reducir gastos",
  "¿Voy bien con mis presupuestos?",
]

export default function Asistente() {
  const { D } = useOutletContext()
  const { transactions, ingresos, gastos, balance, budgets, goals, mesSeleccionado } = useFinanzas()
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '¡Hola! Soy tu asistente financiero personal 🤖💰 Analizo tus datos en tiempo real. ¿En qué te puedo ayudar hoy?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const buildContext = () => {
    const txMes = transactions.filter(t => t.fecha?.startsWith(mesSeleccionado))
    const gastosMap = txMes.filter(t => t.tipo === 'gasto').reduce((acc, t) => {
      acc[t.categoria] = (acc[t.categoria] || 0) + t.monto; return acc
    }, {})
    const budgetStatus = budgets.map(b => {
      const gastado = txMes.filter(t => t.tipo === 'gasto' && t.categoria === b.categoria).reduce((s, t) => s + t.monto, 0)
      return `${b.categoria}: gastado ${fmt(gastado)} de ${fmt(b.limite)} (${Math.round((gastado/b.limite)*100)}%)`
    })

    return `Eres un asistente financiero personal experto. Analiza los datos del usuario y da consejos concretos, útiles y en español.

DATOS FINANCIEROS DEL USUARIO (${mesSeleccionado}):
- Ingresos del mes: ${fmt(ingresos)}
- Gastos del mes: ${fmt(gastos)}
- Balance actual: ${fmt(balance)}
- Total transacciones: ${transactions.length}

GASTOS POR CATEGORÍA ESTE MES:
${Object.entries(gastosMap).map(([k,v]) => `- ${k}: ${fmt(v)}`).join('\n') || 'Sin gastos registrados'}

PRESUPUESTOS:
${budgetStatus.join('\n') || 'Sin presupuestos configurados'}

METAS DE AHORRO:
${goals.map(g => `- ${g.emoji} ${g.nombre}: ${fmt(g.actual)} de ${fmt(g.objetivo)} (${Math.round((g.actual/g.objetivo)*100)}%)`).join('\n') || 'Sin metas configuradas'}

Responde de forma concisa, amigable y con emojis. Da consejos específicos basados en los datos reales del usuario.`
  }

  const sendMessage = async (text) => {
    const msg = text || input.trim()
    if (!msg || loading) return
    setInput('')
    setMessages(p => [...p, { role: 'user', content: msg }])
    setLoading(true)

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-allow-browser': 'true'
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 500,
          system: buildContext(),
          messages: [
            ...messages.filter(m => m.role !== 'assistant' || messages.indexOf(m) > 0).map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: msg }
          ]
        })
      })
      const data = await response.json()
      const reply = data.content?.[0]?.text || 'Lo siento, hubo un error. Intenta de nuevo.'
      setMessages(p => [...p, { role: 'assistant', content: reply }])
    } catch (err) {
      setMessages(p => [...p, { role: 'assistant', content: '❌ Error de conexión. Verifica tu API key.' }])
    }
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>

      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: D.text, margin: '0 0 3px', letterSpacing: '-0.4px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={20} color={D.accent} /> Asistente IA
            </h1>
            <p style={{ fontSize: 12, color: D.textMuted, margin: 0 }}>Analiza tus finanzas con inteligencia artificial</p>
          </div>
          <button onClick={() => setMessages([{ role: 'assistant', content: '¡Hola! Soy tu asistente financiero personal 🤖💰 ¿En qué te puedo ayudar?' }])}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: D.surface, border: `1px solid ${D.border}`, borderRadius: 7, color: D.textMuted, fontSize: 12, cursor: 'pointer' }}>
            <Trash2 size={12} /> Limpiar
          </button>
        </div>
      </div>

      {/* Sugerencias */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
        {SUGERENCIAS.map(s => (
          <button key={s} onClick={() => sendMessage(s)} style={{ padding: '5px 10px', background: D.accentBg, border: `1px solid ${D.accent}22`, borderRadius: 100, fontSize: 11, color: D.accent, cursor: 'pointer', fontWeight: 500, whiteSpace: 'nowrap' }}>{s}</button>
        ))}
      </div>

      {/* Chat */}
      <div style={{ flex: 1, overflowY: 'auto', background: D.bg, border: `1px solid ${D.border}`, borderRadius: 10, padding: 16, marginBottom: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 16, flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: m.role === 'user' ? D.accent : D.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {m.role === 'user' ? <User size={14} color="#fff" /> : <Bot size={14} color={D.accent} />}
            </div>
            <div style={{ maxWidth: '75%', padding: '10px 14px', borderRadius: m.role === 'user' ? '12px 4px 12px 12px' : '4px 12px 12px 12px', background: m.role === 'user' ? D.accent : D.surface, border: m.role === 'user' ? 'none' : `1px solid ${D.border}` }}>
              <p style={{ fontSize: 13, color: m.role === 'user' ? '#fff' : D.text, margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{m.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: D.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={14} color={D.accent} />
            </div>
            <div style={{ padding: '10px 14px', background: D.surface, border: `1px solid ${D.border}`, borderRadius: '4px 12px 12px 12px' }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: D.accent, animation: `bounce 1s ${i*0.2}s infinite` }} />)}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Pregúntame sobre tus finanzas..."
          style={{ flex: 1, padding: '10px 14px', background: D.bg, border: `1px solid ${D.border}`, borderRadius: 8, fontSize: 13, color: D.text, outline: 'none' }}
        />
        <button onClick={() => sendMessage()} disabled={loading || !input.trim()} style={{ width: 42, height: 42, borderRadius: 8, background: D.accent, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: loading || !input.trim() ? 0.5 : 1 }}>
          <Send size={16} color="#fff" />
        </button>
      </div>

      <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }`}</style>
    </div>
  )
}