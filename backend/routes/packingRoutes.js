const express = require('express');
const db      = require('../config/db');
const auth    = require('../middleware/authMiddleware');
const router  = express.Router({ mergeParams: true });

router.get('/', auth, async (req, res) => {
  const { rows } = await db.query('SELECT * FROM packing_items WHERE trip_id=$1 ORDER BY category', [req.params.tripId]);
  res.json(rows);
});

router.post('/', auth, async (req, res) => {
  const { name, category } = req.body;
  const { rows } = await db.query(
    'INSERT INTO packing_items (trip_id,name,category) VALUES ($1,$2,$3) RETURNING *',
    [req.params.tripId, name, category || 'Other']
  );
  res.status(201).json(rows[0]);
});

router.put('/:id', auth, async (req, res) => {
  const { name, category, is_packed } = req.body;
  const { rows } = await db.query(
    'UPDATE packing_items SET name=$1,category=$2,is_packed=$3 WHERE id=$4 AND trip_id=$5 RETURNING *',
    [name, category, is_packed, req.params.id, req.params.tripId]
  );
  res.json(rows[0]);
});

router.delete('/:id', auth, async (req, res) => {
  await db.query('DELETE FROM packing_items WHERE id=$1 AND trip_id=$2', [req.params.id, req.params.tripId]);
  res.json({ message: 'Item deleted' });
});

module.exports = router;
