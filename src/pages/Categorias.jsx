import { useFinanzas } from "../context/FinanzasContext"
import { useOutletContext } from "react-router-dom"
import { Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend)

const fmt = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)
const COLORS = ['#5b5fcf', '#059669', '#d97706', '#dc2626', '#0ea5e9', '#8b5cf6', '#f59e0b', '#6b7280']

export default function Categorias() {
  const { txMes, gastos, ingresos } = useFinanzas()
  const { D } = useOutletContext()

  const agrupar = (lista, total) => {
    const map = lista.reduce((acc, t) => { acc[t.categoria] = (acc[t.categoria] || 0) + t.monto; return acc }, {})
    return Object.entries(map).map(([nombre, monto]) => ({ nombre, monto, pct: total > 0 ? Math.round((monto / total) * 100) : 0 })).sort((a, b) => b.monto - a.monto)
  }

  const catGastos = agrupar(txMes.filter(t => t.tipo === 'gasto'), gastos)
  const catIngresos = agrupar(txMes.filter(t => t.tipo === 'ingreso'), ingresos)

  const makePie = (cats) => ({
    labels: cats.map(c => c.nombre),
    datasets: [{ data: cats.map(c => c.monto), backgroundColor: COLORS, borderWidth: 0, hoverOffset: 8 }]
  })

  const pieOpts = { responsive: true, plugins: { legend: { position: 'bottom', labels: { color: D.textMuted, font: { size: 11 }, padding: 14 } } } }

  const Section = ({ titulo, cats, total, color, pieData }) => (
    <div style={{ background: D.bg, border: `1px solid ${D.border}`, borderRadius: 10, padding: 20, marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18, alignItems: 'center' }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: D.text, margin: 0 }}>{titulo}</h2>
        <span style={{ fontSize: 15, fontWeight: 700, color }}>{fmt(total)}</span>
      </div>

      {cats.length === 0
        ? <p style={{ textAlign: 'center', color: D.textMuted, fontSize: 13, padding: '20px 0' }}>Sin datos este período</p>
        : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 20, alignItems: 'start' }}>
            <div>
              {cats.map(({ nombre, monto, pct }, i) => (
                <div key={nombre} style={{ marginBottom: 13 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 9, height: 9, borderRadius: '50%', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                      <span style={{ fontSize: 13, fontWeight: 500, color: D.text }}>{nombre}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: D.textLight, minWidth: 28, textAlign: 'right' }}>{pct}%</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: D.text, minWidth: 100, textAlign: 'right' }}>{fmt(monto)}</span>
                    </div>
                  </div>
                  <div style={{ height: 6, background: D.surface, borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: COLORS[i % COLORS.length], borderRadius: 3, transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ maxWidth: 220 }}>
              <Pie data={pieData} options={pieOpts} />
            </div>
          </div>
        )
      }
    </div>
  )

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: D.text, margin: '0 0 3px', letterSpacing: '-0.4px' }}>Categorías</h1>
        <p style={{ fontSize: 12, color: D.textMuted, margin: 0 }}>Distribución detallada del período seleccionado</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginBottom: 20 }}>
        {[['Categorías de gasto', catGastos.length, '#dc2626'], ['Categorías de ingreso', catIngresos.length, '#059669']].map(([l, v, c]) => (
          <div key={l} style={{ background: D.bg, border: `1px solid ${D.border}`, borderRadius: 10, padding: '14px 18px' }}>
            <p style={{ fontSize: 11, color: D.textMuted, margin: '0 0 4px' }}>{l}</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: c, margin: 0 }}>{v}</p>
          </div>
        ))}
      </div>

      <Section titulo="Gastos por categoría" cats={catGastos} total={gastos} color="#dc2626" pieData={makePie(catGastos)} />
      <Section titulo="Ingresos por categoría" cats={catIngresos} total={ingresos} color="#059669" pieData={makePie(catIngresos)} />
    </div>
  )
}