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

const viewNotesAndActivities = async (req, res) => {
  try {
    const petId = req.query.pet_id;

    const result = await pool.query(
      `
      SELECT *
      from "pet" as p join "activity" as a on a.pet_id = p.pet_id
      where a.pet_id = $1
      `,
      [petId]
    );

    res.json(result.rows);

  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to load households" });
  }
};

const viewPets = async (req, res) => {
  try {
    const houseId = req.query.household_id;

    const result = await pool.query(
      `
      SELECT *
      from "pet" as p
      where p.household_id = $1
      `,
      [houseId]
    );

    res.json(result.rows);

  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to load households" });
  }
};

module.exports = {
  viewhouseholds,
  viewNotesAndActivities,
  viewPets
};