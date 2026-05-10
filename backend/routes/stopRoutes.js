const express = require('express');
const db      = require('../config/db');
const auth    = require('../middleware/authMiddleware');
const router  = express.Router({ mergeParams: true });

// POST /api/trips/:tripId/stops
router.post('/', auth, async (req, res) => {
  const { city_id, arrival_date, departure_date, order_index } = req.body;
  try {
    const { rows } = await db.query(
      'INSERT INTO stops (trip_id,city_id,arrival_date,departure_date,order_index) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [req.params.tripId, city_id, arrival_date, departure_date, order_index || 0]
    );
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/trips/:tripId/stops/:stopId
router.put('/:stopId', auth, async (req, res) => {
  const { arrival_date, departure_date, order_index } = req.body;
  try {
    const { rows } = await db.query(
      'UPDATE stops SET arrival_date=$1,departure_date=$2,order_index=$3 WHERE id=$4 AND trip_id=$5 RETURNING *',
      [arrival_date, departure_date, order_index, req.params.stopId, req.params.tripId]
    );
    if (!rows.length) return res.status(404).json({ error: 'Stop not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/trips/:tripId/stops/:stopId
router.delete('/:stopId', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM stops WHERE id=$1 AND trip_id=$2', [req.params.stopId, req.params.tripId]);
    res.json({ message: 'Stop deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
