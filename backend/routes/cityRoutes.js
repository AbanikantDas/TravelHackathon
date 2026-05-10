const express = require('express');
const db      = require('../config/db');
const router  = express.Router();

// GET /api/cities?q=paris&region=Europe
router.get('/', async (req, res) => {
  const { q, region } = req.query;
  let query  = 'SELECT * FROM cities WHERE 1=1';
  const vals = [];
  if (q)      { vals.push(`%${q}%`);      query += ` AND (name ILIKE $${vals.length} OR country ILIKE $${vals.length})`; }
  if (region) { vals.push(region);         query += ` AND region = $${vals.length}`; }
  query += ' ORDER BY popularity_score DESC';
  try {
    const { rows } = await db.query(query, vals);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
