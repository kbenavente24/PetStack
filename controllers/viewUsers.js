// Import our database connection pool so controller functions can run SQL queries
const pool = require('../config/database');

// VIEW ALL USERS FUNCTION
const viewAllUsers = async (req, res) => {
  try {
    // Fetch user_id, display_name, email for rendering on the frontend
    const result = await pool.query('SELECT user_id, display_name, email FROM "user" ORDER BY user_id');

    res.json(result.rows);

  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to load users' });
  }
};

// Export the function
module.exports = {
  viewAllUsers
};
