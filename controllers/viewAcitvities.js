// Import the DB connection pool
const pool = require('../config/database');

// VIEW HOUSEHOLDS FUNCTION
const viewhouseholds = async (req, res) => {
  try {
    // Get user_id from request (example: /houses?user_id=101 )
    const userId = req.query.user_id;

    if (!userId) {
      return res.status(400).json({ error: "Missing user_id" });
    }

    const result = await pool.query(
      `
      SELECT *
      FROM "user" AS u
      JOIN "household_members" AS hm ON hm.user_id = u.user_id
      JOIN "household" AS h ON hm.household_id = h.household_id
      WHERE u.user_id = $1
      `,
      [userId]
    );

    res.json(result.rows);

  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to load households" });
  }
};

module.exports = {
  viewhouseholds
};