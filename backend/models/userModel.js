const db = require('../config/db');

const userModel = {
  findByEmail: (email) =>
    db.query('SELECT * FROM users WHERE email=$1', [email]),

  findById: (id) =>
    db.query('SELECT id,name,email,profile_photo,language_pref,created_at FROM users WHERE id=$1', [id]),

  create: (name, email, hash) =>
    db.query(
      'INSERT INTO users (name,email,password_hash) VALUES ($1,$2,$3) RETURNING id,name,email,created_at',
      [name, email, hash]
    ),

  update: (id, fields) => {
    const keys = Object.keys(fields)
    const vals = Object.values(fields)
    const set  = keys.map((k, i) => `${k}=$${i + 2}`).join(',')
    return db.query(`UPDATE users SET ${set} WHERE id=$1 RETURNING id,name,email,profile_photo,language_pref`, [id, ...vals])
  },

  delete: (id) =>
    db.query('DELETE FROM users WHERE id=$1', [id]),
}

module.exports = userModel
