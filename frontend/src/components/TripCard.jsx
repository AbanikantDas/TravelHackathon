import React from 'react'
import { Link } from 'react-router-dom'
import { formatDate, getDuration, formatCurrency, getTripTotalCost } from '../utils/helpers'

export default function TripCard({ trip, onDelete }) {
  const duration = getDuration(trip.startDate, trip.endDate)
  const spent = getTripTotalCost(trip)
  const budget = Number(trip.budget) || 0
  const pct = budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0
  const overBudget = spent > budget && budget > 0

  const defaultCover = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80'

  return (
    <div className="card-hover group overflow-hidden flex flex-col">
      {/* Cover photo */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={trip.coverPhoto || defaultCover}
          alt={trip.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.src = defaultCover }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {/* Duration badge */}
        <div className="absolute top-3 right-3 glass text-xs font-medium px-2.5 py-1 rounded-full text-ink">
          {duration}d trip
        </div>
        {/* City count */}
        <div className="absolute bottom-3 left-3 text-white">
          <p className="text-xs opacity-80">{trip.stops?.length || 0} {trip.stops?.length === 1 ? 'city' : 'cities'}</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display font-bold text-lg text-ink leading-tight mb-1 line-clamp-1">
          {trip.name}
        </h3>
        <p className="text-xs text-ink-muted mb-3">
          {formatDate(trip.startDate, 'MMM d')} — {formatDate(trip.endDate, 'MMM d, yyyy')}
        </p>

        {/* City pills */}
        {trip.stops?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {trip.stops.slice(0, 3).map(s => (
              <span key={s.id} className="text-xs bg-warm-bg border border-warm-border rounded-full px-2 py-0.5 text-ink-muted">
                {s.emoji} {s.city}
              </span>
            ))}
            {trip.stops.length > 3 && (
              <span className="text-xs text-ink-light">+{trip.stops.length - 3}</span>
            )}
          </div>
        )}

        {/* Budget progress */}
        {budget > 0 && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-ink-muted">Budget</span>
              <span className={`text-xs font-medium ${overBudget ? 'text-red-500' : 'text-teal'}`}>
                {formatCurrency(spent)} / {formatCurrency(budget)}
              </span>
            </div>
            <div className="h-1.5 bg-warm-border rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${overBudget ? 'bg-red-400' : 'bg-terracotta'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto flex gap-2">
          <Link to={`/trips/${trip.id}/build`} className="flex-1">
            <button className="btn-primary w-full text-sm py-2">Edit</button>
          </Link>
          <Link to={`/trips/${trip.id}/itinerary`} className="flex-1">
            <button className="btn-secondary w-full text-sm py-2">View</button>
          </Link>
          {onDelete && (
            <button
              onClick={() => onDelete(trip.id)}
              className="p-2 rounded-btn text-ink-light hover:text-red-500 hover:bg-red-50 transition-all duration-200"
              title="Delete trip"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
