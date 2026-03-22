import { useState } from "react"
import { Wallet, Eye, EyeOff } from "lucide-react"

const USERS = [{ email: 'juan@finanzapp.co', password: '1234', nombre: 'Juan Díaz' }]

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('juan@finanzapp.co')
  const [pass, setPass] = useState('1234')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = () => {
    setError('')
    const user = USERS.find(u => u.email === email && u.password === pass)
    if (!user) { setError('Email o contraseña incorrectos'); return }
    setLoading(true)
    setTimeout(onLogin, 600)
  }

  const inp = {
    width: '100%', padding: '10px 12px', borderRadius: 8, fontSize: 13,
    outline: 'none', boxSizing: 'border-box', background: '#0d0d10',
    border: '1px solid rgba(255,255,255,0.08)', color: '#e8e8f0',
    transition: 'border 0.2s'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0d', display: 'flex', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      {/* Panel izquierdo */}
      <div style={{ flex: 1, background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(91,95,207,0.08)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(91,95,207,0.05)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#5b5fcf', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Wallet size={18} color="#fff" /></div>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>FinanzApp</span>
        </div>
        <h1 style={{ fontSize: 40, fontWeight: 800, color: '#fff', margin: '0 0 16px', letterSpacing: '-1px', lineHeight: 1.1 }}>
          Controla tus<br />finanzas con<br /><span style={{ color: '#818cf8' }}>inteligencia</span>
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', margin: '0 0 40px', lineHeight: 1.7, maxWidth: 340 }}>
          Dashboard completo, gráficas en tiempo real, presupuestos con alertas y metas de ahorro.
        </p>
        {[['📊', 'Gráficas y análisis'], ['🎯', 'Metas de ahorro'], ['🔔', 'Alertas inteligentes']].map(([e, t]) => (
          <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 16 }}>{e}</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{t}</span>
          </div>
        ))}
      </div>

      {/* Panel derecho */}
      <div style={{ width: 420, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 40px', background: '#0a0a0d' }}>
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#e8e8f0', margin: '0 0 6px', letterSpacing: '-0.5px' }}>Bienvenido de vuelta</h2>
          <p style={{ fontSize: 13, color: '#555570', margin: 0 }}>Inicia sesión para continuar</p>
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: '#7878a0', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inp} onFocus={e => e.target.style.border = '1px solid #5b5fcf'} onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.08)'} />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: '#7878a0', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Contraseña</label>
          <div style={{ position: 'relative' }}>
            <input type={showPass ? 'text' : 'password'} value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} style={{ ...inp, paddingRight: 40 }} onFocus={e => e.target.style.border = '1px solid #5b5fcf'} onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.08)'} />
            <button onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#555570', display: 'flex' }}>
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {error && <div style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 7, padding: '9px 12px', fontSize: 12, color: '#f87171', marginBottom: 16 }}>{error}</div>}

        <button onClick={submit} style={{ width: '100%', padding: 11, background: loading ? '#4f53b8' : '#5b5fcf', border: 'none', borderRadius: 8, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}>
          {loading ? 'Entrando...' : 'Iniciar sesión'}
        </button>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#333350', marginTop: 24 }}>
          Demo: <span style={{ color: '#5b5fcf' }}>juan@finanzapp.co</span> / <span style={{ color: '#5b5fcf' }}>1234</span>
        </p>
      </div>
    </div>
  )
}