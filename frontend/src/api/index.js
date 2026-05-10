// ==========================================
// FILE: frontend/src/api/index.js
// Centralized Axios API service layer
// All backend calls go through here
// ==========================================

import axios from 'axios'

const BASE_URL = 'https://travelhackathon.onrender.com/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('traveloop_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally — clear token and redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('traveloop_token')
      localStorage.removeItem('traveloop_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ── Auth ─────────────────────────────────────────────────────
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
}

// ── Trips ────────────────────────────────────────────────────
export const tripsAPI = {
  getAll: () => api.get('/trips'),
  getById: (id) => api.get(`/trips/${id}`),
  create: (data) => api.post('/trips', data),
  update: (id, data) => api.put(`/trips/${id}`, data),
  delete: (id) => api.delete(`/trips/${id}`),
}

// ── Stops ────────────────────────────────────────────────────
export const stopsAPI = {
  add: (tripId, data) => api.post(`/trips/${tripId}/stops`, data),
  update: (tripId, stopId, data) => api.put(`/trips/${tripId}/stops/${stopId}`, data),
  delete: (tripId, stopId) => api.delete(`/trips/${tripId}/stops/${stopId}`),
}

// ── Cities ───────────────────────────────────────────────────
export const citiesAPI = {
  getAll: (params) => api.get('/cities', { params }),
  search: (q) => api.get('/cities', { params: { q } }),
}

// ── Activities ───────────────────────────────────────────────
export const activitiesAPI = {
  getByCity: (cityId) => api.get(`/activities`, { params: { cityId } }),
  search: (q) => api.get(`/activities`, { params: { q } }),
}

// ── Budget ───────────────────────────────────────────────────
export const budgetAPI = {
  get: (tripId) => api.get(`/trips/${tripId}/budget`),
  update: (tripId, data) => api.put(`/trips/${tripId}/budget`, data),
}

// ── Packing ──────────────────────────────────────────────────
export const packingAPI = {
  getAll: (tripId) => api.get(`/trips/${tripId}/packing`),
  add: (tripId, data) => api.post(`/trips/${tripId}/packing`, data),
  update: (tripId, id, data) => api.put(`/trips/${tripId}/packing/${id}`, data),
  delete: (tripId, id) => api.delete(`/trips/${tripId}/packing/${id}`),
}

// ── Notes ────────────────────────────────────────────────────
export const notesAPI = {
  getAll: (tripId) => api.get(`/trips/${tripId}/notes`),
  add: (tripId, data) => api.post(`/trips/${tripId}/notes`, data),
  update: (tripId, id, data) => api.put(`/trips/${tripId}/notes/${id}`, data),
  delete: (tripId, id) => api.delete(`/trips/${tripId}/notes/${id}`),
}

// ── Admin ────────────────────────────────────────────────────
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
}

export default api
