const db = require('../config/db');

const packingModel = {
  findByTrip: (tripId) =>
    db.query('SELECT * FROM packing_items WHERE trip_id=$1 ORDER BY category, name', [tripId]),

  create: (tripId, name, category) =>
    db.query(
      'INSERT INTO packing_items (trip_id,name,category) VALUES ($1,$2,$3) RETURNING *',
      [tripId, name, category || 'Other']
    ),

  update: (id, tripId, data) =>
    db.query(
      'UPDATE packing_items SET name=$1,category=$2,is_packed=$3 WHERE id=$4 AND trip_id=$5 RETURNING *',
      [data.name, data.category, data.is_packed, id, tripId]
    ),

  toggle: (id, tripId, isPacked) =>
    db.query(
      'UPDATE packing_items SET is_packed=$1 WHERE id=$2 AND trip_id=$3 RETURNING *',
      [isPacked, id, tripId]
    ),

  delete: (id, tripId) =>
    db.query('DELETE FROM packing_items WHERE id=$1 AND trip_id=$2', [id, tripId]),

  resetAll: (tripId) =>
    db.query('UPDATE packing_items SET is_packed=false WHERE trip_id=$1', [tripId]),
}

module.exports = packingModel
