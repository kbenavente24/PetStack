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

// CREATE NOTE/ACTIVITY FUNCTION WITH TRANSACTION
const createNotesAndActivities = async (req, res) => {
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
      error: "Missing required fields"
    });
  }

  const client = await pool.connect();

  try {
    // Begin transaction
    await client.query('BEGIN');

    // Check for exact duplicate activity
    const duplicateCheck = await client.query(
      `SELECT activity_id FROM activity
       WHERE pet_id = $1
         AND activity_type = $2
         AND activity_date = $3
         AND activity_time = $4`,
      [pet_id, activity_type, activity_date, activity_time]
    );

    if (duplicateCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      client.release();
      return res.status(409).json({
        error: "Duplicate activity",
        message: "This activity already exists for this pet at the same date and time",
        transaction_status: "ROLLED BACK"
      });
    }

    // Insert the new activity
    const activityResult = await client.query(
      `INSERT INTO activity (user_id, pet_id, activity_type, activity_date, activity_time, activity_notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [user_id, pet_id, activity_type, activity_date, activity_time, activity_notes]
    );

    // Commit transaction
    await client.query('COMMIT');
    client.release();

    res.status(201).json({
      success: true,
      message: "Activity created successfully",
      activity: activityResult.rows[0],
      transaction_status: "COMMITTED"
    });

  } catch (err) {
    await client.query('ROLLBACK');
    client.release();
    console.error("Transaction error:", err);
    res.status(500).json({
      error: "Failed to create activity",
      transaction_status: "ROLLED BACK"
    });
  }
};

module.exports = {
  viewNotesAndActivities,
  createNotesAndActivities
};
