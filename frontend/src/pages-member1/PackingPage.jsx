import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getPackingItems, savePackingItems, generateId } from '../utils/storage'
import { useToast, ToastContainer } from '../components/Toast'

const CATEGORIES = ['Documents', 'Clothing', 'Electronics', 'Toiletries', 'Other']

const CAT_ICONS = {
  Documents:   '📄',
  Clothing:    '👕',
  Electronics: '📱',
  Toiletries:  '🧴',
  Other:       '📦',
}

export default function PackingPage() {
  const { tripId } = useParams()
  const [items, setItems] = useState([])
  const [newItem, setNewItem] = useState('')
  const [newCat, setNewCat] = useState('Other')
  const { toasts, toast } = useToast()

  useEffect(() => { setItems(getPackingItems(tripId)) }, [tripId])

  const save = (updated) => {
    setItems(updated)
    savePackingItems(tripId, updated)
  }

  const handleAdd = (e) => {
    e.preventDefault()
    if (!newItem.trim()) return
    save([...items, { id: generateId(), name: newItem.trim(), category: newCat, isPacked: false }])
    setNewItem('')
    toast.success('Item added!')
  }

  const handleToggle = (id) => save(items.map(i => i.id === id ? { ...i, isPacked: !i.isPacked } : i))

  const handleDelete = (id) => save(items.filter(i => i.id !== id))

  const handleReset = () => {
    save(items.map(i => ({ ...i, isPacked: false })))
    toast.info('All items reset.')
  }

  const packed = items.filter(i => i.isPacked).length
  const pct = items.length ? Math.round((packed / items.length) * 100) : 0

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = items.filter(i => i.category === cat)
    return acc
  }, {})

  return (
    <div className="page-wrapper">
      <Navbar />
      <ToastContainer toasts={toasts} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <div className="mb-8">
          <p className="text-xs text-ink-muted mb-1">
            <Link to={`/trips/${tripId}/build`} className="hover:text-terracotta">← Back to Builder</Link>
          </p>
          <h1 className="font-display text-3xl font-bold text-ink">Packing List 🎒</h1>
        </div>

        {/* Progress */}
        <div className="card p-5 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-ink">{packed} of {items.length} items packed</span>
            <span className={`font-bold text-lg ${pct === 100 ? 'text-teal' : 'text-terracotta'}`}>{pct}%</span>
          </div>
          <div className="h-3 bg-warm-bg rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? 'bg-teal' : 'bg-terracotta'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          {pct === 100 && items.length > 0 && (
            <p className="text-center text-sm text-teal font-medium mt-2">🎉 All packed! Ready to go!</p>
          )}
        </div>

        {/* Add form */}
        <form onSubmit={handleAdd} className="card p-4 mb-6 flex gap-2 flex-wrap">
          <input
            type="text"
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
            placeholder="Item name..."
            className="input-field flex-1 min-w-32 py-2"
          />
          <select
            value={newCat}
            onChange={e => setNewCat(e.target.value)}
            className="input-field w-36 py-2"
          >
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <button type="submit" className="btn-primary py-2 px-4 whitespace-nowrap">+ Add</button>
        </form>

        {/* Reset */}
        {items.length > 0 && (
          <div className="flex justify-end mb-4">
            <button onClick={handleReset} className="text-xs text-ink-muted hover:text-terracotta transition-colors">
              ↺ Reset all
            </button>
          </div>
        )}

        {/* Grouped list */}
        {items.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-4xl mb-3">🎒</p>
            <p className="font-display text-xl font-bold text-ink mb-1">Nothing yet</p>
            <p className="text-ink-muted text-sm">Add items above to start your packing list.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {CATEGORIES.map(cat => {
              const catItems = grouped[cat]
              if (catItems.length === 0) return null
              const catPacked = catItems.filter(i => i.isPacked).length
              return (
                <div key={cat} className="card overflow-hidden">
                  <div className="px-4 py-3 bg-warm-bg border-b border-warm-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{CAT_ICONS[cat]}</span>
                      <span className="font-medium text-ink text-sm">{cat}</span>
                      <span className="text-xs text-ink-muted">({catPacked}/{catItems.length})</span>
                    </div>
                  </div>
                  <ul className="divide-y divide-warm-border">
                    {catItems.map(item => (
                      <li key={item.id} className="flex items-center gap-3 px-4 py-3 group hover:bg-warm-bg/50 transition-colors">
                        <button
                          onClick={() => handleToggle(item.id)}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            item.isPacked
                              ? 'bg-teal border-teal text-white'
                              : 'border-warm-border hover:border-teal'
                          }`}
                        >
                          {item.isPacked && <span className="text-xs">✓</span>}
                        </button>
                        <span className={`flex-1 text-sm transition-all ${item.isPacked ? 'line-through text-ink-light' : 'text-ink'}`}>
                          {item.name}
                        </span>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="opacity-0 group-hover:opacity-100 text-ink-light hover:text-red-400 transition-all text-xs"
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
