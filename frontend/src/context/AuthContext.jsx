import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getUser, saveUser, clearUser } from '../utils/storage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = getUser()
    if (stored) setUser(stored)
    setLoading(false)
  }, [])

  const login = useCallback((userData, token) => {
    if (token) localStorage.setItem('traveloop_token', token)
    saveUser(userData)
    setUser(userData)
  }, [])

  const logout = useCallback(() => {
    clearUser()
    localStorage.removeItem('traveloop_token')
    setUser(null)
  }, [])

  const updateUser = useCallback((updates) => {
    const updated = { ...user, ...updates }
    saveUser(updated)
    setUser(updated)
  }, [user])

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
  }

  if (loading) return null   // Avoid flash of unauthenticated content

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook — use this in every component that needs auth state
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}

export default AuthContext
