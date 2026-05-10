import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getTripById, getUser } from '../utils/storage'
import { formatDate, getDuration, formatCurrency, getTripTotalCost, getActivityTypeColor } from '../utils/helpers'

export default function SharedItineraryPage() {
  const { tripId } = useParams()
  const [trip, setTrip] = useState(null)
  const [copied, setCopied] = useState(false)
  const user = getUser()

  useEffect(() => {
    const t = getTripById(tripId)
    setTrip(t)
  }, [tripId])

  const handleCopy = () => {
    navigator.clipboard?.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!trip) return (
    <div className="min-h-screen bg-warm-bg flex items-center justify-center flex-col gap-4">
      <p className="text-5xl">✈️</p>
      <h1 className="font-display text-2xl font-bold text-ink">Trip not found</h1>
      <p className="text-ink-muted">This shared itinerary may have been removed.</p>
      <Link to="/dashboard" className="btn-primary">Go Home</Link>
    </div>
  )

  const totalCost = getTripTotalCost(trip)

  return (
    <div className="min-h-screen bg-warm-bg">
      {/* Top bar */}
      <div className="bg-white border-b border-warm-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-terracotta to-teal flex items-center justify-center">
            <span className="text-white font-display font-bold text-sm">T</span>
          </div>
          <span className="font-display font-bold text-lg text-ink">Travel<span className="text-terracotta">oop</span></span>
        </div>
        <div className="flex items-center gap-2">
          {user && (
            <Link to={`/trips/${tripId}/build`}>
              <button className="btn-primary text-sm py-1.5 px-3">📋 Clone Trip</button>
            </Link>
          )}
          <button onClick={handleCopy} className="btn-secondary text-sm py-1.5 px-3">
            {copied ? '✓ Copied!' : '🔗 Copy Link'}
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="relative h-56 rounded-2xl overflow-hidden mb-8 shadow-card">
          <img
            src={trip.coverPhoto || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80'}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 p-6">
            <h1 className="font-display text-3xl font-bold text-white mb-1">{trip.name}</h1>
            <p className="text-white/80 text-sm">
              {formatDate(trip.startDate)} → {formatDate(trip.endDate)} · {getDuration(trip.startDate, trip.endDate)} days
            </p>
          </div>
        </div>

        {/* Description */}
        {trip.description && (
          <div className="card p-5 mb-6">
            <p className="text-ink-muted italic">"{trip.description}"</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: '🏙️', label: 'Cities',     value: trip.stops?.length || 0 },
            { icon: '📅', label: 'Days',        value: getDuration(trip.startDate, trip.endDate) },
            { icon: '💰', label: 'Est. Budget', value: formatCurrency(totalCost) },
          ].map(s => (
            <div key={s.label} className="card p-4 text-center">
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="font-display font-bold text-lg text-ink">{s.value}</div>
              <div className="text-xs text-ink-muted">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Itinerary */}
        <h2 className="font-display text-2xl font-bold text-ink mb-6">Day-by-Day Itinerary</h2>

        <div className="space-y-8">
          {trip.stops?.map((stop, idx) => (
            <div key={stop.id} className="card overflow-hidden">
              <div className="bg-gradient-to-r from-teal/10 to-transparent px-5 py-4 border-b border-warm-border flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-teal text-white flex items-center justify-center font-display font-bold flex-shrink-0">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-ink">{stop.emoji} {stop.city}, {stop.country}</h3>
                  {stop.arrivalDate && (
                    <p className="text-xs text-ink-muted">
                      {formatDate(stop.arrivalDate, 'MMM d')} → {formatDate(stop.departureDate, 'MMM d')}
                    </p>
                  )}
                </div>
              </div>
              <div className="p-5">
                {stop.activities?.length === 0 ? (
                  <p className="text-sm text-ink-muted italic">No activities listed.</p>
                ) : (
                  <div className="space-y-3">
                    {[...stop.activities].sort((a, b) => (a.time || '').localeCompare(b.time || '')).map(act => {
                      const { bg, text } = getActivityTypeColor(act.type)
                      return (
                        <div key={act.id} className="flex items-start gap-3">
                          {act.time && (
                            <span className="text-xs font-mono text-ink-muted mt-0.5 w-10 flex-shrink-0">{act.time}</span>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-sm text-ink">{act.name}</span>
                              <span className="badge text-xs" style={{ backgroundColor: bg, color: text }}>{act.type}</span>
                              <span className="text-xs font-medium text-ink-muted ml-auto">{formatCurrency(act.cost)}</span>
                            </div>
                            {act.notes && <p className="text-xs text-ink-muted mt-0.5 italic">{act.notes}</p>}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Social share */}
        <div className="mt-10 card p-5 text-center">
          <p className="font-medium text-ink mb-1">Share this itinerary</p>
          <p className="text-xs text-ink-muted mb-4">Let your friends know about this trip!</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent('Check out this trip on Traveloop: ' + window.location.href)}`, '_blank')}
              className="flex items-center gap-2 px-4 py-2 rounded-btn bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors"
            >
              💬 WhatsApp
            </button>
            <button
              onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('Planning ' + trip.name + ' with Traveloop! ' + window.location.href)}`, '_blank')}
              className="flex items-center gap-2 px-4 py-2 rounded-btn bg-ink text-white text-sm font-medium hover:bg-ink/80 transition-colors"
            >
              𝕏 Share
            </button>
            <button onClick={handleCopy} className="btn-secondary text-sm py-2">
              🔗 {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>

        {!user && (
          <div className="mt-6 card p-5 text-center bg-gradient-to-r from-terracotta/5 to-teal/5">
            <p className="font-medium text-ink mb-2">Want to plan your own trip?</p>
            <Link to="/login"><button className="btn-primary">Join Traveloop Free →</button></Link>
          </div>
        )}
      </div>
    </div>
  )
}
