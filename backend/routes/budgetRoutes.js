const express = require('express');
const db      = require('../config/db');
const auth    = require('../middleware/authMiddleware');
const router  = express.Router({ mergeParams: true });

// GET /api/trips/:tripId/budget
router.get('/', auth, async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM budgets WHERE trip_id=$1', [req.params.tripId]);
    res.json(rows[0] || {});
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/trips/:tripId/budget
router.put('/', auth, async (req, res) => {
  const { transport_cost, stay_cost, activity_cost, meal_cost, total_budget } = req.body;
  try {
    const existing = await db.query('SELECT id FROM budgets WHERE trip_id=$1', [req.params.tripId]);
    let row;
    if (existing.rows.length) {
      const { rows } = await db.query(
        'UPDATE budgets SET transport_cost=$1,stay_cost=$2,activity_cost=$3,meal_cost=$4,total_budget=$5 WHERE trip_id=$6 RETURNING *',
        [transport_cost, stay_cost, activity_cost, meal_cost, total_budget, req.params.tripId]
      );
      row = rows[0];
    } else {
      const { rows } = await db.query(
        'INSERT INTO budgets (trip_id,transport_cost,stay_cost,activity_cost,meal_cost,total_budget) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
        [req.params.tripId, transport_cost, stay_cost, activity_cost, meal_cost, total_budget]
      );
      row = rows[0];
    }
    res.json(row);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
