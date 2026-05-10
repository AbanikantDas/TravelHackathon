import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Modal from '../components/Modal'
import ActivityCard from '../components/ActivityCard'
import EmptyState from '../components/EmptyState'
import { useToast, ToastContainer } from '../components/Toast'
import {
  getTripById, addStop, updateStop, deleteStop,
  addActivity, deleteActivity, updateTrip,
} from '../utils/storage'
import { formatDate, CITIES_DB, ACTIVITIES_BY_CITY } from '../utils/helpers'

function CitySearchModal({ isOpen, onClose, onAdd }) {
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('All')
  const regions = ['All', ...new Set(CITIES_DB.map(c => c.region))]

  useEffect(() => { if (!isOpen) { setSearch(''); setRegion('All') } }, [isOpen])

  const filtered = CITIES_DB.filter(c => {
    const q = search.toLowerCase()
    const matchQ = !q || c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)
    const matchR = region === 'All' || c.region === region
    return matchQ && matchR
  })

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add a City Stop" size="lg">
      <div className="space-y-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search cities..."
          className="input-field"
          autoFocus
        />
        <div className="flex flex-wrap gap-2">
          {regions.map(r => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${region === r ? 'bg-terracotta text-white' : 'bg-warm-bg text-ink-muted border border-warm-border hover:border-terracotta hover:text-terracotta'}`}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-1">
          {filtered.map(city => (
            <button
              key={city.id}
              onClick={() => { onAdd(city); onClose() }}
              className="card p-3 text-left hover:border-terracotta hover:shadow-card-hover transition-all duration-200 group"
            >
              <div className="relative h-16 rounded-lg overflow-hidden mb-2">
                <img src={city.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              </div>
              <p className="font-medium text-sm text-ink">{city.emoji} {city.name}</p>
              <p className="text-xs text-ink-muted">{city.country}</p>
            </button>
          ))}
        </div>
      </div>
    </Modal>
  )
}

function ActivityModal({ isOpen, onClose, stop, tripId, onAdded }) {
  const [tab, setTab] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => { if (!isOpen) { setTab('All'); setSearch('') } }, [isOpen])

  const cityActivities = ACTIVITIES_BY_CITY[stop?.city] || []
  const addedIds = new Set((stop?.activities || []).map(a => a.name))

  const filtered = cityActivities.filter(a => {
    const q = search.toLowerCase()
    return (!q || a.name.toLowerCase().includes(q)) && (tab === 'All' || a.type === tab)
  })

  const tabs = ['All', 'Sightseeing', 'Food', 'Adventure', 'Culture']

  const handleAdd = (act) => {
    addActivity(tripId, stop.id, act)
    onAdded?.()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Activities — ${stop?.city || ''}`} size="lg">
      <div className="space-y-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search activities..."
          className="input-field"
        />
        <div className="flex gap-2 overflow-x-auto pb-1">
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${tab === t ? 'bg-teal text-white' : 'bg-warm-bg text-ink-muted border border-warm-border hover:border-teal hover:text-teal'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-sm text-ink-muted py-8">No activities found for this city yet.</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {filtered.map(act => (
              <ActivityCard
                key={act.id}
                activity={act}
                added={addedIds.has(act.name)}
                onAdd={handleAdd}
              />
            ))}
          </div>
        )}

        {/* Custom activity form */}
        <AddCustomActivity tripId={tripId} stopId={stop?.id} onAdded={onAdded} />
      </div>
    </Modal>
  )
}

