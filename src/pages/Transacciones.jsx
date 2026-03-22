import { useState } from "react"
import { useFinanzas } from "../context/FinanzasContext"
import { useOutletContext } from "react-router-dom"
import { Plus, Trash2, TrendingUp, TrendingDown } from "lucide-react"

const fmt = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)
const CATS_GASTO = ['Comida', 'Transporte', 'Vivienda', 'Salud', 'Entretenimiento', 'Ropa', 'Educación', 'Otros']
const CATS_ING = ['Salario', 'Freelance', 'Inversiones', 'Regalo', 'Otros']
const EMPTY = { tipo: 'gasto', monto: '', categoria: 'Comida', descripcion: '', fecha: new Date().toISOString().split('T')[0] }

export default function Transacciones() {
  const { transactions, addTransaction, deleteTransaction } = useFinanzas()
  const { D } = useOutletContext()
  const [form, setForm] = useState(false)
  const [data, setData] = useState(EMPTY)
  const [filtro, setFiltro] = useState('todos')
  const [search, setSearch] = useState('')

  const set = (k, v) => setData(p => ({ ...p, [k]: v }))
  const handleTipo = (tipo) => { set('tipo', tipo); set('categoria', tipo === 'gasto' ? 'Comida' : 'Salario') }
  const submit = () => {
    if (!data.monto || !data.descripcion.trim()) return
    addTransaction({ ...data, monto: Number(data.monto) })
    setData(EMPTY); setForm(false)
  }

  const visible = transactions
    .filter(t => filtro === 'todos' || t.tipo === filtro)
    .filter(t => t.descripcion.toLowerCase().includes(search.toLowerCase()) || t.categoria.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))

  const inp = { width: '100%', padding: '8px 11px', border: `1px solid ${D.border}`, borderRadius: 7, fontSize: 13, color: D.text, background: D.bg, outline: 'none', boxSizing: 'border-box' }
  const cats = data.tipo === 'gasto' ? CATS_GASTO : CATS_ING

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: D.text, margin: '0 0 3px', letterSpacing: '-0.4px' }}>Transacciones</h1>
          <p style={{ fontSize: 12, color: D.textMuted, margin: 0 }}>{transactions.length} registros en total</p>
        </div>
        <button onClick={() => setForm(!form)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: D.accent, border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
          <Plus size={14} /> Nueva transacción
        </button>
      </div>

      {/* Formulario */}
      {form && (
        <div style={{ background: D.bg, border: `1px solid ${D.border}`, borderRadius: 10, padding: 20, marginBottom: 18 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: D.text, margin: '0 0 14px' }}>Nueva transacción</p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            {['gasto', 'ingreso'].map(t => (
              <button key={t} onClick={() => handleTipo(t)} style={{ flex: 1, padding: 9, borderRadius: 8, border: `1.5px solid ${data.tipo === t ? (t === 'ingreso' ? '#059669' : '#dc2626') : D.border}`, background: data.tipo === t ? (t === 'ingreso' ? 'rgba(5,150,105,0.1)' : 'rgba(220,38,38,0.1)') : D.surface, color: data.tipo === t ? (t === 'ingreso' ? '#059669' : '#dc2626') : D.textMuted, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                {t === 'ingreso' ? <><TrendingUp size={14} /> Ingreso</> : <><TrendingDown size={14} /> Gasto</>}
              </button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[['Monto (COP)', 'monto', 'number', '0'], ['Fecha', 'fecha', 'date', '']].map(([l, k, type, ph]) => (
              <div key={k}>
                <label style={{ fontSize: 11, fontWeight: 600, color: D.textMuted, display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l}</label>
                <input type={type} placeholder={ph} value={data[k]} onChange={e => set(k, e.target.value)} style={inp} />
              </div>
            ))}
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: D.textMuted, display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Categoría</label>
              <select value={data.categoria} onChange={e => set('categoria', e.target.value)} style={inp}>
                {cats.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: D.textMuted, display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Descripción</label>
              <input placeholder="Ej: Mercado semanal" value={data.descripcion} onChange={e => set('descripcion', e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} style={inp} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <button onClick={submit} style={{ padding: '8px 18px', background: D.accent, border: 'none', borderRadius: 7, color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Guardar</button>
            <button onClick={() => { setForm(false); setData(EMPTY) }} style={{ padding: '8px 12px', background: D.surface, border: `1px solid ${D.border}`, borderRadius: 7, color: D.textMuted, fontSize: 13, cursor: 'pointer' }}>Cancelar</button>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'center' }}>
        <div style={{ display: 'flex', background: D.bg, border: `1px solid ${D.border}`, borderRadius: 8, padding: 3 }}>
          {[['todos', 'Todos'], ['ingreso', 'Ingresos'], ['gasto', 'Gastos']].map(([k, l]) => (
            <button key={k} onClick={() => setFiltro(k)} style={{ padding: '5px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500, background: filtro === k ? D.accent : 'transparent', color: filtro === k ? '#fff' : D.textMuted, transition: 'all 0.15s' }}>{l}</button>
          ))}
        </div>
        <input placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inp, maxWidth: 220, padding: '6px 11px' }} />
        <span style={{ fontSize: 12, color: D.textLight, marginLeft: 'auto' }}>{visible.length} resultados</span>
      </div>

      {/* Lista */}
      <div style={{ background: D.bg, border: `1px solid ${D.border}`, borderRadius: 10, overflow: 'hidden' }}>
        {visible.map(t => (
          <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', borderBottom: `1px solid ${D.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: t.tipo === 'ingreso' ? 'rgba(5,150,105,0.12)' : 'rgba(220,38,38,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {t.tipo === 'ingreso' ? <TrendingUp size={14} color="#059669" /> : <TrendingDown size={14} color="#dc2626" />}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: D.text }}>{t.descripcion}</div>
                <div style={{ fontSize: 11, color: D.textLight, marginTop: 2 }}>{t.categoria} · {t.fecha}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: t.tipo === 'ingreso' ? '#059669' : '#dc2626' }}>
                {t.tipo === 'ingreso' ? '+' : '-'}{fmt(t.monto)}
              </span>
              <button onClick={() => deleteTransaction(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: D.textLight, display: 'flex', padding: 3, borderRadius: 4 }}
                onMouseEnter={e => e.currentTarget.style.color = '#dc2626'} onMouseLeave={e => e.currentTarget.style.color = D.textLight}>
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
        {!visible.length && <div style={{ textAlign: 'center', padding: 36, color: D.textMuted, fontSize: 13 }}>Sin transacciones</div>}
      </div>
    </div>
  )
}