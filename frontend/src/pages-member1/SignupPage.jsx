import React from 'react'
import LoginPage from './LoginPage'

/**
 * SignupPage — Screen 1b (Member 1)
 * Reuses the LoginPage component which already supports
 * login / signup / forgot-password modes in a single form.
 * Renders directly in signup mode.
 */
export default function SignupPage() {
  return <LoginPage defaultMode="signup" />
}
