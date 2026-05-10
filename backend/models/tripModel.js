const db = require('../config/db');

const tripModel = {
  findAllByUser: (userId) =>
    db.query('SELECT * FROM trips WHERE user_id=$1 ORDER BY created_at DESC', [userId]),

  findById: (id, userId) =>
    db.query('SELECT * FROM trips WHERE id=$1 AND user_id=$2', [id, userId]),

  findPublicById: (id) =>
    db.query('SELECT * FROM trips WHERE id=$1 AND is_public=true', [id]),

  create: (userId, data) =>
    db.query(
      'INSERT INTO trips (user_id,name,description,start_date,end_date,cover_photo,is_public) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [userId, data.name, data.description, data.start_date, data.end_date, data.cover_photo, data.is_public || false]
    ),

  update: (id, userId, data) =>
    db.query(
      'UPDATE trips SET name=$1,description=$2,start_date=$3,end_date=$4,cover_photo=$5,is_public=$6 WHERE id=$7 AND user_id=$8 RETURNING *',
      [data.name, data.description, data.start_date, data.end_date, data.cover_photo, data.is_public, id, userId]
    ),

  delete: (id, userId) =>
    db.query('DELETE FROM trips WHERE id=$1 AND user_id=$2', [id, userId]),
}

module.exports = tripModel
