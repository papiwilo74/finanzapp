import { Outlet, Link, useLocation } from "react-router-dom"
import { useState } from "react"
import { useFinanzas } from "../context/FinanzasContext"
import { LayoutDashboard, ArrowLeftRight, PieChart, Target, Wallet, LogOut, Moon, Sun, Bell, X, ChevronDown } from "lucide-react"
import { Sparkles } from "lucide-react"

export default function MainLayout({ onLogout }) {
  const location = useLocation()
  const { darkMode, setDarkMode, notifications, mesSeleccionado, setMesSeleccionado, mesesDisponibles, user } = useFinanzas()
  const [showNotif, setShowNotif] = useState(false)

  const D = darkMode ? {
    bg: '#0f0f12', surface: '#1a1a22', border: '#2a2a38', text: '#e8e8f0',
    textMuted: '#888898', textLight: '#555568', hover: '#22222e', accent: '#818cf8',
    accentBg: '#1e1e3f', pageBg: '#0a0a0e'
  } : {
    bg: '#ffffff', surface: '#f5f5f8', border: '#e5e7eb', text: '#111827',
    textMuted: '#6b7280', textLight: '#9ca3af', hover: '#f9fafb', accent: '#5b5fcf',
    accentBg: '#eef0ff', pageBg: '#f5f5f8'
  }

  const navItems = [
    { path: '/', Icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/transacciones', Icon: ArrowLeftRight, label: 'Transacciones' },
    { path: '/categorias', Icon: PieChart, label: 'Categorías' },
    { path: '/presupuestos', Icon: Wallet, label: 'Presupuestos' },
    { path: '/metas', Icon: Target, label: 'Metas' },
    { path: '/asistente', Icon: Sparkles, label: 'Asistente IA' },
  ]
  const isActive = (p) => p === '/' ? location.pathname === '/' : location.pathname.startsWith(p)

  const mesesLabels = { '2026-03': 'Marzo 2026', '2026-02': 'Febrero 2026', '2026-01': 'Enero 2026' }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: D.pageBg, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', transition: 'background 0.3s' }}>

      <aside style={{ width: 220, background: D.bg, borderRight: `1px solid ${D.border}`, padding: '16px 10px', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 20, transition: 'all 0.3s' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '2px 8px', marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${D.border}` }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: D.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Wallet size={14} color="#fff" /></div>
          <span style={{ fontWeight: 700, fontSize: 14, color: D.text, letterSpacing: '-0.3px' }}>FinanzApp</span>
        </div>

        <div style={{ padding: '0 6px', marginBottom: 16 }}>
          <label style={{ fontSize: 9, fontWeight: 700, color: D.textLight, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 5 }}>Período</label>
          <div style={{ position: 'relative' }}>
            <select value={mesSeleccionado} onChange={e => setMesSeleccionado(e.target.value)} style={{ width: '100%', padding: '6px 28px 6px 9px', background: D.surface, border: `1px solid ${D.border}`, borderRadius: 7, fontSize: 12, color: D.text, cursor: 'pointer', appearance: 'none', outline: 'none' }}>
              {mesesDisponibles.map(m => <option key={m} value={m}>{mesesLabels[m] || m}</option>)}
            </select>
            <ChevronDown size={12} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: D.textLight, pointerEvents: 'none' }} />
          </div>
        </div>

        <nav style={{ flex: 1 }}>
          {navItems.map(({ path, Icon, label }) => {
            const active = isActive(path)
            return (
              <Link key={path} to={path} style={{
                display: 'flex', alignItems: 'center', gap: 9, padding: '8px 10px',
                borderRadius: 8, textDecoration: 'none', marginBottom: 2,
                fontSize: 13, fontWeight: active ? 600 : 400,
                color: active ? D.accent : D.textMuted,
                background: active ? D.accentBg : 'transparent',
                transition: 'all 0.15s'
              }}>
                <Icon size={15} />{label}
              </Link>
            )
          })}
        </nav>

        <div style={{ borderTop: `1px solid ${D.border}`, paddingTop: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', marginBottom: 6 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: D.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: D.accent, flexShrink: 0 }}>
              {user?.email?.[0]?.toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: D.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.email?.split('@')[0]}
              </div>
              <div style={{ fontSize: 9, color: D.textLight }}>
                {user?.email}
              </div>
            </div>
          </div>
          <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', background: 'none', border: 'none', color: D.textMuted, fontSize: 12, cursor: 'pointer', width: '100%', borderRadius: 8, transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.08)'; e.currentTarget.style.color = '#dc2626' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = D.textMuted }}>
            <LogOut size={13} /> Cerrar sesión
          </button>
        </div>
      </aside>

      <div style={{ flex: 1, marginLeft: 220, display: 'flex', flexDirection: 'column' }}>
        <header style={{ background: D.bg, borderBottom: `1px solid ${D.border}`, padding: '10px 28px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8, position: 'sticky', top: 0, zIndex: 10, transition: 'all 0.3s' }}>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowNotif(!showNotif)} style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${D.border}`, background: D.surface, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: D.textMuted, position: 'relative' }}>
              <Bell size={15} />
              {notifications.length > 0 && <span style={{ position: 'absolute', top: 6, right: 6, width: 7, height: 7, borderRadius: '50%', background: '#dc2626' }} />}
            </button>
            {showNotif && (
              <div style={{ position: 'absolute', right: 0, top: 42, width: 300, background: D.bg, border: `1px solid ${D.border}`, borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 100, overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderBottom: `1px solid ${D.border}` }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: D.text }}>Alertas ({notifications.length})</span>
                  <button onClick={() => setShowNotif(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: D.textLight, display: 'flex' }}><X size={13} /></button>
                </div>
                {notifications.length === 0
                  ? <p style={{ textAlign: 'center', fontSize: 12, color: D.textMuted, padding: '20px 0' }}>Sin alertas activas ✓</p>
                  : notifications.map(n => (
                    <div key={n.id} style={{ padding: '10px 14px', borderBottom: `1px solid ${D.border}`, background: n.tipo === 'danger' ? 'rgba(220,38,38,0.05)' : 'rgba(217,119,6,0.05)' }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: n.tipo === 'danger' ? '#dc2626' : '#d97706', display: 'inline-block', marginRight: 8 }} />
                      <span style={{ fontSize: 12, color: D.text }}>{n.msg}</span>
                    </div>
                  ))
                }
              </div>
            )}
          </div>
          <button onClick={() => setDarkMode(!darkMode)} style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${D.border}`, background: D.surface, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: D.textMuted }}>
            {darkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </header>

        <main style={{ flex: 1, padding: '28px 36px' }}>
          <Outlet context={{ D }} />
        </main>
      </div>
    </div>
  )
}