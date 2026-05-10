import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getUser } from '../utils/storage'

/**
 * ProtectedRoute — wraps any route that requires authentication.
 * Redirects to /login and preserves the attempted URL as `?from=` query param.
 */
export default function ProtectedRoute({ children, adminOnly = false }) {
  const user  = getUser()
  const location = useLocation()

  if (!user) {
    return (
      <Navigate
        to={`/login?from=${encodeURIComponent(location.pathname)}`}
        replace
      />
    )
  }

  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
