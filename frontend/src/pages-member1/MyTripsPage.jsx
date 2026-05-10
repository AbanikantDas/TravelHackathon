import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import TripCard from '../components/TripCard'
import EmptyState from '../components/EmptyState'
import { useToast, ToastContainer } from '../components/Toast'
import { getTrips, deleteTrip } from '../utils/storage'

const FILTERS = ['All', 'Upcoming', 'Past']

export default function MyTripsPage() {
  const [trips, setTrips] = useState([])
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const { toasts, toast } = useToast()

  useEffect(() => { setTrips(getTrips()) }, [])

  const handleDelete = (id) => {
    if (!window.confirm('Delete this trip? This cannot be undone.')) return
    deleteTrip(id)
    setTrips(getTrips())
    toast.success('Trip deleted.')
  }

  const now = new Date()
  const filtered = trips
    .filter(t => {
      if (search) return t.name.toLowerCase().includes(search.toLowerCase())
      return true
    })
    .filter(t => {
      if (filter === 'Upcoming') return new Date(t.startDate) >= now
      if (filter === 'Past')     return new Date(t.endDate) < now
      return true
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  return (
    <div className="page-wrapper">
      <Navbar />
      <ToastContainer toasts={toasts} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-ink">My Trips</h1>
            <p className="text-ink-muted mt-1">{trips.length} {trips.length === 1 ? 'adventure' : 'adventures'} planned</p>
          </div>
          <Link to="/trips/new">
            <button className="btn-primary px-6">+ Plan New Trip</button>
          </Link>
        </div>

        {/* Search + Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-light text-sm">🔍</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search trips..."
              className="input-field pl-9"
            />
          </div>
          <div className="flex gap-2">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2.5 rounded-btn text-sm font-medium border transition-all duration-200 ${
                  filter === f
                    ? 'bg-terracotta text-white border-terracotta'
                    : 'bg-white text-ink-muted border-warm-border hover:border-terracotta hover:text-terracotta'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Trip grid */}
        {filtered.length === 0 ? (
          <EmptyState
            icon="🌍"
            title={trips.length === 0 ? "No trips yet" : "No trips match your filter"}
            description={trips.length === 0 ? "Start planning your next adventure!" : "Try a different filter or search term."}
            action={trips.length === 0 ? { label: 'Plan a Trip', onClick: () => navigate('/trips/new') } : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-fade-in-up">
            {filtered.map(trip => (
              <TripCard key={trip.id} trip={trip} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
