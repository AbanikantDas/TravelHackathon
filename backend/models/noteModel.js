const db = require('../config/db');

const noteModel = {
  findByTrip: (tripId) =>
    db.query('SELECT * FROM trip_notes WHERE trip_id=$1 ORDER BY created_at DESC', [tripId]),

  findByStop: (stopId) =>
    db.query('SELECT * FROM trip_notes WHERE stop_id=$1 ORDER BY created_at DESC', [stopId]),

  create: (tripId, stopId, content) =>
    db.query(
      'INSERT INTO trip_notes (trip_id,stop_id,content) VALUES ($1,$2,$3) RETURNING *',
      [tripId, stopId || null, content]
    ),

  update: (id, tripId, content) =>
    db.query(
      'UPDATE trip_notes SET content=$1 WHERE id=$2 AND trip_id=$3 RETURNING *',
      [content, id, tripId]
    ),

  delete: (id, tripId) =>
    db.query('DELETE FROM trip_notes WHERE id=$1 AND trip_id=$2', [id, tripId]),
}

module.exports = noteModel
