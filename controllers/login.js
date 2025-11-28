// Import database connection pool
const pool = require('../config/database');

const login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        // Query for matching email
        const result = await pool.query(
            'SELECT user_id, email, password, display_name FROM "user" WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                error: "No account found with that email."
            });
        }

        const user = result.rows[0];

        // Check password (NOTE: plain text for now—hashing recommended)
        if (user.password !== password) {
            return res.status(401).json({
                success: false,
                error: "Incorrect password."
            });
        }

        // Login successful
        res.json({
            success: true,
            user: {
                userId: user.user_id,
                email: user.email,
                displayName: user.display_name
            }
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({
            success: false,
            error: "Server error during login."
        });
    }
};

module.exports = {
    login
};