import { useState } from "react"
import { useFinanzas } from "../context/FinanzasContext"
import { useOutletContext } from "react-router-dom"
import { Plus, Trash2, AlertTriangle, CheckCircle, XCircle } from "lucide-react"

const fmt = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)
const CATS = ['Comida', 'Transporte', 'Vivienda', 'Salud', 'Entretenimiento', 'Ropa', 'Educación', 'Otros']

export default function Presupuestos() {
  const { budgets, addBudget, deleteBudget, txMes } = useFinanzas()
  const { D } = useOutletContext()
  const [form, setForm] = useState(false)
  const [categoria, setCategoria] = useState('Comida')
  const [limite, setLimite] = useState('')

  const getGastado = (cat) => txMes.filter(t => t.tipo === 'gasto' && t.categoria === cat).reduce((s, t) => s + t.monto, 0)

  const submit = () => {
    if (!limite) return
    addBudget({ categoria, limite: Number(limite) })
    setLimite(''); setForm(false)
  }

  const inp = { width: '100%', padding: '8px 11px', border: `1px solid ${D.border}`, borderRadius: 7, fontSize: 13, color: D.text, background: D.bg, outline: 'none', boxSizing: 'border-box' }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: D.text, margin: '0 0 3px', letterSpacing: '-0.4px' }}>Presupuestos</h1>
          <p style={{ fontSize: 12, color: D.textMuted, margin: 0 }}>Controla tus límites de gasto por categoría</p>
        </div>
        <button onClick={() => setForm(!form)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: D.accent, border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
          <Plus size={14} /> Nuevo presupuesto
        </button>
      </div>

      {/* Formulario */}
      {form && (
        <div style={{ background: D.bg, border: `1px solid ${D.border}`, borderRadius: 10, padding: 18, marginBottom: 18 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: D.text, margin: '0 0 14px' }}>Nuevo presupuesto</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 10, alignItems: 'end' }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: D.textMuted, display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Categoría</label>
              <select value={categoria} onChange={e => setCategoria(e.target.value)} style={inp}>
                {CATS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: D.textMuted, display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Límite (COP)</label>
              <input type="number" placeholder="0" value={limite} onChange={e => setLimite(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} style={inp} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={submit} style={{ padding: '8px 16px', background: D.accent, border: 'none', borderRadius: 7, color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Guardar</button>
              <button onClick={() => setForm(false)} style={{ padding: '8px 12px', background: D.surface, border: `1px solid ${D.border}`, borderRadius: 7, color: D.textMuted, fontSize: 13, cursor: 'pointer' }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de presupuestos */}
      <div style={{ display: 'grid', gap: 12 }}>
        {budgets.map(b => {
          const gastado = getGastado(b.categoria)
          const pct = Math.min((gastado / b.limite) * 100, 100)
          const restante = b.limite - gastado
          const estado = pct >= 100 ? 'over' : pct >= 80 ? 'warning' : 'ok'
          const barColor = estado === 'over' ? '#dc2626' : estado === 'warning' ? '#d97706' : '#059669'
          const Icon = estado === 'over' ? XCircle : estado === 'warning' ? AlertTriangle : CheckCircle

          return (
            <div key={b.id} style={{ background: D.bg, border: `1px solid ${estado === 'over' ? 'rgba(220,38,38,0.3)' : estado === 'warning' ? 'rgba(217,119,6,0.3)' : D.border}`, borderRadius: 10, padding: '18px 20px', transition: 'all 0.3s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon size={15} color={barColor} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: D.text }}>{b.categoria}</span>
                  {estado !== 'ok' && (
                    <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 100, background: estado === 'over' ? 'rgba(220,38,38,0.1)' : 'rgba(217,119,6,0.1)', color: barColor }}>
                      {estado === 'over' ? 'SUPERADO' : 'ALERTA'}
                    </span>
                  )}
                </div>
                <button onClick={() => deleteBudget(b.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: D.textLight, display: 'flex', borderRadius: 5, padding: 3 }}
                  onMouseEnter={e => e.currentTarget.style.color = '#dc2626'} onMouseLeave={e => e.currentTarget.style.color = D.textLight}>
                  <Trash2 size={13} />
                </button>
              </div>

              {/* Barra de progreso */}
              <div style={{ height: 8, background: D.surface, borderRadius: 4, overflow: 'hidden', marginBottom: 10 }}>
                <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: 4, transition: 'width 0.6s ease' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 18 }}>
                  <div>
                    <div style={{ fontSize: 10, color: D.textLight, marginBottom: 1 }}>Gastado</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: barColor }}>{fmt(gastado)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: D.textLight, marginBottom: 1 }}>Límite</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: D.text }}>{fmt(b.limite)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: D.textLight, marginBottom: 1 }}>{restante >= 0 ? 'Disponible' : 'Excedido'}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: restante >= 0 ? '#059669' : '#dc2626' }}>{fmt(Math.abs(restante))}</div>
                  </div>
                </div>
                <span style={{ fontSize: 18, fontWeight: 800, color: barColor }}>{Math.round(pct)}%</span>
              </div>
            </div>
          )
        })}
        {!budgets.length && (
          <div style={{ textAlign: 'center', padding: 48, color: D.textMuted, background: D.bg, border: `1px solid ${D.border}`, borderRadius: 10, fontSize: 13 }}>
            No tienes presupuestos configurados. ¡Agrega uno!
          </div>
        )}
      </div>
    </div>
  )
}