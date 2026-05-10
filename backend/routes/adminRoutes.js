const express  = require('express');
const db       = require('../config/db');
const auth     = require('../middleware/authMiddleware');
const isAdmin  = require('../middleware/adminMiddleware');
const router   = express.Router();

// GET /api/admin/stats
router.get('/stats', auth, isAdmin, async (req, res) => {
  try {
    const [users, trips, cities] = await Promise.all([
      db.query('SELECT COUNT(*) FROM users'),
      db.query('SELECT COUNT(*) FROM trips'),
      db.query('SELECT name, COUNT(s.id) AS count FROM cities c LEFT JOIN stops s ON s.city_id=c.id GROUP BY c.name ORDER BY count DESC LIMIT 5'),
    ]);
    res.json({
      totalUsers:  parseInt(users.rows[0].count),
      totalTrips:  parseInt(trips.rows[0].count),
      topCities:   cities.rows,
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/admin/users
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT u.id, u.name, u.email, u.created_at, COUNT(t.id) AS trip_count FROM users u LEFT JOIN trips t ON t.user_id=u.id GROUP BY u.id ORDER BY u.created_at DESC'
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', auth, isAdmin, async (req, res) => {
  try {
    await db.query('DELETE FROM users WHERE id=$1', [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
