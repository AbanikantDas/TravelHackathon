import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useToast, ToastContainer } from '../components/Toast'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts'
import { getTripById, updateTrip } from '../utils/storage'
import { formatCurrency, getTripTotalCost, getActivityTypeColor } from '../utils/helpers'

const COLORS = ['#1B4D5C', '#C4703A', '#E8C97E', '#8B5CF6', '#10B981']

const CATEGORY_KEYS = ['Sightseeing', 'Food', 'Adventure', 'Culture', 'Other']

function EditableField({ label, value, prefix = '₹', onChange }) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(value)
  const handleBlur = () => { setEditing(false); onChange(Number(val) || 0) }
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-ink-muted">{label}</span>
      {editing ? (
        <div className="flex items-center gap-1">
          <span className="text-xs text-ink-muted">{prefix}</span>
          <input
            type="number"
            value={val}
            onChange={e => setVal(e.target.value)}
            onBlur={handleBlur}
            className="w-28 px-2 py-1 border border-terracotta rounded text-sm text-right focus:outline-none"
            autoFocus
            min="0"
          />
        </div>
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="font-medium text-ink text-sm hover:text-terracotta hover:underline transition-colors"
        >
          {prefix}{Number(value).toLocaleString('en-IN')} ✏️
        </button>
      )}
    </div>
  )
}

