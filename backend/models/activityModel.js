const db = require('../config/db');

const activityModel = {
  findByCity: (cityId) =>
    db.query('SELECT * FROM activities WHERE city_id=$1 ORDER BY name', [cityId]),

  findById: (id) =>
    db.query('SELECT * FROM activities WHERE id=$1', [id]),

  search: (cityId, q) =>
    db.query(
      'SELECT * FROM activities WHERE city_id=$1 AND name ILIKE $2 ORDER BY name',
      [cityId, `%${q}%`]
    ),

  addToStop: (stopId, activityId, time, notes) =>
    db.query(
      'INSERT INTO stop_activities (stop_id,activity_id,scheduled_time,notes) VALUES ($1,$2,$3,$4) RETURNING *',
      [stopId, activityId, time || null, notes || null]
    ),

  removeFromStop: (stopId, activityId) =>
    db.query('DELETE FROM stop_activities WHERE stop_id=$1 AND activity_id=$2', [stopId, activityId]),

  findByStop: (stopId) =>
    db.query(
      'SELECT a.*,sa.scheduled_time,sa.notes FROM activities a JOIN stop_activities sa ON a.id=sa.activity_id WHERE sa.stop_id=$1',
      [stopId]
    ),
}

module.exports = activityModel
