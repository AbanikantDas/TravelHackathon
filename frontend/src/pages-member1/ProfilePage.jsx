import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useToast, ToastContainer } from '../components/Toast'
import { getUser, saveUser } from '../utils/storage'
import { CITIES_DB } from '../utils/helpers'

export default function ProfilePage() {
  const [user, setUser] = useState(getUser() || {})
  const [form, setForm] = useState({})
  const [saved, setSaved] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const { toasts, toast } = useToast()

  useEffect(() => {
    const u = getUser() || {}
    setUser(u)
    setForm({
      name: u.name || '',
      email: u.email || '',
      photoUrl: u.photoUrl || '',
      language: u.language || 'English',
    })
  }, [])

  const set = f => e => setForm(prev => ({ ...prev, [f]: e.target.value }))

  const handleSave = (e) => {
    e.preventDefault()
    const updated = { ...user, ...form }
    saveUser(updated)
    setUser(updated)
    setSaved(true)
    toast.success('Profile updated!')
    setTimeout(() => setSaved(false), 2000)
  }

  const handleDelete = () => {
    localStorage.clear()
    window.location.href = '/login'
  }

  const avatarLetter = (form.name || 'U')[0].toUpperCase()

  return (
    <div className="page-wrapper">
      <Navbar />
      <ToastContainer toasts={toasts} />

      {/* Delete confirm modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-card shadow-float p-8 max-w-sm w-full text-center animate-fade-in-up">
            <p className="text-4xl mb-4">⚠️</p>
            <h3 className="font-display text-xl font-bold text-ink mb-2">Delete Account?</h3>
            <p className="text-sm text-ink-muted mb-6">This will permanently delete all your trips, notes, and data. This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={handleDelete} className="flex-1 py-2 rounded-btn bg-red-500 text-white font-medium hover:bg-red-600 transition-colors">
                Yes, Delete
              </button>
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 btn-secondary py-2">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <h1 className="font-display text-3xl font-bold text-ink mb-8">Profile & Settings</h1>

        <div className="card p-6 mb-6">
          {/* Avatar */}
          <div className="flex items-center gap-5 mb-6">
            {form.photoUrl ? (
              <img src={form.photoUrl} alt="" className="w-20 h-20 rounded-full object-cover border-4 border-warm-border shadow" onError={e => { e.target.onerror = null; e.target.style.display = 'none' }} />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-terracotta to-teal flex items-center justify-center text-white font-display font-bold text-3xl shadow-lg">
                {avatarLetter}
              </div>
            )}
            <div>
              <h2 className="font-display text-xl font-bold text-ink">{user.name || 'Traveller'}</h2>
              <p className="text-ink-muted text-sm">{user.email}</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name</label>
                <input type="text" value={form.name} onChange={set('name')} className="input-field" placeholder="Your name" />
              </div>
              <div>
                <label className="label">Email</label>
                <input type="email" value={form.email} onChange={set('email')} className="input-field" placeholder="you@example.com" />
              </div>
            </div>

            <div>
              <label className="label">Profile Photo URL</label>
              <input type="url" value={form.photoUrl} onChange={set('photoUrl')} className="input-field" placeholder="https://..." />
            </div>

            <div>
              <label className="label">Language</label>
              <select value={form.language} onChange={set('language')} className="input-field">
                {['English', 'Hindi', 'Spanish', 'French', 'German', 'Japanese', 'Arabic'].map(l => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn-primary w-full py-3">
              {saved ? '✓ Saved!' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Quick links */}
        <div className="card p-5 mb-6">
          <h3 className="font-display font-bold text-lg text-ink mb-4">Quick Links</h3>
          <div className="space-y-2">
            {[
              { to: '/trips',     icon: '🗺️', label: 'My Trips' },
              { to: '/explore',   icon: '🔍', label: 'Explore Cities' },
              { to: '/trips/new', icon: '✈️', label: 'Plan New Trip' },
            ].map(({ to, icon, label }) => (
              <Link key={to} to={to} className="flex items-center gap-3 p-3 rounded-btn hover:bg-warm-bg transition-colors group">
                <span>{icon}</span>
                <span className="text-sm font-medium text-ink group-hover:text-terracotta transition-colors">{label}</span>
                <span className="ml-auto text-ink-light text-xs">→</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Danger zone */}
        <div className="card p-5 border-red-100">
          <h3 className="font-display font-bold text-lg text-red-600 mb-2">Danger Zone</h3>
          <p className="text-sm text-ink-muted mb-4">Permanently delete your account and all data.</p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 rounded-btn border border-red-300 text-red-500 text-sm font-medium hover:bg-red-50 transition-all"
          >
            🗑️ Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}
