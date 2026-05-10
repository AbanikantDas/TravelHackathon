const db = require('../config/db');

const budgetModel = {
  findByTrip: (tripId) =>
    db.query('SELECT * FROM budgets WHERE trip_id=$1', [tripId]),

  upsert: (tripId, data) => {
    const { transport_cost = 0, stay_cost = 0, activity_cost = 0, meal_cost = 0, total_budget = 0 } = data
    return db.query(
      `INSERT INTO budgets (trip_id,transport_cost,stay_cost,activity_cost,meal_cost,total_budget)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (trip_id) DO UPDATE
       SET transport_cost=$2,stay_cost=$3,activity_cost=$4,meal_cost=$5,total_budget=$6
       RETURNING *`,
      [tripId, transport_cost, stay_cost, activity_cost, meal_cost, total_budget]
    )
  },
}

module.exports = budgetModel
