import { useFinanzas } from "../context/FinanzasContext"
import { useOutletContext } from "react-router-dom"
import { TrendingUp, TrendingDown, Wallet, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { Doughnut, Bar } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

const fmt = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)

const COLORS = ['#5b5fcf', '#059669', '#d97706', '#dc2626', '#0ea5e9', '#8b5cf6', '#f59e0b']

export default function Dashboard() {
  const { txMes, ingresos, gastos, balance, transactions, mesSeleccionado } = useFinanzas()
  const { D } = useOutletContext()

  const recientes = [...txMes].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 5)

  // Datos para gráfica donut - gastos por categoría
  const gastosMap = txMes.filter(t => t.tipo === 'gasto').reduce((acc, t) => {
    acc[t.categoria] = (acc[t.categoria] || 0) + t.monto; return acc
  }, {})
  const donutData = {
    labels: Object.keys(gastosMap),
    datasets: [{ data: Object.values(gastosMap), backgroundColor: COLORS, borderWidth: 0, hoverOffset: 6 }]
  }

  // Datos para gráfica de barras - comparar ingresos vs gastos últimos meses
  const meses = [...new Set(transactions.map(t => t.fecha.slice(0, 7)))].sort()
  const barLabels = { '2026-01': 'Ene', '2026-02': 'Feb', '2026-03': 'Mar' }
  const barData = {
    labels: meses.map(m => barLabels[m] || m),
    datasets: [
      { label: 'Ingresos', data: meses.map(m => transactions.filter(t => t.tipo === 'ingreso' && t.fecha.startsWith(m)).reduce((s, t) => s + t.monto, 0)), backgroundColor: '#059669', borderRadius: 5 },
      { label: 'Gastos', data: meses.map(m => transactions.filter(t => t.tipo === 'gasto' && t.fecha.startsWith(m)).reduce((s, t) => s + t.monto, 0)), backgroundColor: '#dc2626', borderRadius: 5 },
    ]
  }

  const chartOpts = { responsive: true, plugins: { legend: { labels: { color: D.textMuted, font: { size: 11 } } } } }

  const cards = [
    { label: 'Balance del mes', value: fmt(balance), color: balance >= 0 ? '#059669' : '#dc2626', bg: balance >= 0 ? 'rgba(5,150,105,0.1)' : 'rgba(220,38,38,0.1)', Icon: Wallet },
    { label: 'Ingresos', value: fmt(ingresos), color: '#059669', bg: 'rgba(5,150,105,0.1)', Icon: TrendingUp },
    { label: 'Gastos', value: fmt(gastos), color: '#dc2626', bg: 'rgba(220,38,38,0.1)', Icon: TrendingDown },
  ]

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: D.text, margin: '0 0 3px', letterSpacing: '-0.4px' }}>Dashboard</h1>
        <p style={{ fontSize: 12, color: D.textMuted, margin: 0 }}>Resumen de tus finanzas · {mesSeleccionado}</p>
      </div>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 22 }}>
        {cards.map(({ label, value, color, bg, Icon }) => (
          <div key={label} style={{ background: D.bg, border: `1px solid ${D.border}`, borderRadius: 10, padding: '16px 18px', transition: 'all 0.3s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: D.textMuted, fontWeight: 500 }}>{label}</span>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={14} color={color} /></div>
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Gráficas */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 14, marginBottom: 22 }}>

        {/* Donut */}
        <div style={{ background: D.bg, border: `1px solid ${D.border}`, borderRadius: 10, padding: 20 }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: D.text, margin: '0 0 16px' }}>Gastos por categoría</h2>
          {Object.keys(gastosMap).length > 0
            ? <Doughnut data={donutData} options={{ ...chartOpts, cutout: '65%' }} />
            : <p style={{ textAlign: 'center', color: D.textMuted, fontSize: 12, padding: '30px 0' }}>Sin gastos este mes</p>
          }
        </div>

        {/* Barras */}
        <div style={{ background: D.bg, border: `1px solid ${D.border}`, borderRadius: 10, padding: 20 }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: D.text, margin: '0 0 16px' }}>Ingresos vs Gastos</h2>
          <Bar data={barData} options={{ ...chartOpts, scales: { x: { ticks: { color: D.textMuted }, grid: { color: D.border } }, y: { ticks: { color: D.textMuted, callback: v => '$' + (v / 1000000).toFixed(1) + 'M' }, grid: { color: D.border } } } }} />
        </div>
      </div>

      {/* Últimas transacciones */}
      <div style={{ background: D.bg, border: `1px solid ${D.border}`, borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 18px', borderBottom: `1px solid ${D.border}` }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: D.text, margin: 0 }}>Últimas transacciones</h2>
          <Link to="/transacciones" style={{ fontSize: 12, color: D.accent, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>Ver todas <ArrowRight size={12} /></Link>
        </div>
        {recientes.map(t => (
          <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 18px', borderBottom: `1px solid ${D.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: t.tipo === 'ingreso' ? 'rgba(5,150,105,0.12)' : 'rgba(220,38,38,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {t.tipo === 'ingreso' ? <TrendingUp size={13} color="#059669" /> : <TrendingDown size={13} color="#dc2626" />}
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 500, color: D.text }}>{t.descripcion}</div>
                <div style={{ fontSize: 10, color: D.textLight, marginTop: 1 }}>{t.categoria} · {t.fecha}</div>
              </div>
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: t.tipo === 'ingreso' ? '#059669' : '#dc2626' }}>
              {t.tipo === 'ingreso' ? '+' : '-'}{fmt(t.monto)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}