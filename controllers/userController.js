// Import our database connection pool so controller functions can run SQL queries
const pool = require('../config/database');

//USER SIGNUP FUNCTION
const signup = async (req, res) => {

  // Extract email, password, and confirmation from the incoming request (req) body
  const email = req.body.email;
  const password = req.body.password;
  const confirm_password = req.body.confirm_password;

  // Basic validation: password and confirmation must match
  if (password !== confirm_password) {
    return res.status(400).json({
      success: false,
      error: 'Passwords do not match'
    });
  }

  try {
    // Insert a new user into the database
    // (Note: Passwords should be hashed in production — this approach is temporary for the demo.)
    // PostgreSQL requires $1, $2, $3 placeholders (similar to MySQL's ?)
    await pool.query(
      'INSERT INTO "user" (email, password, display_name) VALUES ($1, $2, $3)',
      [email, password, 'New User']  // Temporary display name until user sets their own.
    );

    // Retrieve the newly created user 
    const result = await pool.query(
      'SELECT user_id, email, display_name FROM "user" WHERE email = $1',
      [email]
    );

    const user = result.rows[0];

    // Respond with newly created user info
    res.json({
      success: true,
      userId: user.user_id,
      email: user.email
    });

  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({
      success: false,
      error: 'Email might already exist or password does not meet requirements'
    });
  }
};

// SET DISPLAY NAME FUNCTION
const setDisplayName = async (req, res) => {
  const user_id = req.body.user_id;
  const display_name = req.body.display_name;

  try {
    // Update user's display name in the database
    // PostgreSQL requires $1, $2 placeholders (similar to MySQL's ?)
    await pool.query(
      'UPDATE "user" SET display_name = $1 WHERE user_id = $2',
      [display_name, user_id]
    );

    // Retrieve the updated user 
    const result = await pool.query(
      'SELECT user_id, display_name, email FROM "user" WHERE user_id = $1',
      [user_id]
    );

    const user = result.rows[0];

    // Respond with updated user info
    res.json({
      success: true,
      user: {
        userId: user.user_id,
        displayName: user.display_name,
        email: user.email
      }
    });

  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to update display name'
    });
  }
};

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

// Export all controller functions
module.exports = {
  signup,
  setDisplayName,
  viewAllUsers
};
