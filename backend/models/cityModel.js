const db = require('../config/db');

const cityModel = {
  findAll: (filters = {}) => {
    let query = 'SELECT * FROM cities WHERE 1=1'
    const vals = []
    if (filters.q) {
      vals.push(`%${filters.q}%`)
      query += ` AND (name ILIKE $${vals.length} OR country ILIKE $${vals.length})`
    }
    if (filters.region) {
      vals.push(filters.region)
      query += ` AND region=$${vals.length}`
    }
    if (filters.cost_index) {
      vals.push(filters.cost_index)
      query += ` AND cost_index=$${vals.length}`
    }
    query += ' ORDER BY popularity_score DESC'
    return db.query(query, vals)
  },

  findById: (id) =>
    db.query('SELECT * FROM cities WHERE id=$1', [id]),

  topByPopularity: (limit = 10) =>
    db.query('SELECT * FROM cities ORDER BY popularity_score DESC LIMIT $1', [limit]),
}

module.exports = cityModel
