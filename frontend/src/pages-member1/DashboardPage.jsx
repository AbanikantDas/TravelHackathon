import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import TripCard from '../components/TripCard'
import { getUser, getTrips } from '../utils/storage'
import { CITIES_DB, formatCurrency, getTripTotalCost } from '../utils/helpers'

const HERO_IMGS = [
  'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1200&q=80',
  'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80',
  'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&q=80',
]

const QUICK_STATS = [
  { icon: '✈️', label: 'Cities Explored' },
  { icon: '🗺️', label: 'Trips Planned' },
  { icon: '💰', label: 'Total Budget' },
]

export default function DashboardPage() {
  const user = getUser()
  const navigate = useNavigate()
  const [trips, setTrips] = useState([])
  const [heroIdx, setHeroIdx] = useState(0)
  const [imgLoaded, setImgLoaded] = useState(false)

  useEffect(() => {
    setTrips(getTrips())
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIdx(i => (i + 1) % HERO_IMGS.length)
      setImgLoaded(false)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const recentTrips = [...trips].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4)
  const totalCities = trips.reduce((s, t) => s + (t.stops?.length || 0), 0)
  const totalBudget = trips.reduce((s, t) => s + (Number(t.budget) || 0), 0)
  const topCities = [...CITIES_DB].sort((a, b) => b.popularity - a.popularity).slice(0, 6)
  const upcomingTrips = trips.filter(t => new Date(t.startDate) > new Date())

  return (
    <div className="page-wrapper">
      <Navbar />

      {/* Hero section */}
      <section className="relative h-[500px] md:h-[580px] overflow-hidden">
        {HERO_IMGS.map((img, i) => (
          <img
            key={img}
            src={img}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === heroIdx ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => i === heroIdx && setImgLoaded(true)}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-teal/70 via-ink/50 to-warm-bg" />

        <div className="relative h-full flex flex-col items-center justify-center text-center px-4 pt-16">
          <p className="text-gold text-sm font-medium tracking-widest uppercase mb-3 animate-fade-in-up">Your travel story starts here</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white leading-tight mb-4 animate-fade-in-up">
            Hello, {user?.name?.split(' ')[0] || 'Traveller'} 👋
          </h1>
          <p className="text-white/80 text-lg mb-8 max-w-md animate-fade-in-up">
            {trips.length === 0 ? 'Plan your first dream trip today.' : `You have ${trips.length} ${trips.length === 1 ? 'trip' : 'trips'} planned. Where to next?`}
          </p>
          <div className="flex flex-wrap gap-3 justify-center animate-fade-in-up">
            <Link to="/trips/new">
              <button className="btn-primary px-8 py-3 text-base">
                + Plan New Trip
              </button>
            </Link>
            <Link to="/explore">
              <button className="btn-secondary px-8 py-3 text-base bg-white/20 text-white border-white/30 hover:bg-white/30">
                Explore Cities
              </button>
            </Link>
          </div>
        </div>

        {/* Hero dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {HERO_IMGS.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIdx(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === heroIdx ? 'w-6 bg-gold' : 'w-1.5 bg-white/50'}`}
            />
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4 mb-12 -mt-16 relative z-10">
          {[
            { icon: '🏙️', label: 'Cities Explored', value: totalCities },
            { icon: '🗺️', label: 'Trips Planned',   value: trips.length },
            { icon: '💰', label: 'Total Budget',     value: formatCurrency(totalBudget) },
          ].map(stat => (
            <div key={stat.label} className="glass rounded-card p-4 md:p-6 text-center shadow-float">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="font-display font-bold text-xl md:text-2xl text-ink">{stat.value}</div>
              <div className="text-xs text-ink-muted mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Upcoming trips alert */}
        {upcomingTrips.length > 0 && (
          <div className="bg-gradient-to-r from-terracotta/10 to-gold/10 border border-terracotta/20 rounded-card p-4 mb-8 flex items-center gap-4">
            <span className="text-2xl">🎒</span>
            <div className="flex-1">
              <p className="font-medium text-ink">
                <strong>{upcomingTrips[0].name}</strong> is coming up!
              </p>
              <p className="text-sm text-ink-muted">Don't forget to pack and review your itinerary.</p>
            </div>
            <Link to={`/trips/${upcomingTrips[0].id}/packing`}>
              <button className="btn-primary text-sm px-4 py-2">Packing List</button>
            </Link>
          </div>
        )}

        {/* Recent trips */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">Recent Trips</h2>
            <Link to="/trips" className="text-sm text-terracotta hover:underline font-medium">View all →</Link>
          </div>

          {recentTrips.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-5xl mb-4">🌍</p>
              <p className="font-display text-xl font-bold text-ink mb-2">No trips yet</p>
              <p className="text-ink-muted mb-6">Start by planning your first adventure!</p>
              <Link to="/trips/new"><button className="btn-primary">Plan a Trip</button></Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {recentTrips.map(trip => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          )}
        </section>

        {/* Recommended destinations */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">Explore Destinations</h2>
            <Link to="/explore" className="text-sm text-terracotta hover:underline font-medium">View all →</Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {topCities.map(city => (
              <Link key={city.id} to="/explore" className="group card-hover overflow-hidden rounded-card block">
                <div className="relative h-28 overflow-hidden">
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <p className="text-white font-display font-bold text-sm leading-tight">{city.emoji} {city.name}</p>
                    <p className="text-white/70 text-xs">{city.country}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
