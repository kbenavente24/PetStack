// Import the DB connection pool
const pool = require('../config/database');

// ADD ACTIVITY FUNCTION (Utilizes Transaction Processing)
// This function demonstrates database transaction processing to ensure data
// integrity when creating new pet activities. It uses BEGIN, COMMIT, and
// ROLLBACK to maintain atomicity and prevent duplicate entries.
const addActivity = async (req, res) => {
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

// GET LAST ACTIVITY OF SPECIFIC TYPE (Query 10 implementation)
// Purpose: Find out when the last time a certain pet had a specific activity
// and who was responsible for doing it.
const getLastActivityOfType = async (req, res) => {
  try {
    const petId = req.query.pet_id;
    const activityType = req.query.activity_type;

    console.log(`[Last Activity] Request received - pet_id: ${petId}, activity_type: ${activityType}`);

    if (!petId || !activityType) {
      return res.status(400).json({
        error: "Missing required parameters: pet_id and activity_type"
      });
    }

    const result = await pool.query(
      `
      SELECT p.pet_name AS pet_name,
             a.activity_date AS activity_date,
             a.activity_time AS activity_time,
             u.display_name AS user_name
      FROM pet p
      JOIN activity a ON p.pet_id = a.pet_id
      JOIN "user" u ON a.user_id = u.user_id
      WHERE p.pet_id = $1
        AND a.activity_type = $2
      ORDER BY a.activity_date DESC, a.activity_time DESC
      LIMIT 1
      `,
      [petId, activityType]
    );

    console.log(`[Last Activity] Query result:`, result.rows);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: `No ${activityType} activity found for this pet`
      });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error("[Last Activity] Database error:", err);
    res.status(500).json({ error: "Failed to retrieve last activity" });
  }
};

module.exports = {
  addActivity,
  viewNotesAndActivities,
  getLastActivityOfType
};
