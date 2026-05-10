import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { getTrips, getUser } from '../utils/storage'
import { formatDate } from '../utils/helpers'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'

function StatCard({ icon, label, value, sub }) {
  return (
    <div className="card p-5 text-center">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="font-display text-2xl font-bold text-ink">{value}</div>
      <div className="text-sm text-ink-muted mt-0.5">{label}</div>
      {sub && <div className="text-xs text-terracotta mt-1">{sub}</div>}
    </div>
  )
}

export default function AdminDashboard() {
  const [trips, setTrips]     = useState([])
  const [loading, setLoading] = useState(true)
  const user = getUser()

  useEffect(() => {
    // In production this would call adminAPI.getStats()
    // For now, derive stats from localStorage
    setTrips(getTrips())
    setLoading(false)
  }, [])

  if (!user?.isAdmin) {
    return (
      <div className="page-wrapper">
        <Navbar />
        <div className="pt-24 text-center">
          <p className="text-5xl mb-4">🚫</p>
          <h2 className="font-display text-2xl font-bold text-ink mb-2">Access Denied</h2>
          <p className="text-ink-muted">This page is for admins only.</p>
        </div>
      </div>
    )
  }

  const totalCities     = trips.reduce((s, t) => s + (t.stops?.length || 0), 0)
  const totalActivities = trips.reduce((s, t) =>
    s + (t.stops || []).reduce((ss, st) => ss + (st.activities?.length || 0), 0), 0)

  // Trips created per week (last 4 weeks)
  const weeklyData = (() => {
    const weeks = [0, 0, 0, 0]
    const now = Date.now()
    trips.forEach(t => {
      const diff = Math.floor((now - new Date(t.createdAt)) / (7 * 86400000))
      if (diff < 4) weeks[diff]++
    })
    return [
      { name: 'This week',  value: weeks[0] },
      { name: '1 week ago', value: weeks[1] },
      { name: '2 weeks ago',value: weeks[2] },
      { name: '3 weeks ago',value: weeks[3] },
    ]
  })()

  // Top cities by stop count
  const cityCount = {}
  trips.forEach(t => (t.stops || []).forEach(s => {
    cityCount[s.city] = (cityCount[s.city] || 0) + 1
  }))
  const topCities = Object.entries(cityCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return (
    <div className="page-wrapper">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-terracotta/10 text-terracotta text-xs font-medium px-3 py-1 rounded-full mb-3">
            🔒 Admin Only
          </div>
          <h1 className="font-display text-3xl font-bold text-ink">Analytics Dashboard</h1>
          <p className="text-ink-muted mt-1">System-wide statistics for Traveloop</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard icon="🗺️" label="Total Trips"      value={trips.length} />
          <StatCard icon="🏙️" label="Total Stops"      value={totalCities} />
          <StatCard icon="🎯" label="Total Activities"  value={totalActivities} />
          <StatCard icon="📅" label="Avg Trip Duration" value={
            trips.length
              ? Math.round(trips.reduce((s, t) => {
                  const d = (new Date(t.endDate) - new Date(t.startDate)) / 86400000
                  return s + (isNaN(d) ? 0 : d)
                }, 0) / trips.length) + 'd'
              : '—'
          } />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Weekly chart */}
          <div className="card p-5">
            <h2 className="font-display font-bold text-lg text-ink mb-4">Trips Created per Week</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EDE8E0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" name="Trips" fill="#C4703A" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top cities */}
          <div className="card p-5">
            <h2 className="font-display font-bold text-lg text-ink mb-4">Top 5 Destinations</h2>
            {topCities.length === 0 ? (
              <p className="text-sm text-ink-muted py-8 text-center">No data yet.</p>
            ) : (
              <div className="space-y-3">
                {topCities.map(([city, count], i) => (
                  <div key={city} className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-teal/10 text-teal text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="flex-1 text-sm font-medium text-ink">{city}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 bg-terracotta rounded-full" style={{ width: `${count * 20}px`, minWidth: '8px' }} />
                      <span className="text-xs text-ink-muted">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* All trips table */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-warm-border">
            <h2 className="font-display font-bold text-lg text-ink">All Trips</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-warm-bg text-ink-muted text-xs uppercase">
                <tr>
                  <th className="px-5 py-3 text-left">Trip Name</th>
                  <th className="px-5 py-3 text-left">Cities</th>
                  <th className="px-5 py-3 text-left">Date Range</th>
                  <th className="px-5 py-3 text-left">Activities</th>
                  <th className="px-5 py-3 text-left">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-border">
                {trips.map(t => (
                  <tr key={t.id} className="hover:bg-warm-bg/50 transition-colors">
                    <td className="px-5 py-3 font-medium text-ink">{t.name}</td>
                    <td className="px-5 py-3 text-ink-muted">{t.stops?.length || 0}</td>
                    <td className="px-5 py-3 text-ink-muted">
                      {t.startDate ? formatDate(t.startDate, 'MMM d') : '—'} →{' '}
                      {t.endDate   ? formatDate(t.endDate,   'MMM d') : '—'}
                    </td>
                    <td className="px-5 py-3 text-ink-muted">
                      {(t.stops || []).reduce((s, st) => s + (st.activities?.length || 0), 0)}
                    </td>
                    <td className="px-5 py-3 text-ink-muted">
                      {t.createdAt ? formatDate(t.createdAt, 'MMM d, yyyy') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {trips.length === 0 && (
              <p className="text-center text-sm text-ink-muted py-8">No trips found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
