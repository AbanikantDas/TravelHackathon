import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-warm-bg flex flex-col items-center justify-center px-4 text-center">
      <div className="animate-fade-in-up">
        <div className="text-8xl mb-6">🗺️</div>
        <h1 className="font-display text-6xl font-bold text-ink mb-2">404</h1>
        <h2 className="font-display text-2xl font-bold text-terracotta mb-4">You seem lost!</h2>
        <p className="text-ink-muted max-w-sm mx-auto mb-8 leading-relaxed">
          The page you're looking for doesn't exist. Maybe it's time to plan a new adventure instead?
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link to="/dashboard">
            <button className="btn-primary px-8 py-3">Get Back on Track</button>
          </Link>
          <Link to="/trips/new">
            <button className="btn-secondary px-8 py-3">Plan a Trip</button>
          </Link>
        </div>
      </div>
      <p className="mt-16 text-xs text-ink-light">Traveloop · Plan. Explore. Remember.</p>
    </div>
  )
}
