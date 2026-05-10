import React, { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { getUser, clearUser } from '../utils/storage'

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/trips',     label: 'My Trips',  icon: '🗺️' },
  { to: '/explore',   label: 'Explore',   icon: '🔍' },
  { to: '/profile',   label: 'Profile',   icon: '👤' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const user = getUser()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [location.pathname])

  const handleLogout = () => {
    clearUser()
    navigate('/login')
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 shadow-card backdrop-blur-md' : 'bg-white border-b border-warm-border'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-terracotta to-teal flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <span className="text-white font-display font-bold text-lg">T</span>
            </div>
            <span className="font-display font-bold text-xl text-ink hidden sm:block">
              Travel<span className="text-terracotta">oop</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-btn text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-terracotta/10 text-terracotta'
                      : 'text-ink-muted hover:text-ink hover:bg-warm-border'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/trips/new">
              <button className="btn-primary text-sm px-4 py-2">
                + New Trip
              </button>
            </Link>
            {user && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-terracotta to-gold flex items-center justify-center text-white text-sm font-bold">
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs text-ink-muted hover:text-terracotta transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="md:hidden p-2 rounded-btn hover:bg-warm-border transition-colors"
            aria-label="Toggle menu"
          >
            <div className="w-5 flex flex-col gap-1">
              <span className={`block h-0.5 bg-ink rounded transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`block h-0.5 bg-ink rounded transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-ink rounded transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-warm-border shadow-lg animate-fade-in-up">
          <div className="px-4 py-3 space-y-1">
            {NAV_LINKS.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-btn text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-terracotta/10 text-terracotta'
                      : 'text-ink-muted hover:text-ink hover:bg-warm-bg'
                  }`
                }
              >
                <span>{icon}</span>
                {label}
              </NavLink>
            ))}
            <div className="pt-2 border-t border-warm-border mt-2">
              <Link to="/trips/new" className="block">
                <button className="btn-primary w-full text-sm">+ New Trip</button>
              </Link>
              {user && (
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-ink-muted hover:text-terracotta mt-2">
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
