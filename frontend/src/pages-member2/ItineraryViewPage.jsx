import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ActivityCard from '../components/ActivityCard'
import EmptyState from '../components/EmptyState'
import { getTripById } from '../utils/storage'
import { formatDate, getDuration, formatCurrency, getTripTotalCost, getActivityTypeColor } from '../utils/helpers'

export default function ItineraryViewPage() {
  const { tripId } = useParams()
  const [trip, setTrip] = useState(null)
  const [view, setView] = useState('list') // 'list' | 'summary'
  const [shareMsg, setShareMsg] = useState('')

  useEffect(() => {
    setTrip(getTripById(tripId))
  }, [tripId])

  if (!trip) return (
    <div className="page-wrapper">
      <Navbar />
      <div className="pt-24 text-center">
        <p className="text-ink-muted">Trip not found.</p>
        <Link to="/trips" className="text-terracotta hover:underline">← Back to trips</Link>
      </div>
    </div>
  )

  const totalCost = getTripTotalCost(trip)
  const duration = getDuration(trip.startDate, trip.endDate)
  const totalActivities = trip.stops?.reduce((s, st) => s + (st.activities?.length || 0), 0) || 0

  const handleShare = () => {
    const url = `${window.location.origin}/shared/${tripId}`
    navigator.clipboard?.writeText(url).then(() => setShareMsg('Link copied!')).catch(() => setShareMsg(url))
    setTimeout(() => setShareMsg(''), 3000)
  }

  return (
    <div className="page-wrapper">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        {/* Header */}
        <div className="relative h-56 rounded-2xl overflow-hidden mb-8 shadow-card-hover">
          <img
            src={trip.coverPhoto || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80'}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 p-6">
            <h1 className="font-display text-3xl font-bold text-white mb-1">{trip.name}</h1>
            <p className="text-white/80 text-sm">
              {formatDate(trip.startDate)} → {formatDate(trip.endDate)} · {duration} days · {trip.stops?.length || 0} cities
            </p>
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={handleShare}
              className="glass text-ink text-sm px-3 py-1.5 rounded-full font-medium hover:bg-white/80 transition-all"
            >
              {shareMsg || '🔗 Share'}
            </button>
            <Link to={`/trips/${tripId}/build`}>
              <button className="glass text-ink text-sm px-3 py-1.5 rounded-full font-medium hover:bg-white/80 transition-all">
                ✏️ Edit
              </button>
            </Link>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { icon: '🏙️', value: trip.stops?.length || 0, label: 'Cities' },
            { icon: '🎯', value: totalActivities,           label: 'Activities' },
            { icon: '📅', value: `${duration}d`,            label: 'Duration' },
            { icon: '💰', value: formatCurrency(totalCost), label: 'Est. Cost' },
          ].map(s => (
            <div key={s.label} className="card p-4 text-center">
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="font-display font-bold text-lg text-ink">{s.value}</div>
              <div className="text-xs text-ink-muted">{s.label}</div>
            </div>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold text-ink">Itinerary</h2>
          <div className="flex rounded-btn border border-warm-border overflow-hidden">
            {[['list', '☰ List'], ['summary', '📋 Summary']].map(([v, label]) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-2 text-sm font-medium transition-all ${view === v ? 'bg-terracotta text-white' : 'text-ink-muted hover:bg-warm-bg'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* List view */}
        {view === 'list' && (
          trip.stops?.length === 0 ? (
            <EmptyState icon="🗺️" title="No stops added" description="Go to the builder to add cities and activities." />
          ) : (
            <div className="space-y-8">
              {trip.stops.map((stop, idx) => {
                const stopCost = (stop.activities || []).reduce((s, a) => s + (Number(a.cost) || 0), 0)
                return (
                  <div key={stop.id} className="animate-fade-in-up">
                    {/* Stop header */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-teal text-white flex items-center justify-center font-display font-bold flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display text-xl font-bold text-ink">
                          {stop.emoji} {stop.city}, {stop.country}
                        </h3>
                        <p className="text-sm text-ink-muted">
                          {stop.arrivalDate ? formatDate(stop.arrivalDate, 'MMM d') : '—'} → {stop.departureDate ? formatDate(stop.departureDate, 'MMM d') : '—'}
                          {' '}· {getDuration(stop.arrivalDate, stop.departureDate)} nights
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-ink">{formatCurrency(stopCost)}</p>
                        <p className="text-xs text-ink-muted">{stop.activities?.length || 0} activities</p>
                      </div>
                    </div>

                    {/* Activity timeline */}
                    {stop.activities?.length > 0 ? (
                      <div className="ml-5 pl-8 border-l-2 border-warm-border space-y-3">
                        {[...stop.activities].sort((a, b) => (a.time || '').localeCompare(b.time || '')).map(act => {
                          const { bg, text } = getActivityTypeColor(act.type)
                          return (
                            <div key={act.id} className="relative">
                              <div
                                className="absolute -left-[2.15rem] top-3 w-3 h-3 rounded-full border-2 border-white shadow"
                                style={{ backgroundColor: text }}
                              />
                              <ActivityCard activity={act} />
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="ml-14 text-sm text-ink-muted italic">No activities planned for this stop.</div>
                    )}
                  </div>
                )
              })}
            </div>
          )
        )}

        {/* Summary view */}
        {view === 'summary' && (
          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="font-display text-lg font-bold text-ink mb-4">Trip Overview</h3>
              {trip.description && <p className="text-sm text-ink-muted mb-4">{trip.description}</p>}
              <div className="space-y-3">
                {trip.stops?.map((stop, i) => {
                  const cost = (stop.activities || []).reduce((s, a) => s + (Number(a.cost) || 0), 0)
                  return (
                    <div key={stop.id} className="flex items-center justify-between py-2 border-b border-warm-border last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-teal text-white text-xs flex items-center justify-center font-bold">{i + 1}</span>
                        <div>
                          <span className="font-medium text-ink">{stop.emoji} {stop.city}</span>
                          <span className="text-xs text-ink-muted ml-2">{stop.activities?.length || 0} activities</span>
                        </div>
                      </div>
                      <span className="font-medium text-ink">{formatCurrency(cost)}</span>
                    </div>
                  )
                })}
              </div>
              <div className="mt-4 pt-4 border-t-2 border-warm-border flex justify-between">
                <span className="font-display font-bold text-ink">Total Estimated Cost</span>
                <span className="font-display font-bold text-xl text-terracotta">{formatCurrency(totalCost)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-8 flex gap-3 flex-wrap">
          <Link to={`/trips/${tripId}/budget`}><button className="btn-primary">💰 Budget Breakdown</button></Link>
          <Link to={`/trips/${tripId}/packing`}><button className="btn-secondary">🎒 Packing List</button></Link>
          <Link to={`/trips/${tripId}/notes`}><button className="btn-secondary">📝 Trip Notes</button></Link>
        </div>
      </div>
    </div>
  )
}
