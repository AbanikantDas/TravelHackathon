import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveUser } from '../utils/storage'
import { useToast, ToastContainer } from '../components/Toast'

const BG = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=80'

function InputField({ label, type = 'text', value, onChange, placeholder, error }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`input-field ${error ? 'border-red-400 focus:ring-red-200' : ''}`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

export default function LoginPage({ defaultMode = 'login' }) {
  const [mode, setMode] = useState(defaultMode) // 'login' | 'signup' | 'forgot'
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { toasts, toast } = useToast()

  const set = (field) => (val) => setForm(f => ({ ...f, [field]: val }))

  const validate = () => {
    const e = {}
    if (mode === 'signup' && !form.name.trim()) e.name = 'Name is required'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required'
    if (mode !== 'forgot') {
      if (form.password.length < 6) e.password = 'Password must be at least 6 characters'
      if (mode === 'signup' && form.password !== form.confirm) e.confirm = 'Passwords do not match'
    }
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      if (mode === 'forgot') {
        toast.success('Reset link sent! Check your inbox.')
        setMode('login')
        return
      }
      const user = {
        id: 'user_' + Date.now(),
        name: mode === 'signup' ? form.name : form.email.split('@')[0],
        email: form.email,
      }
      saveUser(user)
      toast.success(mode === 'login' ? 'Welcome back!' : 'Account created!')
      setTimeout(() => navigate('/dashboard'), 800)
    }, 900)
  }

  const titles = { login: 'Welcome back', signup: 'Start your journey', forgot: 'Reset password' }
  const subtitles = {
    login: 'Sign in to plan your next adventure',
    signup: 'Create a free Traveloop account',
    forgot: 'We\'ll send a reset link to your email',
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <ToastContainer toasts={toasts} />

      {/* Background */}
      <div className="absolute inset-0">
        <img src={BG} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-teal/80 via-ink/60 to-terracotta/50" />
      </div>

      {/* Glass card */}
      <div className="relative w-full max-w-md glass rounded-2xl shadow-float p-8 animate-fade-in-up">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-terracotta to-teal flex items-center justify-center shadow-md">
            <span className="text-white font-display font-bold text-xl">T</span>
          </div>
          <span className="font-display font-bold text-2xl text-ink">
            Travel<span className="text-terracotta">oop</span>
          </span>
        </div>

        <h1 className="font-display text-3xl font-bold text-ink mb-1">{titles[mode]}</h1>
        <p className="text-sm text-ink-muted mb-7">{subtitles[mode]}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <InputField label="Full Name" value={form.name} onChange={set('name')} placeholder="Abanikant Das" error={errors.name} />
          )}
          <InputField label="Email" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" error={errors.email} />
          {mode !== 'forgot' && (
            <InputField label="Password" type="password" value={form.password} onChange={set('password')} placeholder="••••••••" error={errors.password} />
          )}
          {mode === 'signup' && (
            <InputField label="Confirm Password" type="password" value={form.confirm} onChange={set('confirm')} placeholder="••••••••" error={errors.confirm} />
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              mode === 'login' ? 'Sign In →' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'
            )}
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 text-center text-sm space-y-2">
          {mode === 'login' && (
            <>
              <button onClick={() => setMode('forgot')} className="text-terracotta hover:underline">Forgot password?</button>
              <p className="text-ink-muted">
                Don't have an account?{' '}
                <button onClick={() => setMode('signup')} className="text-teal font-medium hover:underline">Sign up</button>
              </p>
            </>
          )}
          {mode === 'signup' && (
            <p className="text-ink-muted">
              Already a member?{' '}
              <button onClick={() => setMode('login')} className="text-teal font-medium hover:underline">Sign in</button>
            </p>
          )}
          {mode === 'forgot' && (
            <button onClick={() => setMode('login')} className="text-teal hover:underline">← Back to login</button>
          )}
        </div>

        {/* Demo hint */}
        <p className="mt-5 text-center text-xs text-ink-light bg-warm-bg/60 rounded-lg py-2 px-3">
          🎯 Demo: enter any email + password to explore
        </p>
      </div>
    </div>
  )
}
