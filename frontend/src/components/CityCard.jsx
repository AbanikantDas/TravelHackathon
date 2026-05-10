import React from 'react'

const COST_COLOR = { '$': 'text-teal bg-teal-light', '$$': 'text-gold-dark bg-gold-light', '$$$': 'text-terracotta bg-terracotta-light' }

export default function CityCard({ city, onAdd, added = false }) {
  return (
    <div className="card-hover group overflow-hidden">
      <div className="relative h-36 overflow-hidden">
        <img
          src={city.image}
          alt={city.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        {/* Cost badge */}
        <span className={`absolute top-2 right-2 badge text-xs font-bold ${COST_COLOR[city.costIndex] || COST_COLOR['$$']}`}>
          {city.costIndex}
        </span>
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-display font-bold text-base text-ink">{city.emoji} {city.name}</h3>
        </div>
        <p className="text-xs text-ink-muted mb-2">{city.country} · {city.region}</p>
        {/* Stars */}
        <div className="flex items-center gap-0.5 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={`text-xs ${i < city.popularity ? 'text-gold-dark' : 'text-ink-light'}`}>★</span>
          ))}
        </div>
        <button
          onClick={() => onAdd?.(city)}
          className={`w-full text-sm py-1.5 rounded-btn font-medium transition-all duration-200 ${
            added
              ? 'bg-teal/10 text-teal border border-teal/30 cursor-default'
              : 'btn-primary'
          }`}
          disabled={added}
        >
          {added ? '✓ Added' : '+ Add to Trip'}
        </button>
      </div>
    </div>
  )
}
