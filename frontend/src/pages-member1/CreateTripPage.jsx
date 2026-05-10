import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useToast, ToastContainer } from '../components/Toast'
import { createTrip } from '../utils/storage'

const COVER_PRESETS = [
  'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80',
  'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
  'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80',
  'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&q=80',
]

function Field({ label, required, error, children }) {
  return (
    <div>
      <label className="label">
        {label} {required && <span className="text-terracotta">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

export default function CreateTripPage() {
  const navigate = useNavigate()
  const { toasts, toast } = useToast()
  const [form, setForm] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    coverPhoto: '',
    budget: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState(null)

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target?.value ?? e }))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Trip name is required'
    if (!form.startDate) e.startDate = 'Start date is required'
    if (!form.endDate) e.endDate = 'End date is required'
    if (form.startDate && form.endDate && form.startDate > form.endDate) e.endDate = 'End must be after start'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)

    setTimeout(() => {
      const trip = createTrip({
        ...form,
        budget: form.budget ? Number(form.budget) : 0,
        coverPhoto: form.coverPhoto || selectedPreset || '',
      })
      toast.success('Trip created!')
      setTimeout(() => navigate(`/trips/${trip.id}/build`), 600)
    }, 700)
  }

  const previewImg = form.coverPhoto || selectedPreset || COVER_PRESETS[0]

  return (
    <div className="page-wrapper">
      <Navbar />
      <ToastContainer toasts={toasts} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-ink">Plan New Trip</h1>
          <p className="text-ink-muted mt-1">Fill in the details to start building your itinerary.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Field label="Trip Name" required error={errors.name}>
              <input
                type="text"
                value={form.name}
                onChange={set('name')}
                placeholder="e.g. Europe Grand Tour"
                className="input-field"
              />
            </Field>

            <Field label="Description" error={errors.description}>
              <textarea
                value={form.description}
                onChange={set('description')}
                placeholder="A short description of your trip..."
                rows={3}
                className="input-field resize-none"
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Start Date" required error={errors.startDate}>
                <input type="date" value={form.startDate} onChange={set('startDate')} className="input-field" />
              </Field>
              <Field label="End Date" required error={errors.endDate}>
                <input type="date" value={form.endDate} onChange={set('endDate')} className="input-field" />
              </Field>
            </div>

            <Field label="Budget (₹)" error={errors.budget}>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted font-medium">₹</span>
                <input
                  type="number"
                  value={form.budget}
                  onChange={set('budget')}
                  placeholder="100000"
                  min="0"
                  className="input-field pl-8"
                />
              </div>
            </Field>

            <Field label="Cover Photo URL (optional)">
              <input
                type="url"
                value={form.coverPhoto}
                onChange={set('coverPhoto')}
                placeholder="https://images.unsplash.com/..."
                className="input-field"
              />
              {/* Presets */}
              <div className="mt-2">
                <p className="text-xs text-ink-muted mb-2">Or pick a preset:</p>
                <div className="grid grid-cols-6 gap-2">
                  {COVER_PRESETS.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => { setSelectedPreset(img); set('coverPhoto')({ target: { value: '' } }) }}
                      className={`h-10 rounded-btn overflow-hidden border-2 transition-all ${selectedPreset === img && !form.coverPhoto ? 'border-terracotta scale-105' : 'border-transparent hover:border-warm-border'}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </Field>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading} className="btn-primary flex-1 py-3 flex items-center justify-center gap-2">
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                {loading ? 'Creating...' : 'Save & Build Itinerary →'}
              </button>
              <button type="button" onClick={() => navigate('/trips')} className="btn-secondary px-5">Cancel</button>
            </div>
          </form>

          {/* Preview */}
          <div className="relative">
            <div className="sticky top-24">
              <p className="label mb-2">Preview</p>
              <div className="card overflow-hidden">
                <div className="relative h-56">
                  <img
                    src={previewImg}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                    onError={e => { e.target.src = COVER_PRESETS[0] }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 p-4">
                    <h3 className="font-display text-xl font-bold text-white">
                      {form.name || 'Your Trip Name'}
                    </h3>
                    {form.startDate && (
                      <p className="text-white/70 text-sm">{form.startDate} → {form.endDate || '...'}</p>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-ink-muted">{form.description || 'Add a description above...'}</p>
                  {form.budget && (
                    <div className="mt-3 inline-flex items-center gap-1.5 bg-gold-light px-3 py-1 rounded-full text-xs font-medium text-gold-dark">
                      💰 Budget: ₹{Number(form.budget).toLocaleString('en-IN')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
