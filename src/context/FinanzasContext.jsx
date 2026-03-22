import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../supabase'

const FinanzasCtx = createContext()

export function FinanzasProvider({ children }) {
  const [user, setUser] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [budgets, setBudgets] = useState([])
  const [goals, setGoals] = useState([])
  const [darkMode, setDarkMode] = useState(() => JSON.parse(localStorage.getItem('fin_dark') || 'false'))
  const [mesSeleccionado, setMesSeleccionado] = useState(new Date().toISOString().slice(0, 7))
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (user) fetchAll()
    else { setTransactions([]); setBudgets([]); setGoals([]) }
  }, [user])

  useEffect(() => {
    localStorage.setItem('fin_dark', JSON.stringify(darkMode))
  }, [darkMode])

  const txMes = transactions.filter(t => t.fecha?.startsWith(mesSeleccionado))

  useEffect(() => {
    const notifs = []
    budgets.forEach(b => {
      const gastado = txMes.filter(t => t.tipo === 'gasto' && t.categoria === b.categoria).reduce((s, t) => s + t.monto, 0)
      const pct = (gastado / b.limite) * 100
      if (pct >= 100) notifs.push({ id: b.id, tipo: 'danger', msg: `Superaste el presupuesto de ${b.categoria} (${Math.round(pct)}%)` })
      else if (pct >= 80) notifs.push({ id: b.id, tipo: 'warning', msg: `Llevas el ${Math.round(pct)}% del presupuesto de ${b.categoria}` })
    })
    setNotifications(notifs)
  }, [transactions, budgets, mesSeleccionado])

  const fetchAll = async () => {
    const [{ data: tx }, { data: bp }, { data: gt }] = await Promise.all([
      supabase.from('transacciones').select('*').order('fecha', { ascending: false }),
      supabase.from('presupuestos').select('*'),
      supabase.from('metas').select('*'),
    ])
    setTransactions(tx || [])
    setBudgets(bp || [])
    setGoals(gt || [])
  }

  const ingresos = txMes.filter(t => t.tipo === 'ingreso').reduce((s, t) => s + t.monto, 0)
  const gastos = txMes.filter(t => t.tipo === 'gasto').reduce((s, t) => s + t.monto, 0)
  const balance = ingresos - gastos
  const mesesDisponibles = [...new Set(transactions.map(t => t.fecha?.slice(0, 7)))].filter(Boolean).sort((a, b) => b.localeCompare(a))

  const addTransaction = async (tx) => {
    const { data, error } = await supabase.from('transacciones').insert({ ...tx, user_id: user.id }).select().single()
    if (!error) setTransactions(p => [data, ...p])
  }
  const deleteTransaction = async (id) => {
    await supabase.from('transacciones').delete().eq('id', id)
    setTransactions(p => p.filter(t => t.id !== id))
  }
  const addBudget = async (b) => {
    const { data, error } = await supabase.from('presupuestos').insert({ ...b, user_id: user.id }).select().single()
    if (!error) setBudgets(p => [...p, data])
  }
  const deleteBudget = async (id) => {
    await supabase.from('presupuestos').delete().eq('id', id)
    setBudgets(p => p.filter(b => b.id !== id))
  }
  const addGoal = async (g) => {
    const { data, error } = await supabase.from('metas').insert({ ...g, user_id: user.id }).select().single()
    if (!error) setGoals(p => [...p, data])
  }
  const updateGoal = async (id, actual) => {
    await supabase.from('metas').update({ actual }).eq('id', id)
    setGoals(p => p.map(g => g.id === id ? { ...g, actual } : g))
  }
  const deleteGoal = async (id) => {
    await supabase.from('metas').delete().eq('id', id)
    setGoals(p => p.filter(g => g.id !== id))
  }

  return (
    <FinanzasCtx.Provider value={{
      user, loading,
      transactions, txMes, addTransaction, deleteTransaction,
      budgets, addBudget, deleteBudget,
      goals, addGoal, updateGoal, deleteGoal,
      ingresos, gastos, balance,
      darkMode, setDarkMode,
      mesSeleccionado, setMesSeleccionado, mesesDisponibles,
      notifications
    }}>
      {children}
    </FinanzasCtx.Provider>
  )
}

export const useFinanzas = () => useContext(FinanzasCtx)