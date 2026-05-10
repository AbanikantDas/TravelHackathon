import React from 'react'
import { formatCurrency, getActivityTypeColor } from '../utils/helpers'

export default function ActivityCard({ activity, onAdd, onRemove, added = false, compact = false }) {
  const { bg, text } = getActivityTypeColor(activity.type)

  return (
    <div className={`card p-3 flex items-start gap-3 transition-all duration-200 ${added ? 'border-teal/40 bg-teal-light/20' : ''}`}>
      {/* Type color band */}
      <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ backgroundColor: text }} />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-ink text-sm leading-tight">{activity.name}</h4>
          <span
            className="badge flex-shrink-0 text-xs"
            style={{ backgroundColor: bg, color: text }}
          >
            {activity.type}
          </span>
        </div>

        <div className="flex items-center gap-3 mt-1.5 text-xs text-ink-muted">
          {activity.duration && <span>⏱ {activity.duration}</span>}
          {activity.time && <span>🕐 {activity.time}</span>}
          <span className="font-medium text-ink">{formatCurrency(activity.cost)}</span>
        </div>

        {!compact && activity.notes && (
          <p className="mt-1 text-xs text-ink-light italic">{activity.notes}</p>
        )}
      </div>

      {(onAdd || onRemove) && (
        <div className="flex-shrink-0">
          {added && onRemove ? (
            <button
              onClick={() => onRemove(activity.id)}
              className="w-7 h-7 rounded-full bg-teal text-white text-xs flex items-center justify-center hover:bg-red-400 transition-colors"
              title="Remove"
            >
              ✓
            </button>
          ) : (
            <button
              onClick={() => onAdd?.(activity)}
              className="w-7 h-7 rounded-full bg-terracotta text-white text-xs flex items-center justify-center hover:bg-terracotta-dark transition-colors"
              title="Add"
            >
              +
            </button>
          )}
        </div>
      )}
    </div>
  )
}
