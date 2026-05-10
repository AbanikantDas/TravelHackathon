require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 5000

// ── Middleware ───────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())

// ── Routes ───────────────────────────────────────────────────
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/trips', require('./routes/tripRoutes'))
app.use('/api/cities', require('./routes/cityRoutes'))
app.use('/api/activities', require('./routes/activityRoutes'))
app.use('/api/admin', require('./routes/adminRoutes'))

// Nested trip sub-routes  (mergeParams used inside each router)
app.use('/api/trips/:tripId/stops', require('./routes/stopRoutes'))
app.use('/api/trips/:tripId/budget', require('./routes/budgetRoutes'))
app.use('/api/trips/:tripId/packing', require('./routes/packingRoutes'))
app.use('/api/trips/:tripId/notes', require('./routes/noteRoutes'))

// ── Health check ─────────────────────────────────────────────
app.get('/', (req, res) => res.json({ status: 'ok', app: 'Traveloop API' }))

// ── Global error handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`🌍 Traveloop backend running on http://localhost:${PORT}`)
})






