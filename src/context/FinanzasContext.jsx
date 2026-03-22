import { createContext, useContext, useState, useEffect } from 'react'

const FinanzasCtx = createContext()

const INITIAL_TX = [
  { id: 1, tipo: 'ingreso', monto: 2500000, categoria: 'Salario', descripcion: 'Sueldo mensual', fecha: '2026-03-01' },
  { id: 2, tipo: 'gasto', monto: 450000, categoria: 'Vivienda', descripcion: 'Arriendo', fecha: '2026-03-02' },
  { id: 3, tipo: 'gasto', monto: 85000, categoria: 'Comida', descripcion: 'Mercado semana 1', fecha: '2026-03-05' },
  { id: 4, tipo: 'ingreso', monto: 350000, categoria: 'Freelance', descripcion: 'Proyecto web', fecha: '2026-03-08' },
  { id: 5, tipo: 'gasto', monto: 65000, categoria: 'Transporte', descripcion: 'Gasolina', fecha: '2026-03-10' },
  { id: 6, tipo: 'gasto', monto: 120000, categoria: 'Entretenimiento', descripcion: 'Cine y restaurante', fecha: '2026-03-12' },
  { id: 7, tipo: 'gasto', monto: 45000, categoria: 'Salud', descripcion: 'Medicamentos', fecha: '2026-03-15' },
  { id: 8, tipo: 'gasto', monto: 72000, categoria: 'Comida', descripcion: 'Mercado semana 2', fecha: '2026-03-18' },
  { id: 9, tipo: 'ingreso', monto: 1800000, categoria: 'Salario', descripcion: 'Sueldo mensual', fecha: '2026-02-01' },
  { id: 10, tipo: 'gasto', monto: 450000, categoria: 'Vivienda', descripcion: 'Arriendo febrero', fecha: '2026-02-02' },
  { id: 11, tipo: 'gasto', monto: 95000, categoria: 'Comida', descripcion: 'Mercado febrero', fecha: '2026-02-10' },
  { id: 12, tipo: 'gasto', monto: 200000, categoria: 'Ropa', descripcion: 'Compras ropa', fecha: '2026-02-14' },
]

const INITIAL_BUDGETS = [
  { id: 1, categoria: 'Comida', limite: 200000 },
  { id: 2, categoria: 'Entretenimiento', limite: 100000 },
  { id: 3, categoria: 'Transporte', limite: 80000 },
  { id: 4, categoria: 'Ropa', limite: 150000 },
]

const INITIAL_GOALS = [
  { id: 1, nombre: 'Fondo de emergencia', objetivo: 5000000, actual: 1200000, color: '#5b5fcf', emoji: '🛡️' },
  { id: 2, nombre: 'Vacaciones', objetivo: 3000000, actual: 800000, color: '#059669', emoji: '✈️' },
  { id: 3, nombre: 'Computador nuevo', objetivo: 4500000, actual: 2100000, color: '#d97706', emoji: '💻' },
]

const load = (key, fallback) => {
  try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : fallback } catch { return fallback }
}

export function FinanzasProvider({ children }) {
  const [transactions, setTransactions] = useState(() => load('fin_tx', INITIAL_TX))
  const [budgets, setBudgets] = useState(() => load('fin_budgets', INITIAL_BUDGETS))
  const [goals, setGoals] = useState(() => load('fin_goals', INITIAL_GOALS))
  const [darkMode, setDarkMode] = useState(() => load('fin_dark', false))
  const [mesSeleccionado, setMesSeleccionado] = useState('2026-03')
  const [notifications, setNotifications] = useState([])
  const [user] = useState({ nombre: 'Juan Díaz', email: 'juan@finanzapp.co', avatar: 'JD' })

  useEffect(() => { localStorage.setItem('fin_tx', JSON.stringify(transactions)) }, [transactions])
  useEffect(() => { localStorage.setItem('fin_budgets', JSON.stringify(budgets)) }, [budgets])
  useEffect(() => { localStorage.setItem('fin_goals', JSON.stringify(goals)) }, [goals])
  useEffect(() => { localStorage.setItem('fin_dark', JSON.stringify(darkMode)) }, [darkMode])

  // Generar notificaciones cuando supera presupuesto
  useEffect(() => {
    const notifs = []
    budgets.forEach(b => {
      const gastado = transactions
        .filter(t => t.tipo === 'gasto' && t.categoria === b.categoria && t.fecha.startsWith(mesSeleccionado))
        .reduce((s, t) => s + t.monto, 0)
      const pct = (gastado / b.limite) * 100
      if (pct >= 100) {
        notifs.push({ id: b.id, tipo: 'danger', msg: `Superaste el presupuesto de ${b.categoria} (${Math.round(pct)}%)` })
      } else if (pct >= 80) {
        notifs.push({ id: b.id, tipo: 'warning', msg: `Llevas el ${Math.round(pct)}% del presupuesto de ${b.categoria}` })
      }
    })
    setNotifications(notifs)
  }, [transactions, budgets, mesSeleccionado])

  const txMes = transactions.filter(t => t.fecha.startsWith(mesSeleccionado))
  const ingresos = txMes.filter(t => t.tipo === 'ingreso').reduce((s, t) => s + t.monto, 0)
  const gastos = txMes.filter(t => t.tipo === 'gasto').reduce((s, t) => s + t.monto, 0)
  const balance = ingresos - gastos

  const addTransaction = (tx) => setTransactions(p => [...p, { ...tx, id: Date.now() }])
  const deleteTransaction = (id) => setTransactions(p => p.filter(t => t.id !== id))
  const addBudget = (b) => setBudgets(p => [...p, { ...b, id: Date.now() }])
  const deleteBudget = (id) => setBudgets(p => p.filter(b => b.id !== id))
  const addGoal = (g) => setGoals(p => [...p, { ...g, id: Date.now() }])
  const updateGoal = (id, actual) => setGoals(p => p.map(g => g.id === id ? { ...g, actual } : g))
  const deleteGoal = (id) => setGoals(p => p.filter(g => g.id !== id))

  const mesesDisponibles = [...new Set(transactions.map(t => t.fecha.slice(0, 7)))].sort((a, b) => b.localeCompare(a))

  return (
    <FinanzasCtx.Provider value={{
      transactions, txMes, addTransaction, deleteTransaction,
      budgets, addBudget, deleteBudget,
      goals, addGoal, updateGoal, deleteGoal,
      ingresos, gastos, balance,
      darkMode, setDarkMode,
      mesSeleccionado, setMesSeleccionado, mesesDisponibles,
      notifications, user
    }}>
      {children}
    </FinanzasCtx.Provider>
  )
}

export const useFinanzas = () => useContext(FinanzasCtx)