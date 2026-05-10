const db = require('../config/db');

module.exports = async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT id FROM admin_users WHERE id = $1',
      [req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};
