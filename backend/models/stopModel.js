const db = require('../config/db');

const stopModel = {
  findByTrip: (tripId) =>
    db.query('SELECT * FROM stops WHERE trip_id=$1 ORDER BY order_index ASC', [tripId]),

  create: (tripId, data) =>
    db.query(
      'INSERT INTO stops (trip_id,city_id,arrival_date,departure_date,order_index) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [tripId, data.city_id, data.arrival_date, data.departure_date, data.order_index || 0]
    ),

  update: (id, tripId, data) =>
    db.query(
      'UPDATE stops SET arrival_date=$1,departure_date=$2,order_index=$3 WHERE id=$4 AND trip_id=$5 RETURNING *',
      [data.arrival_date, data.departure_date, data.order_index, id, tripId]
    ),

  delete: (id, tripId) =>
    db.query('DELETE FROM stops WHERE id=$1 AND trip_id=$2', [id, tripId]),
}

module.exports = stopModel