function AddCustomActivity({ tripId, stopId, onAdded }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', type: 'Sightseeing', cost: '', duration: '', time: '' })
  const set = f => e => setForm(prev => ({ ...prev, [f]: e.target.value }))

  const handleAdd = () => {
    if (!form.name.trim()) return
    addActivity(tripId, stopId, { ...form, cost: Number(form.cost) || 0 })
    setForm({ name: '', type: 'Sightseeing', cost: '', duration: '', time: '' })
    setOpen(false)
    onAdded?.()
  }

  if (!open) return (
    <button onClick={() => setOpen(true)} className="w-full border-2 border-dashed border-warm-border rounded-btn py-2 text-sm text-ink-muted hover:border-terracotta hover:text-terracotta transition-all">
      + Add Custom Activity
    </button>
  )

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

export default function ItineraryBuilderPage() {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [cityModal, setCityModal] = useState(false)
  const [actModal, setActModal] = useState(null)
  const { toasts, toast } = useToast()

  const refresh = () => setTrip(getTripById(tripId))

  useEffect(() => {
    const t = getTripById(tripId)
    if (!t) { navigate('/trips'); return }
    setTrip(t)
  }, [tripId, navigate])

  if (!trip) return null

  const handleAddCity = (city) => {
    addStop(tripId, {
      city: city.name,
      country: city.country,
      emoji: city.emoji,
    })
    refresh()
    toast.success(`${city.name} added!`)
  }

  const handleDeleteStop = (stopId) => {
    deleteStop(tripId, stopId)
    refresh()
    toast.success('City removed.')
  }

  const handleDeleteActivity = (stopId, actId) => {
    deleteActivity(tripId, stopId, actId)
    refresh()
  }

  const handleStopDateChange = (stopId, field, value) => {
    updateStop(tripId, stopId, { [field]: value })
    refresh()
  }

  return (
    <div className="page-wrapper">
      <Navbar />
      <ToastContainer toasts={toasts} />

      <CitySearchModal isOpen={cityModal} onClose={() => setCityModal(false)} onAdd={handleAddCity} />
      {actModal && (
        <ActivityModal
          isOpen={!!actModal}
          onClose={() => setActModal(null)}
          stop={actModal}
          tripId={tripId}
          onAdded={refresh}
        />
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs text-ink-muted mb-1">
              <Link to="/trips" className="hover:text-terracotta">My Trips</Link> / Builder
            </p>
            <h1 className="font-display text-3xl font-bold text-ink">{trip.name}</h1>
            {trip.startDate && (
              <p className="text-ink-muted text-sm mt-1">
                {formatDate(trip.startDate)} → {formatDate(trip.endDate)}
              </p>
            )}
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={() => setCityModal(true)} className="btn-primary">+ Add City</button>
            <Link to={`/trips/${tripId}/itinerary`}>
              <button className="btn-secondary">View Itinerary</button>
            </Link>
          </div>
        </div>

        {/* Stops */}
        {trip.stops?.length === 0 ? (
          <EmptyState
            icon="🗺️"
            title="No cities yet"
            description="Start by adding your first destination."
            action={{ label: '+ Add City', onClick: () => setCityModal(true) }}
          />
        ) : (
          <div className="space-y-6">
            {trip.stops.map((stop, idx) => (
              <div key={stop.id} className="card overflow-hidden animate-fade-in-up">
                {/* Stop header */}
                <div className="bg-gradient-to-r from-teal/10 to-transparent p-4 border-b border-warm-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-lg text-ink">
                          {stop.emoji} {stop.city}, {stop.country}
                        </h3>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteStop(stop.id)}
                      className="text-ink-light hover:text-red-500 transition-colors p-1.5 hover:bg-red-50 rounded"
                    >
                      🗑️
                    </button>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="text-xs text-ink-muted">Arrival</label>
                      <input
                        type="date"
                        value={stop.arrivalDate || ''}
                        onChange={e => handleStopDateChange(stop.id, 'arrivalDate', e.target.value)}
                        className="input-field text-sm py-1.5 mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-ink-muted">Departure</label>
                      <input
                        type="date"
                        value={stop.departureDate || ''}
                        onChange={e => handleStopDateChange(stop.id, 'departureDate', e.target.value)}
                        className="input-field text-sm py-1.5 mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Activities */}
                <div className="p-4">
                  {stop.activities?.length > 0 ? (
                    <div className="space-y-2 mb-3">
                      {stop.activities.map(act => (
                        <div key={act.id} className="relative group">
                          <ActivityCard activity={act} compact />
                          <button
                            onClick={() => handleDeleteActivity(stop.id, act.id)}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 w-6 h-6 rounded-full bg-red-50 text-red-400 hover:bg-red-100 text-xs transition-all flex items-center justify-center"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-ink-muted text-center py-4">No activities yet.</p>
                  )}
                  <button
                    onClick={() => setActModal(stop)}
                    className="w-full border-2 border-dashed border-warm-border rounded-btn py-2 text-sm text-ink-muted hover:border-terracotta hover:text-terracotta transition-all duration-200"
                  >
                    + Add Activity
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom nav */}
        <div className="mt-8 flex gap-3 flex-wrap">
          <Link to={`/trips/${tripId}/budget`}><button className="btn-secondary">💰 Budget</button></Link>
          <Link to={`/trips/${tripId}/packing`}><button className="btn-secondary">🎒 Packing</button></Link>
          <Link to={`/trips/${tripId}/notes`}><button className="btn-secondary">📝 Notes</button></Link>
        </div>
      </div>
    </div>
  )
}
