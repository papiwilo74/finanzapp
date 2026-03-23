import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { FinanzasProvider, useFinanzas } from "./context/FinanzasContext"
import MainLayout from "./layouts/MainLayout"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Transacciones from "./pages/Transacciones"
import Categorias from "./pages/Categorias"
import Presupuestos from "./pages/Presupuestos"
import Metas from "./pages/Metas"
import Asistente from "./pages/Asistente"


function AppRoutes() {
  const { user, loading } = useFinanzas()

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#818cf8', fontSize: 14 }}>Cargando...</div>
    </div>
  )

  const logout = async () => {
    const { supabase } = await import('./supabase')
    await supabase.auth.signOut()
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/" element={user ? <MainLayout onLogout={logout} /> : <Navigate to="/login" />}>
        <Route index element={<Dashboard />} />
        <Route path="transacciones" element={<Transacciones />} />
        <Route path="categorias" element={<Categorias />} />
        <Route path="presupuestos" element={<Presupuestos />} />
        <Route path="metas" element={<Metas />} />
        <Route path="asistente" element={<Asistente />} />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <FinanzasProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </FinanzasProvider>
  )
}

export default App