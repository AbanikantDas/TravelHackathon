import React from 'react'

export default function LoadingSpinner({ text = 'Loading...', fullPage = false }) {
  const inner = (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-warm-border" />
        <div className="absolute inset-0 rounded-full border-4 border-terracotta border-t-transparent animate-spin" />
      </div>
      {text && <p className="text-sm text-ink-muted font-medium">{text}</p>}
    </div>
  )

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-warm-bg/80 backdrop-blur-sm flex items-center justify-center z-50">
        {inner}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-16">
      {inner}
    </div>
  )
}
