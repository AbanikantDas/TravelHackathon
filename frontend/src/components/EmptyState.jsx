import React from 'react'

export default function EmptyState({ icon = '✈️', title = 'Nothing here yet', description = '', action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-fade-in-up">
      <div className="w-20 h-20 rounded-full bg-warm-border flex items-center justify-center text-4xl mb-5 shadow-inner">
        {icon}
      </div>
      <h3 className="font-display text-xl font-bold text-ink mb-2">{title}</h3>
      {description && <p className="text-sm text-ink-muted max-w-xs leading-relaxed mb-6">{description}</p>}
      {action && (
        <button onClick={action.onClick} className="btn-primary">
          {action.label}
        </button>
      )}
    </div>
  )
}