export default function BudgetPage() {
  const { tripId } = useParams()
  const [trip, setTrip] = useState(null)
  const [extraBudgets, setExtraBudgets] = useState({ transport: 0, stay: 0, meals: 0 })
  const { toasts, toast } = useToast()

  useEffect(() => {
    const t = getTripById(tripId)
    if (t) {
      setTrip(t)
      setExtraBudgets({
        transport: t.transportBudget || 0,
        stay: t.stayBudget || 0,
        meals: t.mealsBudget || 0,
      })
    }
  }, [tripId])

  if (!trip) return (
    <div className="page-wrapper"><Navbar />
      <div className="pt-24 text-center text-ink-muted">Trip not found. <Link to="/trips" className="text-terracotta hover:underline">Back</Link></div>
    </div>
  )

  const activityCost = getTripTotalCost(trip)
  const totalBudget = Number(trip.budget) || 0
  const grandTotal = activityCost + extraBudgets.transport + extraBudgets.stay + extraBudgets.meals
  const overBudget = grandTotal > totalBudget && totalBudget > 0
  const budgetPct = totalBudget > 0 ? Math.min(100, Math.round((grandTotal / totalBudget) * 100)) : 0

  // Build by-type breakdown
  const byType = {}
  ;(trip.stops || []).forEach(stop => {
    ;(stop.activities || []).forEach(act => {
      const t = act.type || 'Other'
      byType[t] = (byType[t] || 0) + (Number(act.cost) || 0)
    })
  })

  const pieData = [
    { name: 'Activities', value: activityCost },
    { name: 'Transport',  value: extraBudgets.transport },
    { name: 'Stay',       value: extraBudgets.stay },
    { name: 'Meals',      value: extraBudgets.meals },
  ].filter(d => d.value > 0)

  const barData = CATEGORY_KEYS.map(k => ({ name: k, Amount: byType[k] || 0 }))

  // All activities flat for the list
  const allActivities = (trip.stops || []).flatMap(stop =>
    (stop.activities || []).map(a => ({ ...a, city: stop.city }))
  ).sort((a, b) => (Number(b.cost) || 0) - (Number(a.cost) || 0))

  const handleExtraChange = (key, value) => {
    const updated = { ...extraBudgets, [key]: value }
    setExtraBudgets(updated)
    updateTrip(tripId, { [`${key}Budget`]: value })
    toast.success('Budget updated.')
  }

  const handleTotalBudgetChange = (value) => {
    updateTrip(tripId, { budget: value })
    setTrip(t => ({ ...t, budget: value }))
    toast.success('Total budget updated.')
  }

  return (
    <div className="page-wrapper">
      <Navbar />
      <ToastContainer toasts={toasts} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs text-ink-muted mb-1">
              <Link to={`/trips/${tripId}/build`} className="hover:text-terracotta">← Back to Builder</Link>
            </p>
            <h1 className="font-display text-3xl font-bold text-ink">Budget Breakdown</h1>
            <p className="text-ink-muted text-sm mt-1">{trip.name}</p>
          </div>
        </div>

        {/* Over budget alert */}
        {overBudget && (
          <div className="bg-red-50 border border-red-200 rounded-card p-4 mb-6 flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <p className="text-sm text-red-700 font-medium">
              You're over budget by {formatCurrency(grandTotal - totalBudget)}!
              Consider reducing some expenses.
            </p>
          </div>
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { icon: '💰', label: 'Total Budget',  value: formatCurrency(totalBudget), color: 'teal' },
            { icon: '💸', label: 'Total Spent',   value: formatCurrency(grandTotal),  color: overBudget ? 'red' : 'terracotta' },
            { icon: '✅', label: 'Remaining',     value: formatCurrency(Math.max(0, totalBudget - grandTotal)), color: 'green' },
            { icon: '🎯', label: 'Activities',    value: formatCurrency(activityCost), color: 'gold' },
          ].map(card => (
            <div key={card.label} className="card p-4 text-center">
              <div className="text-xl mb-1">{card.icon}</div>
              <div className={`font-display font-bold text-lg ${card.color === 'red' ? 'text-red-500' : card.color === 'green' ? 'text-teal' : 'text-ink'}`}>
                {card.value}
              </div>
              <div className="text-xs text-ink-muted">{card.label}</div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        {totalBudget > 0 && (
          <div className="card p-4 mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-ink-muted">Budget used</span>
              <span className={`font-medium ${overBudget ? 'text-red-500' : 'text-teal'}`}>{budgetPct}%</span>
            </div>
            <div className="h-3 bg-warm-bg rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${overBudget ? 'bg-red-400' : 'bg-gradient-to-r from-terracotta to-teal'}`}
                style={{ width: `${budgetPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="card p-5">
            <h3 className="font-display font-bold text-lg text-ink mb-4">Spending Breakdown</h3>
            {pieData.length === 0 ? (
              <p className="text-sm text-ink-muted text-center py-8">No costs yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={3}>
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => formatCurrency(v)} />
                  <Legend iconType="circle" iconSize={8} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="card p-5">
            <h3 className="font-display font-bold text-lg text-ink mb-4">By Activity Type</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EDE8E0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`} />
                <Tooltip formatter={v => formatCurrency(v)} />
                <Bar dataKey="Amount" fill="#C4703A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Editable extra budgets */}
        <div className="card p-5 mb-8">
          <h3 className="font-display font-bold text-lg text-ink mb-1">Budget Categories</h3>
          <p className="text-xs text-ink-muted mb-4">Click a value to edit it.</p>
          <div className="divide-y divide-warm-border">
            <EditableField label="Total Trip Budget" value={totalBudget} onChange={handleTotalBudgetChange} />
            <EditableField label="🚌 Transport / Flights" value={extraBudgets.transport} onChange={v => handleExtraChange('transport', v)} />
            <EditableField label="🏨 Accommodation / Stay" value={extraBudgets.stay} onChange={v => handleExtraChange('stay', v)} />
            <EditableField label="🍽️ Meals & Dining" value={extraBudgets.meals} onChange={v => handleExtraChange('meals', v)} />
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-ink-muted">🎯 Activities (auto)</span>
              <span className="font-medium text-ink text-sm">{formatCurrency(activityCost)}</span>
            </div>
          </div>
        </div>

        {/* Activity cost list */}
        {allActivities.length > 0 && (
          <div className="card p-5">
            <h3 className="font-display font-bold text-lg text-ink mb-4">Activity Costs</h3>
            <div className="space-y-2">
              {allActivities.map(act => {
                const { bg, text } = getActivityTypeColor(act.type)
                return (
                  <div key={act.id} className="flex items-center gap-3 py-1">
                    <span className="badge text-xs" style={{ backgroundColor: bg, color: text }}>{act.type}</span>
                    <span className="flex-1 text-sm text-ink">{act.name}</span>
                    <span className="text-xs text-ink-muted">{act.city}</span>
                    <span className="font-medium text-sm text-ink">{formatCurrency(act.cost)}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
