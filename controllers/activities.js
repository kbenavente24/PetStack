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

// add activity notes
// CREATE NOTE/ACTIVITY FUNCTION
const createNotesAndActivities = async (req, res) => {
  try {
    const {
      user_id,
      pet_id,
      activity_type,
      activity_date,
      activity_time,
      activity_notes
    } = req.body;

    // Basic validation
    if (!user_id || !pet_id || !activity_type || !activity_date || !activity_time) {
      return res.status(400).json({
        error: "Missing required fields (user_id, pet_id, activity_type, activity_date, activity_time)"
      });
    }

    const result = await pool.query(
      `
        INSERT INTO "activity" 
        (user_id, pet_id, activity_type, activity_date, activity_time, activity_notes)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `,
      [user_id, pet_id, activity_type, activity_date, activity_time, activity_notes]
    );

    res.status(201).json({
      message: "Activity created successfully",
      activity: result.rows[0]
    });

  } catch (err) {
    console.error("Insert activity error:", err);
    res.status(500).json({ error: "Failed to insert activity" });
  }
};

module.exports = {
  viewNotesAndActivities,
  createNotesAndActivities
};
