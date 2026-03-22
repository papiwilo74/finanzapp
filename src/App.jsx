import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { FinanzasProvider } from "./context/FinanzasContext";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Transacciones from "./pages/Transacciones";
import Categorias from "./pages/Categorias";
import Presupuestos from "./pages/Presupuestos";
import Metas from "./pages/Metas";

function App() {
  const [authed, setAuthed] = useState(() => {
    return localStorage.getItem('fin_auth') === 'true'
  })

  const login = () => { localStorage.setItem('fin_auth', 'true'); setAuthed(true) }
  const logout = () => { localStorage.removeItem('fin_auth'); setAuthed(false) }

  return (
    <FinanzasProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={!authed ? <Login onLogin={login} /> : <Navigate to="/" />} />
          <Route path="/" element={authed ? <MainLayout onLogout={logout} /> : <Navigate to="/login" />}>
            <Route index element={<Dashboard />} />
            <Route path="transacciones" element={<Transacciones />} />
            <Route path="categorias" element={<Categorias />} />
            <Route path="presupuestos" element={<Presupuestos />} />
            <Route path="metas" element={<Metas />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </FinanzasProvider>
  )
}

export default App