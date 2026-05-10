import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import CityCard from '../components/CityCard'
import { CITIES_DB } from '../utils/helpers'
import { getTrips, addStop } from '../utils/storage'
import { useToast, ToastContainer } from '../components/Toast'

const REGIONS = ['All', ...new Set(CITIES_DB.map(c => c.region))]
const COSTS = ['All', '$', '$$', '$$$']

export default function ExplorePage() {
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('All')
  const [cost, setCost] = useState('All')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [added, setAdded] = useState({})
  const [tripTarget, setTripTarget] = useState('')
  const trips = getTrips()
  const { toasts, toast } = useToast()

  // Debounce 300ms
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(t)
  }, [search])

  const filtered = CITIES_DB.filter(c => {
    const q = debouncedSearch.toLowerCase()
    const mQ = !q || c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)
    const mR = region === 'All' || c.region === region
    const mC = cost === 'All' || c.costIndex === cost
    return mQ && mR && mC
  }).sort((a, b) => b.popularity - a.popularity)

  const handleAdd = (city) => {
    if (!tripTarget) {
      toast.error('Please select a trip first.')
      return
    }
    addStop(tripTarget, { city: city.name, country: city.country, emoji: city.emoji })
    setAdded(a => ({ ...a, [city.id]: true }))
    toast.success(`${city.name} added to trip!`)
  }

  return (
    <div className="page-wrapper">
      <Navbar />
      <ToastContainer toasts={toasts} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-ink">Explore Destinations</h1>
          <p className="text-ink-muted mt-1">Discover {CITIES_DB.length} cities around the world</p>
        </div>

        {/* Trip selector */}
        {trips.length > 0 && (
          <div className="card p-4 mb-6 flex items-center gap-4 flex-wrap">
            <span className="text-sm font-medium text-ink">Add cities to:</span>
            <select
              value={tripTarget}
              onChange={e => setTripTarget(e.target.value)}
              className="input-field w-auto py-1.5 text-sm"
            >
              <option value="">— Select a trip —</option>
              {trips.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <Link to="/trips/new" className="text-sm text-terracotta hover:underline">Or create a new trip →</Link>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-light">🔍</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search cities or countries..."
              className="input-field pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {REGIONS.map(r => (
              <button key={r} onClick={() => setRegion(r)}
                className={`px-3 py-2 rounded-btn text-xs font-medium border transition-all ${region === r ? 'bg-teal text-white border-teal' : 'bg-white text-ink-muted border-warm-border hover:border-teal hover:text-teal'}`}>
                {r}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {COSTS.map(c => (
              <button key={c} onClick={() => setCost(c)}
                className={`px-3 py-2 rounded-btn text-xs font-medium border transition-all ${cost === c ? 'bg-terracotta text-white border-terracotta' : 'bg-white text-ink-muted border-warm-border hover:border-terracotta hover:text-terracotta'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-ink-muted mb-4">{filtered.length} destination{filtered.length !== 1 ? 's' : ''} found</p>

        {/* City grid */}
        {filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-4xl mb-3">🗺️</p>
            <p className="font-display text-xl font-bold text-ink mb-2">No cities found</p>
            <p className="text-ink-muted text-sm">Try a different search or filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-fade-in-up">
            {filtered.map(city => (
              <CityCard key={city.id} city={city} onAdd={handleAdd} added={!!added[city.id]} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
