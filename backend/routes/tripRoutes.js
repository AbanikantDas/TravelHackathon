const express = require('express');
const db      = require('../config/db');
const auth    = require('../middleware/authMiddleware');
const router  = express.Router();

// GET /api/trips
router.get('/', auth, async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM trips WHERE user_id=$1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/trips
router.post('/', auth, async (req, res) => {
  const { name, description, start_date, end_date, cover_photo, is_public } = req.body;
  try {
    const { rows } = await db.query(
      'INSERT INTO trips (user_id,name,description,start_date,end_date,cover_photo,is_public) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [req.user.id, name, description, start_date, end_date, cover_photo, is_public || false]
    );
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/trips/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM trips WHERE id=$1 AND user_id=$2',
      [req.params.id, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Trip not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/trips/:id
router.put('/:id', auth, async (req, res) => {
  const { name, description, start_date, end_date, cover_photo, is_public } = req.body;
  try {
    const { rows } = await db.query(
      'UPDATE trips SET name=$1,description=$2,start_date=$3,end_date=$4,cover_photo=$5,is_public=$6 WHERE id=$7 AND user_id=$8 RETURNING *',
      [name, description, start_date, end_date, cover_photo, is_public, req.params.id, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Trip not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/trips/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM trips WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
    res.json({ message: 'Trip deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
