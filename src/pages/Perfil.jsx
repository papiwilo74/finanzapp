import { useState, useRef } from "react"
import { useOutletContext } from "react-router-dom"
import { useFinanzas } from "../context/FinanzasContext"
import { supabase } from "../supabase"
import { User, Lock, Camera, Trash2, TrendingUp, TrendingDown, Target, Wallet, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react"

const fmt = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)

export default function Perfil() {
  const { D } = useOutletContext()
  const { user, transactions, ingresos, gastos, balance, goals } = useFinanzas()

  const [nombre, setNombre] = useState(user?.user_metadata?.nombre || user?.email?.split('@')[0] || '')
  const [editNombre, setEditNombre] = useState(false)
  const [loadingNombre, setLoadingNombre] = useState(false)

  const [passActual, setPassActual] = useState('')
  const [passNueva, setPassNueva] = useState('')
  const [passConfirm, setPassConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loadingPass, setLoadingPass] = useState(false)

  const [avatar, setAvatar] = useState(user?.user_metadata?.avatar || null)
  const [loadingAvatar, setLoadingAvatar] = useState(false)
  const fileRef = useRef()

  const [msg, setMsg] = useState({ text: '', type: '' })
  const [showDelete, setShowDelete] = useState(false)
  const [deleteEmail, setDeleteEmail] = useState('')

  const showMsg = (text, type = 'success') => {
    setMsg({ text, type })
    setTimeout(() => setMsg({ text: '', type: '' }), 3000)
  }

  // Guardar nombre
  const guardarNombre = async () => {
    if (!nombre.trim()) return
    setLoadingNombre(true)
    const { error } = await supabase.auth.updateUser({ data: { nombre } })
    if (error) showMsg('Error al guardar nombre', 'error')
    else { showMsg('Nombre actualizado ✓'); setEditNombre(false) }
    setLoadingNombre(false)
  }

  // Cambiar contraseña
  const cambiarPass = async () => {
    if (passNueva !== passConfirm) { showMsg('Las contraseñas no coinciden', 'error'); return }
    if (passNueva.length < 6) { showMsg('Mínimo 6 caracteres', 'error'); return }
    setLoadingPass(true)
    const { error } = await supabase.auth.updateUser({ password: passNueva })
    if (error) showMsg('Error al cambiar contraseña', 'error')
    else { showMsg('Contraseña actualizada ✓'); setPassActual(''); setPassNueva(''); setPassConfirm('') }
    setLoadingPass(false)
  }

  // Subir foto
  const handleAvatar = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setLoadingAvatar(true)
    const reader = new FileReader()
    reader.onload = async (ev) => {
      const base64 = ev.target.result
      const { error } = await supabase.auth.updateUser({ data: { avatar: base64 } })
      if (!error) { setAvatar(base64); showMsg('Foto actualizada ✓') }
      else showMsg('Error al subir foto', 'error')
      setLoadingAvatar(false)
    }
    reader.readAsDataURL(file)
  }

  // Eliminar cuenta
  const eliminarCuenta = async () => {
    if (deleteEmail !== user?.email) { showMsg('El email no coincide', 'error'); return }
    const { error } = await supabase.auth.admin?.deleteUser?.(user.id)
    if (error) {
      await supabase.auth.signOut()
      showMsg('Sesión cerrada. Contacta soporte para eliminar la cuenta.', 'error')
    }
  }

  // Estadísticas
  const metasCompletadas = goals.filter(g => g.actual >= g.objetivo).length
  const totalTx = transactions.length
  const mayorGasto = transactions.filter(t => t.tipo === 'gasto').reduce((max, t) => t.monto > max.monto ? t : max, { monto: 0, descripcion: 'N/A', categoria: 'N/A' })

  const inp = { width: '100%', padding: '9px 12px', border: `1px solid ${D.border}`, borderRadius: 8, fontSize: 13, color: D.text, background: D.bg, outline: 'none', boxSizing: 'border-box' }
  const card = { background: D.bg, border: `1px solid ${D.border}`, borderRadius: 12, padding: 22, marginBottom: 16 }
  const label = { fontSize: 11, fontWeight: 600, color: D.textMuted, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }

  return (
    <div style={{ maxWidth: 620 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: D.text, margin: '0 0 3px', letterSpacing: '-0.4px' }}>Mi Perfil</h1>
        <p style={{ fontSize: 12, color: D.textMuted, margin: 0 }}>Administra tu cuenta y preferencias</p>
      </div>

      {/* Mensaje */}
      {msg.text && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 8, marginBottom: 16, background: msg.type === 'error' ? 'rgba(220,38,38,0.1)' : 'rgba(5,150,105,0.1)', border: `1px solid ${msg.type === 'error' ? 'rgba(220,38,38,0.2)' : 'rgba(5,150,105,0.2)'}` }}>
          {msg.type === 'error' ? <AlertCircle size={14} color="#dc2626" /> : <CheckCircle size={14} color="#059669" />}
          <span style={{ fontSize: 13, color: msg.type === 'error' ? '#dc2626' : '#059669' }}>{msg.text}</span>
        </div>
      )}

      {/* Avatar y nombre */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 18 }}>
          <User size={15} color={D.accent} />
          <span style={{ fontSize: 13, fontWeight: 600, color: D.text }}>Información personal</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          {/* Avatar */}
          <div style={{ position: 'relative' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: D.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: `2px solid ${D.accent}33` }}>
              {avatar
                ? <img src={avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: 26, fontWeight: 700, color: D.accent }}>{user?.email?.[0]?.toUpperCase()}</span>
              }
            </div>
            <button onClick={() => fileRef.current.click()} style={{ position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderRadius: '50%', background: D.accent, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Camera size={11} color="#fff" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatar} style={{ display: 'none' }} />
          </div>

          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: D.text }}>{nombre || user?.email?.split('@')[0]}</div>
            <div style={{ fontSize: 12, color: D.textMuted, marginTop: 2 }}>{user?.email}</div>
            {loadingAvatar && <div style={{ fontSize: 11, color: D.accent, marginTop: 4 }}>Subiendo foto...</div>}
          </div>
        </div>

        {/* Nombre */}
        <div>
          <label style={label}>Nombre de usuario</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={nombre} onChange={e => setNombre(e.target.value)} disabled={!editNombre} style={{ ...inp, flex: 1, opacity: editNombre ? 1 : 0.7 }} onKeyDown={e => e.key === 'Enter' && guardarNombre()} />
            {editNombre
              ? <><button onClick={guardarNombre} disabled={loadingNombre} style={{ padding: '9px 16px', background: D.accent, border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>{loadingNombre ? '...' : 'Guardar'}</button>
                <button onClick={() => setEditNombre(false)} style={{ padding: '9px 12px', background: D.surface, border: `1px solid ${D.border}`, borderRadius: 8, color: D.textMuted, fontSize: 13, cursor: 'pointer' }}>Cancelar</button></>
              : <button onClick={() => setEditNombre(true)} style={{ padding: '9px 14px', background: D.surface, border: `1px solid ${D.border}`, borderRadius: 8, color: D.textMuted, fontSize: 13, cursor: 'pointer' }}>Editar</button>
            }
          </div>
        </div>
      </div>

      {/* Contraseña */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 18 }}>
          <Lock size={15} color={D.accent} />
          <span style={{ fontSize: 13, fontWeight: 600, color: D.text }}>Cambiar contraseña</span>
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          {[['Nueva contraseña', passNueva, setPassNueva], ['Confirmar contraseña', passConfirm, setPassConfirm]].map(([l, v, s]) => (
            <div key={l}>
              <label style={label}>{l}</label>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} value={v} onChange={e => s(e.target.value)} placeholder="mínimo 6 caracteres" style={{ ...inp, paddingRight: 36 }} />
                <button onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: D.textLight, display: 'flex' }}>
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          ))}
          <button onClick={cambiarPass} disabled={loadingPass || !passNueva || !passConfirm} style={{ padding: '9px 18px', background: D.accent, border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', opacity: (!passNueva || !passConfirm) ? 0.5 : 1, width: 'fit-content' }}>
            {loadingPass ? 'Cambiando...' : 'Cambiar contraseña'}
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 18 }}>
          <TrendingUp size={15} color={D.accent} />
          <span style={{ fontSize: 13, fontWeight: 600, color: D.text }}>Mis estadísticas</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { Icon: TrendingUp, label: 'Total ingresos', value: fmt(ingresos), color: '#059669', bg: 'rgba(5,150,105,0.1)' },
            { Icon: TrendingDown, label: 'Total gastos', value: fmt(gastos), color: '#dc2626', bg: 'rgba(220,38,38,0.1)' },
            { Icon: Wallet, label: 'Balance actual', value: fmt(balance), color: balance >= 0 ? '#059669' : '#dc2626', bg: balance >= 0 ? 'rgba(5,150,105,0.1)' : 'rgba(220,38,38,0.1)' },
            { Icon: Target, label: 'Metas cumplidas', value: `${metasCompletadas} de ${goals.length}`, color: D.accent, bg: D.accentBg },
          ].map(({ Icon, label, value, color, bg }) => (
            <div key={label} style={{ background: bg, borderRadius: 10, padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <Icon size={13} color={color} />
                <span style={{ fontSize: 11, color, fontWeight: 500 }}>{label}</span>
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color }}>{value}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, padding: '12px 14px', background: D.surface, borderRadius: 8, border: `1px solid ${D.border}` }}>
          <div style={{ fontSize: 11, color: D.textMuted, marginBottom: 4 }}>Total de transacciones registradas</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: D.text }}>{totalTx} transacciones</div>
        </div>
        {mayorGasto.monto > 0 && (
          <div style={{ marginTop: 8, padding: '12px 14px', background: D.surface, borderRadius: 8, border: `1px solid ${D.border}` }}>
            <div style={{ fontSize: 11, color: D.textMuted, marginBottom: 4 }}>Mayor gasto registrado</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#dc2626' }}>{fmt(mayorGasto.monto)}</div>
            <div style={{ fontSize: 11, color: D.textLight, marginTop: 2 }}>{mayorGasto.descripcion} · {mayorGasto.categoria}</div>
          </div>
        )}
      </div>

      {/* Eliminar cuenta */}
      <div style={{ ...card, border: `1px solid rgba(220,38,38,0.3)` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <Trash2 size={15} color="#dc2626" />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#dc2626' }}>Zona de peligro</span>
        </div>
        {!showDelete
          ? <button onClick={() => setShowDelete(true)} style={{ padding: '8px 16px', background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: 8, color: '#dc2626', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
              Eliminar mi cuenta
            </button>
          : (
            <div>
              <p style={{ fontSize: 13, color: D.textMuted, margin: '0 0 12px' }}>Escribe tu email para confirmar: <strong style={{ color: D.text }}>{user?.email}</strong></p>
              <div style={{ display: 'flex', gap: 8 }}>
                <input value={deleteEmail} onChange={e => setDeleteEmail(e.target.value)} placeholder={user?.email} style={{ ...inp, flex: 1 }} />
                <button onClick={eliminarCuenta} style={{ padding: '9px 16px', background: '#dc2626', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Confirmar</button>
                <button onClick={() => { setShowDelete(false); setDeleteEmail('') }} style={{ padding: '9px 12px', background: D.surface, border: `1px solid ${D.border}`, borderRadius: 8, color: D.textMuted, fontSize: 13, cursor: 'pointer' }}>Cancelar</button>
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}