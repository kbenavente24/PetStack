// Import the DB connection pool
const pool = require('../config/database');

// VIEW NOTES AND ACTIVITIES FUNCTION
const viewNotesAndActivities = async (req, res) => {
  try {
    const petId = req.query.pet_id;

    if (!petId) {
      return res.status(400).json({ error: "Missing pet_id" });
    }

    const result = await pool.query(
      `
      SELECT p.*, a.activity_id, a.user_id, a.activity_type, a.activity_date,
             a.activity_time, a.activity_notes
      FROM "pet" AS p
      LEFT JOIN "activity" AS a ON a.pet_id = p.pet_id
      WHERE p.pet_id = $1
      ORDER BY a.activity_date DESC, a.activity_time DESC
      `,
      [petId]
    );

    res.json(result.rows);

  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to load activities" });
  }
};

module.exports = {
  viewNotesAndActivities
};
