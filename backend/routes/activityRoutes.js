const express = require('express');
const db      = require('../config/db');
const router  = express.Router();

// GET /api/activities?cityId=1&q=temple
router.get('/', async (req, res) => {
  const { cityId, q } = req.query;
  let query  = 'SELECT * FROM activities WHERE 1=1';
  const vals = [];
  if (cityId) { vals.push(cityId); query += ` AND city_id = $${vals.length}`; }
  if (q)      { vals.push(`%${q}%`); query += ` AND name ILIKE $${vals.length}`; }
  query += ' ORDER BY name';
  try {
    const { rows } = await db.query(query, vals);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
