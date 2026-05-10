import React, { useState, useEffect } from 'react'
import ActivityCard from '../components/ActivityCard'
import Modal from '../components/Modal'
import { addActivity } from '../utils/storage'
import { ACTIVITIES_BY_CITY } from '../utils/helpers'

const TABS = ['All', 'Sightseeing', 'Food', 'Adventure', 'Culture']

/**
 * ActivitySearchModal — Member 2's standalone modal (Screen 8).
 * Can also be imported directly from ItineraryBuilderPage.
 *
 * Props:
 *   isOpen  — boolean
 *   onClose — () => void
 *   stop    — the current stop object { id, city, activities[] }
 *   tripId  — string
 *   onAdded — () => void  (called after an activity is added)
 */
export default function ActivitySearchModal({ isOpen, onClose, stop, tripId, onAdded }) {
  const [tab, setTab]       = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!isOpen) { setTab('All'); setSearch('') }
  }, [isOpen])

  const cityActivities = ACTIVITIES_BY_CITY[stop?.city] || []
  const addedNames     = new Set((stop?.activities || []).map(a => a.name))

  const filtered = cityActivities.filter(a => {
    const q = search.toLowerCase()
    const matchQ = !q || a.name.toLowerCase().includes(q)
    const matchT = tab === 'All' || a.type === tab
    return matchQ && matchT
  })

  const handleAdd = (act) => {
    addActivity(tripId, stop.id, act)
    onAdded?.()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Activities — ${stop?.city || ''}`}
      size="lg"
    >
      <div className="space-y-4">
        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search activities..."
          className="input-field"
          autoFocus
        />

        {/* Type filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                tab === t
                  ? 'bg-teal text-white'
                  : 'bg-warm-bg text-ink-muted border border-warm-border hover:border-teal hover:text-teal'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Activity list */}
        {filtered.length === 0 ? (
          <p className="text-center text-sm text-ink-muted py-8">
            No activities found for {stop?.city || 'this city'} yet.
          </p>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {filtered.map(act => (
              <ActivityCard
                key={act.id}
                activity={act}
                added={addedNames.has(act.name)}
                onAdd={handleAdd}
              />
            ))}
          </div>
        )}

        {/* Custom activity quick-add */}
        <CustomActivityForm tripId={tripId} stopId={stop?.id} onAdded={onAdded} />
      </div>
    </Modal>
  )
}

function CustomActivityForm({ tripId, stopId, onAdded }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', type: 'Sightseeing', cost: '', duration: '', time: '' })
  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }))

  const handleAdd = () => {
    if (!form.name.trim()) return
    addActivity(tripId, stopId, { ...form, cost: Number(form.cost) || 0 })
    setForm({ name: '', type: 'Sightseeing', cost: '', duration: '', time: '' })
    setOpen(false)
    onAdded?.()
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full border-2 border-dashed border-warm-border rounded-btn py-2 text-sm text-ink-muted hover:border-terracotta hover:text-terracotta transition-all"
      >
        + Add Custom Activity
      </button>
    )
  }

  return (
    <div className="card p-4 space-y-3 border-terracotta/30">
      <p className="text-sm font-medium text-ink">Custom Activity</p>
      <input type="text" placeholder="Activity name *" value={form.name} onChange={set('name')} className="input-field text-sm py-2" />
      <div className="grid grid-cols-2 gap-2">
        <select value={form.type} onChange={set('type')} className="input-field text-sm py-2">
          {['Sightseeing', 'Food', 'Adventure', 'Culture', 'Other'].map(t => <option key={t}>{t}</option>)}
        </select>
        <input type="number" placeholder="Cost (₹)" value={form.cost} onChange={set('cost')} className="input-field text-sm py-2" min="0" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input type="text" placeholder="Duration (e.g. 2 hrs)" value={form.duration} onChange={set('duration')} className="input-field text-sm py-2" />
        <input type="time" value={form.time} onChange={set('time')} className="input-field text-sm py-2" />
      </div>
      <div className="flex gap-2">
        <button onClick={handleAdd} className="btn-primary flex-1 text-sm py-2">Add</button>
        <button onClick={() => setOpen(false)} className="btn-secondary px-4 text-sm py-2">Cancel</button>
      </div>
    </div>
  )
}
