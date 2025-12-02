// Import the DB connection pool
const pool = require('../config/database');

// VIEW PETS BY HOUSEHOLD FUNCTION
const viewPetsByHousehold = async (req, res) => {
  try {
    const householdId = req.query.household_id;

    if (!householdId) {
      return res.status(400).json({ error: "Missing household_id" });
    }

    const result = await pool.query(
      `
      SELECT pet_id, pet_name, pet_species, pet_birthdate, pet_gender, owner_notes
      FROM "pet"
      WHERE household_id = $1
      ORDER BY pet_name ASC
      `,
      [householdId]
    );

    res.json(result.rows);

  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to load pets" });
  }
};

// ADD PET FUNCTION
const addPet = async (req, res) => {
  try {
    const { household_id, pet_name, pet_species, pet_gender, pet_birthdate, owner_notes } = req.body;

    if (!household_id || !pet_name || !pet_species) {
      return res.status(400).json({ error: "Missing required fields: household_id, pet_name, pet_species" });
    }

    // Validate pet_gender
    const validGenders = ['Unknown', 'Female', 'Male'];
    const gender = pet_gender || 'Unknown';
    if (!validGenders.includes(gender)) {
      return res.status(400).json({ error: "Invalid gender. Must be Unknown, Female, or Male" });
    }

    // Insert the pet
    const petResult = await pool.query(
      `INSERT INTO pet (pet_name, pet_species, pet_gender, pet_birthdate, owner_notes, household_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING pet_id`,
      [pet_name, pet_species, gender, pet_birthdate || null, owner_notes || null, household_id]
    );

    res.json({
      success: true,
      pet_id: petResult.rows[0].pet_id,
      message: "Pet added successfully"
    });

  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to add pet" });
  }
};

module.exports = {
  viewPetsByHousehold,
  addPet
};
