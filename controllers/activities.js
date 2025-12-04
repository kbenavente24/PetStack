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
  const client = await pool.connect(); // Get transactional client
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
      client.release(); // Release the connection
      return res.status(400).json({
        error: "Missing required fields (user_id, pet_id, activity_type, activity_date, activity_time)"
      });
    }

    // Start Transaction
    await client.query("BEGIN");

    // Insert activity
    const activityResult = await client.query(
      `
        INSERT INTO "activity" 
        (user_id, pet_id, activity_type, activity_date, activity_time, activity_notes)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `,
      [user_id, pet_id, activity_type, activity_date, activity_time, activity_notes]
    );

    // If you later want to insert notes or log entries, you can add more queries here:
    // await client.query(...)
    // await client.query(...)

    // Commit Transaction
    await client.query("COMMIT");

    res.status(201).json({
      message: "Activity created successfully",
      activity: activityResult.rows[0]
    });

  } catch (err) {
    console.error("Transaction error:", err);

    // Rollback on error
    try {
      await client.query("ROLLBACK");
    } catch (rollbackErr) {
      console.error("Rollback failed:", rollbackErr);
    }

    res.status(500).json({ error: "Failed to insert activity" });
  } finally {
    client.release(); // Always release client
  }
};

module.exports = {
  viewNotesAndActivities,
  createNotesAndActivities
};
