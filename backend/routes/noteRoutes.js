const express = require('express');
const db      = require('../config/db');
const auth    = require('../middleware/authMiddleware');
const router  = express.Router({ mergeParams: true });

router.get('/', auth, async (req, res) => {
  const { rows } = await db.query('SELECT * FROM trip_notes WHERE trip_id=$1 ORDER BY created_at DESC', [req.params.tripId]);
  res.json(rows);
});

router.post('/', auth, async (req, res) => {
  const { stop_id, content } = req.body;
  const { rows } = await db.query(
    'INSERT INTO trip_notes (trip_id,stop_id,content) VALUES ($1,$2,$3) RETURNING *',
    [req.params.tripId, stop_id || null, content]
  );
  res.status(201).json(rows[0]);
});

router.put('/:id', auth, async (req, res) => {
  const { content } = req.body;
  const { rows } = await db.query(
    'UPDATE trip_notes SET content=$1 WHERE id=$2 AND trip_id=$3 RETURNING *',
    [content, req.params.id, req.params.tripId]
  );
  res.json(rows[0]);
});

router.delete('/:id', auth, async (req, res) => {
  await db.query('DELETE FROM trip_notes WHERE id=$1 AND trip_id=$2', [req.params.id, req.params.tripId]);
  res.json({ message: 'Note deleted' });
});

module.exports = router;
