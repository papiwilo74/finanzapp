import { useState } from "react"
import { useFinanzas } from "../context/FinanzasContext"
import { useOutletContext } from "react-router-dom"
import { Plus, Trash2, Target, PlusCircle, MinusCircle } from "lucide-react"

const fmt = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)
const EMOJIS = ['🎯', '✈️', '💻', '🏠', '🚗', '🎓', '💍', '🛡️', '📱', '🎸']
const COLORS_OPT = ['#5b5fcf', '#059669', '#d97706', '#dc2626', '#0ea5e9', '#8b5cf6', '#f59e0b', '#ec4899']

const EMPTY = { nombre: '', objetivo: '', actual: '', emoji: '🎯', color: '#5b5fcf' }

export default function Metas() {
  const { goals, addGoal, updateGoal, deleteGoal } = useFinanzas()
  const { D } = useOutletContext()
  const [form, setForm] = useState(false)
  const [data, setData] = useState(EMPTY)
  const [aportando, setAportando] = useState(null)
  const [aporte, setAporte] = useState('')

  const set = (k, v) => setData(p => ({ ...p, [k]: v }))
  const submit = () => {
    if (!data.nombre || !data.objetivo) return
    addGoal({ ...data, objetivo: Number(data.objetivo), actual: Number(data.actual) || 0 })
    setData(EMPTY); setForm(false)
  }
  const aplicarAporte = (g, sumar) => {
    const val = Number(aporte)
    if (!val) return
    const nuevo = sumar ? Math.min(g.actual + val, g.objetivo) : Math.max(g.actual - val, 0)
    updateGoal(g.id, nuevo)
    setAportando(null); setAporte('')
  }

  const inp = { width: '100%', padding: '8px 11px', border: `1px solid ${D.border}`, borderRadius: 7, fontSize: 13, color: D.text, background: D.bg, outline: 'none', boxSizing: 'border-box' }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: D.text, margin: '0 0 3px', letterSpacing: '-0.4px' }}>Metas de ahorro</h1>
          <p style={{ fontSize: 12, color: D.textMuted, margin: 0 }}>{goals.length} metas activas</p>
        </div>
        <button onClick={() => setForm(!form)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: D.accent, border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
          <Plus size={14} /> Nueva meta
        </button>
      </div>

      {/* Formulario */}
      {form && (
        <div style={{ background: D.bg, border: `1px solid ${D.border}`, borderRadius: 10, padding: 20, marginBottom: 18 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: D.text, margin: '0 0 14px' }}>Nueva meta de ahorro</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: D.textMuted, display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nombre</label>
              <input placeholder="Ej: Viaje a Europa" value={data.nombre} onChange={e => set('nombre', e.target.value)} style={inp} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: D.textMuted, display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Objetivo (COP)</label>
              <input type="number" placeholder="0" value={data.objetivo} onChange={e => set('objetivo', e.target.value)} style={inp} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: D.textMuted, display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ahorro actual (COP)</label>
              <input type="number" placeholder="0" value={data.actual} onChange={e => set('actual', e.target.value)} style={inp} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: D.textMuted, display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Emoji</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {EMOJIS.map(e => (
                  <button key={e} onClick={() => set('emoji', e)} style={{ width: 30, height: 30, borderRadius: 7, border: `1.5px solid ${data.emoji === e ? D.accent : D.border}`, background: data.emoji === e ? D.accentBg : D.surface, cursor: 'pointer', fontSize: 14 }}>{e}</button>
                ))}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: D.textMuted, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Color</label>
            <div style={{ display: 'flex', gap: 7 }}>
              {COLORS_OPT.map(c => (
                <button key={c} onClick={() => set('color', c)} style={{ width: 22, height: 22, borderRadius: '50%', background: c, border: data.color === c ? '3px solid #111' : '2px solid transparent', cursor: 'pointer' }} />
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button onClick={submit} style={{ padding: '8px 18px', background: D.accent, border: 'none', borderRadius: 7, color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Crear meta</button>
            <button onClick={() => { setForm(false); setData(EMPTY) }} style={{ padding: '8px 12px', background: D.surface, border: `1px solid ${D.border}`, borderRadius: 7, color: D.textMuted, fontSize: 13, cursor: 'pointer' }}>Cancelar</button>
          </div>
        </div>
      )}

      {/* Grid de metas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {goals.map(g => {
          const pct = Math.min(Math.round((g.actual / g.objetivo) * 100), 100)
          const completada = pct >= 100
          return (
            <div key={g.id} style={{ background: D.bg, border: `1px solid ${completada ? g.color + '44' : D.border}`, borderRadius: 12, padding: 20, position: 'relative', transition: 'all 0.3s' }}>
              {completada && <div style={{ position: 'absolute', top: 12, right: 12, fontSize: 10, fontWeight: 700, background: g.color, color: '#fff', padding: '2px 8px', borderRadius: 100 }}>¡META!</div>}

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: g.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{g.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: D.text }}>{g.nombre}</div>
                  <div style={{ fontSize: 11, color: D.textLight, marginTop: 2 }}>Meta: {fmt(g.objetivo)}</div>
                </div>
                <button onClick={() => deleteGoal(g.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: D.textLight, display: 'flex', padding: 3, borderRadius: 5 }}
                  onMouseEnter={e => e.currentTarget.style.color = '#dc2626'} onMouseLeave={e => e.currentTarget.style.color = D.textLight}>
                  <Trash2 size={13} />
                </button>
              </div>

              {/* Barra circular usando CSS */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <div style={{ position: 'relative', width: 64, height: 64, flexShrink: 0 }}>
                  <svg width="64" height="64" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="26" fill="none" stroke={D.surface} strokeWidth="8" />
                    <circle cx="32" cy="32" r="26" fill="none" stroke={g.color} strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 26}`}
                      strokeDashoffset={`${2 * Math.PI * 26 * (1 - pct / 100)}`}
                      strokeLinecap="round"
                      transform="rotate(-90 32 32)" style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: g.color }}>{pct}%</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: D.textLight, marginBottom: 3 }}>Ahorrado</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: g.color }}>{fmt(g.actual)}</div>
                  <div style={{ fontSize: 11, color: D.textLight, marginTop: 2 }}>Faltan {fmt(Math.max(g.objetivo - g.actual, 0))}</div>
                </div>
              </div>

              {/* Botones de aporte */}
              {aportando === g.id ? (
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <input type="number" placeholder="Monto..." value={aporte} onChange={e => setAporte(e.target.value)} style={{ ...inp, flex: 1, padding: '6px 10px', fontSize: 12 }} autoFocus />
                  <button onClick={() => aplicarAporte(g, true)} style={{ padding: '6px 10px', background: '#059669', border: 'none', borderRadius: 6, color: '#fff', fontSize: 11, cursor: 'pointer' }}>+</button>
                  <button onClick={() => aplicarAporte(g, false)} style={{ padding: '6px 10px', background: '#dc2626', border: 'none', borderRadius: 6, color: '#fff', fontSize: 11, cursor: 'pointer' }}>−</button>
                  <button onClick={() => { setAportando(null); setAporte('') }} style={{ padding: '6px 10px', background: D.surface, border: `1px solid ${D.border}`, borderRadius: 6, color: D.textMuted, fontSize: 11, cursor: 'pointer' }}>✕</button>
                </div>
              ) : (
                <button onClick={() => setAportando(g.id)} style={{ width: '100%', padding: '7px', background: g.color + '14', border: `1px solid ${g.color}33`, borderRadius: 7, color: g.color, fontSize: 12, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                  <PlusCircle size={13} /> Registrar aporte
                </button>
              )}
            </div>
          )
        })}
        {!goals.length && (
          <div style={{ textAlign: 'center', padding: 48, color: D.textMuted, background: D.bg, border: `1px solid ${D.border}`, borderRadius: 10, fontSize: 13, gridColumn: '1/-1' }}>
            No tienes metas de ahorro. ¡Crea una!
          </div>
        )}
      </div>
    </div>
  )
}