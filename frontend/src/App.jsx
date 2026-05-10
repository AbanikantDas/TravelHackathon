import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { seedDemoData, getUser } from './utils/storage'
import { AuthProvider } from './context/AuthContext'

// ── Member 1 Pages ──────────────────────────────────────────
import LoginPage       from './pages-member1/LoginPage'
import SignupPage      from './pages-member1/SignupPage'
import DashboardPage   from './pages-member1/DashboardPage'
import MyTripsPage     from './pages-member1/MyTripsPage'
import CreateTripPage  from './pages-member1/CreateTripPage'
import PackingPage     from './pages-member1/PackingPage'
import ProfilePage     from './pages-member1/ProfilePage'
import NotFoundPage    from './pages-member1/NotFoundPage'

// ── Member 2 Pages ──────────────────────────────────────────
import ItineraryBuilderPage from './pages-member2/ItineraryBuilderPage'
import ItineraryViewPage    from './pages-member2/ItineraryViewPage'
import BudgetPage           from './pages-member2/BudgetPage'
import SharedItineraryPage  from './pages-member2/SharedItineraryPage'
import TripNotesPage        from './pages-member2/TripNotesPage'
import CitySearchPage       from './pages-member2/CitySearchPage'
import AdminDashboard       from './pages-member2/AdminDashboard'

// ── Shared Components ────────────────────────────────────────
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  useEffect(() => {
    seedDemoData()
  }, [])

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login"          element={<LoginPage />} />
          <Route path="/signup"         element={<SignupPage />} />
          <Route path="/shared/:tripId" element={<SharedItineraryPage />} />
          <Route path="/"               element={<Navigate to="/dashboard" replace />} />

          {/* Protected — Member 1 */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/trips"     element={<ProtectedRoute><MyTripsPage /></ProtectedRoute>} />
          <Route path="/trips/new" element={<ProtectedRoute><CreateTripPage /></ProtectedRoute>} />
          <Route path="/profile"   element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/trips/:tripId/packing" element={<ProtectedRoute><PackingPage /></ProtectedRoute>} />

          {/* Protected — Member 2 */}
          <Route path="/explore"   element={<ProtectedRoute><CitySearchPage /></ProtectedRoute>} />
          <Route path="/admin"     element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="/trips/:tripId/build"     element={<ProtectedRoute><ItineraryBuilderPage /></ProtectedRoute>} />
          <Route path="/trips/:tripId/itinerary" element={<ProtectedRoute><ItineraryViewPage /></ProtectedRoute>} />
          <Route path="/trips/:tripId/budget"    element={<ProtectedRoute><BudgetPage /></ProtectedRoute>} />
          <Route path="/trips/:tripId/notes"     element={<ProtectedRoute><TripNotesPage /></ProtectedRoute>} />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
