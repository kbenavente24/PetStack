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
      SELECT h.household_id, h.household_name, h.household_profile_picture_url, h.invite_code, hm.user_role
      FROM "user" AS u
      JOIN "household_members" AS hm ON hm.user_id = u.user_id
      JOIN "household" AS h ON hm.household_id = h.household_id
      WHERE u.user_id = $1
      ORDER BY h.household_name ASC
      `,
      [userId]
    );

    res.json(result.rows);

  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to load households" });
  }
};

// CREATE HOUSEHOLD FUNCTION
const createHousehold = async (req, res) => {
  try {
    const { user_id, household_name } = req.body;

    if (!user_id || !household_name) {
      return res.status(400).json({ error: "Missing user_id or household_name" });
    }

    // Generate a unique invite code
    let inviteCode;
    let isUnique = false;

    while (!isUnique) {
      inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const checkResult = await pool.query(
        `SELECT invite_code FROM household WHERE invite_code = $1`,
        [inviteCode]
      );
      if (checkResult.rows.length === 0) {
        isUnique = true;
      }
    }

    // Insert the household
    const householdResult = await pool.query(
      `INSERT INTO household (household_name, household_profile_picture_url, invite_code)
       VALUES ($1, $2, $3)
       RETURNING household_id`,
      [household_name, '', inviteCode]
    );

    const householdId = householdResult.rows[0].household_id;

    // Add the creator as creator
    await pool.query(
      `INSERT INTO household_members (user_id, household_id, user_role)
       VALUES ($1, $2, $3)`,
      [user_id, householdId, 'creator']
    );

    res.json({
      success: true,
      household_id: householdId,
      invite_code: inviteCode,
      message: "Household created successfully"
    });

  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to create household" });
  }
};

// JOIN HOUSEHOLD FUNCTION
const joinHousehold = async (req, res) => {
  try {
    const { user_id, invite_code } = req.body;

    if (!user_id || !invite_code) {
      return res.status(400).json({ error: "Missing user_id or invite_code" });
    }

    // Find household by invite code
    const householdResult = await pool.query(
      `SELECT household_id FROM household WHERE invite_code = $1`,
      [invite_code.toUpperCase()]
    );

    if (householdResult.rows.length === 0) {
      return res.status(404).json({ error: "Invalid invite code" });
    }

    const householdId = householdResult.rows[0].household_id;

    // Check if user is already a member
    const memberCheck = await pool.query(
      `SELECT * FROM household_members WHERE user_id = $1 AND household_id = $2`,
      [user_id, householdId]
    );

    if (memberCheck.rows.length > 0) {
      return res.status(400).json({ error: "You are already a member of this household" });
    }

    // Add user as member
    await pool.query(
      `INSERT INTO household_members (user_id, household_id, user_role)
       VALUES ($1, $2, $3)`,
      [user_id, householdId, 'member']
    );

    res.json({
      success: true,
      message: "Successfully joined household"
    });

  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to join household" });
  }
};

// LEAVE HOUSEHOLD FUNCTION
const leaveHousehold = async (req, res) => {
  try {
    const { user_id, household_id } = req.body;

    if (!user_id || !household_id) {
      return res.status(400).json({ error: "Missing user_id or household_id" });
    }

    // Check user's role - creators cannot leave
    const roleCheck = await pool.query(
      `SELECT user_role FROM household_members WHERE user_id = $1 AND household_id = $2`,
      [user_id, household_id]
    );

    if (roleCheck.rows.length === 0) {
      return res.status(404).json({ error: "You are not a member of this household" });
    }

    if (roleCheck.rows[0].user_role === 'creator') {
      return res.status(403).json({ error: "Creators cannot leave the household. Delete it instead." });
    }

    // Remove user from household
    await pool.query(
      `DELETE FROM household_members WHERE user_id = $1 AND household_id = $2`,
      [user_id, household_id]
    );

    res.json({
      success: true,
      message: "Successfully left household"
    });

  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to leave household" });
  }
};

// DELETE HOUSEHOLD FUNCTION (Creator only)
const deleteHousehold = async (req, res) => {
  try {
    const { user_id, household_id } = req.body;

    if (!user_id || !household_id) {
      return res.status(400).json({ error: "Missing user_id or household_id" });
    }

    // Verify user is the creator
    const roleCheck = await pool.query(
      `SELECT user_role FROM household_members WHERE user_id = $1 AND household_id = $2`,
      [user_id, household_id]
    );

    if (roleCheck.rows.length === 0) {
      return res.status(404).json({ error: "You are not a member of this household" });
    }

    if (roleCheck.rows[0].user_role !== 'creator') {
      return res.status(403).json({ error: "Only the creator can delete this household" });
    }

    // Delete household (cascades will handle pets, members, etc.)
    await pool.query(
      `DELETE FROM household WHERE household_id = $1`,
      [household_id]
    );

    res.json({
      success: true,
      message: "Household deleted successfully"
    });

  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to delete household" });
  }
};

module.exports = {
  viewhouseholds,
  createHousehold,
  joinHousehold,
  leaveHousehold,
  deleteHousehold
};
