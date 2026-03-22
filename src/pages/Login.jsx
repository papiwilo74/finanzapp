import { useState } from "react"
import { supabase } from "../supabase"
import { Wallet, Eye, EyeOff } from "lucide-react"

export default function Login() {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [modo, setModo] = useState('login')
  const [mensaje, setMensaje] = useState('')

  const submit = async () => {
    setError(''); setMensaje(''); setLoading(true)
    if (modo === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password: pass })
      if (error) setError('Email o contraseña incorrectos')
    } else {
      const { error } = await supabase.auth.signUp({ email, password: pass })
      if (error) setError(error.message)
      else setMensaje('¡Cuenta creada! Revisa tu email para confirmar.')
    }
    setLoading(false)
  }

  const inp = {
    width: '100%', padding: '10px 12px', borderRadius: 8, fontSize: 13,
    outline: 'none', boxSizing: 'border-box', background: '#0d0d10',
    border: '1px solid rgba(255,255,255,0.08)', color: '#e8e8f0',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0d', display: 'flex', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ flex: 1, background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#5b5fcf', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wallet size={18} color="#fff" />
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>FinanzApp</span>
        </div>
        <h1 style={{ fontSize: 40, fontWeight: 800, color: '#fff', margin: '0 0 16px', letterSpacing: '-1px', lineHeight: 1.1 }}>
          Controla tus<br />finanzas con<br /><span style={{ color: '#818cf8' }}>inteligencia</span>
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', margin: '0 0 40px', lineHeight: 1.7, maxWidth: 340 }}>
          Dashboard completo, gráficas en tiempo real, presupuestos con alertas y metas de ahorro. Tus datos guardados en la nube.
        </p>
        {[['📊', 'Gráficas y análisis'], ['🎯', 'Metas de ahorro'], ['☁️', 'Datos en la nube'], ['🔔', 'Alertas inteligentes']].map(([e, t]) => (
          <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 16 }}>{e}</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{t}</span>
          </div>
        ))}
      </div>

      <div style={{ width: 420, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 40px', background: '#0a0a0d' }}>
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#e8e8f0', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
            {modo === 'login' ? 'Bienvenido de vuelta' : 'Crear cuenta'}
          </h2>
          <p style={{ fontSize: 13, color: '#555570', margin: 0 }}>
            {modo === 'login' ? 'Inicia sesión para continuar' : 'Regístrate gratis'}
          </p>
        </div>

        <div style={{ display: 'flex', background: '#111116', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: 3, marginBottom: 20 }}>
          {[['login', 'Iniciar sesión'], ['register', 'Registrarse']].map(([m, l]) => (
            <button key={m} onClick={() => { setModo(m); setError(''); setMensaje('') }} style={{ flex: 1, padding: '7px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500, background: modo === m ? '#5b5fcf' : 'transparent', color: modo === m ? '#fff' : '#555570', transition: 'all 0.15s' }}>{l}</button>
          ))}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: '#7878a0', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Email</label>
          <input type="email" placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)} style={inp} />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: '#7878a0', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Contraseña</label>
          <div style={{ position: 'relative' }}>
            <input type={showPass ? 'text' : 'password'} placeholder="mínimo 6 caracteres" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} style={{ ...inp, paddingRight: 40 }} />
            <button onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#555570', display: 'flex' }}>
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {error && <div style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 7, padding: '9px 12px', fontSize: 12, color: '#f87171', marginBottom: 16 }}>{error}</div>}
        {mensaje && <div style={{ background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.2)', borderRadius: 7, padding: '9px 12px', fontSize: 12, color: '#34d399', marginBottom: 16 }}>{mensaje}</div>}

        <button onClick={submit} disabled={loading} style={{ width: '100%', padding: 11, background: loading ? '#4f53b8' : '#5b5fcf', border: 'none', borderRadius: 8, color: '#fff', fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Cargando...' : modo === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
        </button>
      </div>
    </div>
  )
}