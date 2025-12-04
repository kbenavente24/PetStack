// Import the DB connection pool
const pool = require('../config/database');

// VIEW ACCOUNT INFO 
const viewAccountInfo = async (req, res) => {
  try {
    const userId = req.query.user_id;

    if (!userId) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>PetStack - Error</title>
            <link rel="stylesheet" href="account.css">
        </head>
        <body style="padding: 20px; font-family: 'Shadows Into Light Two', cursive, Arial, Helvetica, sans-serif; background-color: rgb(0 151 178); color: white; text-align: center;">
            <h1>Error</h1>
            <p style="color: rgb(255 165 198); font-size: 22px;">Missing user_id parameter</p>
            <a href="/account.html" style="color: rgb(255 165 198); text-decoration: none; font-size: 20px;">← Back to Dashboard</a>
        </body>
        </html>
      `);
    }

    // Query user information from database
    const result = await pool.query(
      `SELECT user_id, email, display_name
       FROM "user"
       WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>PetStack - Error</title>
            <link rel="stylesheet" href="account.css">
        </head>
        <body style="padding: 20px; font-family: 'Shadows Into Light Two', cursive, Arial, Helvetica, sans-serif; background-color: rgb(0 151 178); color: white; text-align: center;">
            <h1>Error</h1>
            <p style="color: rgb(255 165 198); font-size: 22px;">User not found</p>
            <a href="/account.html" style="color: rgb(255 165 198); text-decoration: none; font-size: 20px;">← Back to Dashboard</a>
        </body>
        </html>
      `);
    }

    const user = result.rows[0];
    const displayName = user.display_name || user.email;

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <title>PetStack - Account Information</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Shadows+Into+Light+Two&display=swap" rel="stylesheet">
          <link rel="stylesheet" href="account.css">
          <style>
              body {
                  margin: 0;
                  padding: 0;
                  font-family: "Shadows Into Light Two", cursive, Arial, Helvetica, sans-serif;
                  background-color: rgb(0 151 178);
                  background-image: radial-gradient(circle at 50% 100%, rgb(0 75 132), transparent);
                  min-height: 100vh;
                  text-shadow: 2px 2px 10px rgb(0, 0, 0);
                  color: white;
              }
              .dashboard-nav {
                  background-color: rgb(0 75 132);
                  background-image: radial-gradient(circle at 50% 100%, rgb(0 151 178), transparent);
                  border-bottom: rgb(13, 66, 87) 2px solid;
                  color: white;
                  padding: 15px 30px;
                  display: flex;
                  align-items: center;
                  gap: 50px;
              }
              .dashboard-logo {
                  font-size: 28px;
                  font-weight: bold;
                  text-shadow: 5px 5px 15px rgb(0, 0, 0);
              }
              .nav-menu {
                  list-style: none;
                  display: flex;
                  gap: 20px;
                  margin: 0;
                  padding: 0;
              }
              .nav-item {
                  padding: 10px 20px;
                  cursor: pointer;
                  border-radius: 8px;
                  transition: all 0.3s ease;
                  background-color: transparent;
                  border: 2px solid rgb(255 165 198);
                  color: rgb(255 165 198);
                  font-size: 20px;
              }
              .nav-item:hover {
                  background-color: rgb(249 116 166);
                  color: white;
                  border-color: rgb(249 116 166);
              }
              .content-wrapper {
                  max-width: 800px;
                  margin: 50px auto;
                  padding: 20px;
              }
              .account-card {
                  background-color: rgb(121 201 250);
                  background-image: radial-gradient(circle at 50% 100%, rgb(0 151 178), transparent);
                  padding: 40px;
                  border-radius: 10px;
                  border: rgb(13, 66, 87) 2px solid;
                  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
              }
              .account-card h1 {
                  margin-top: 0;
                  color: white;
                  border-bottom: 3px solid rgb(255 165 198);
                  padding-bottom: 15px;
                  font-size: 32px;
                  text-shadow: 5px 5px 15px rgb(0, 0, 0);
              }
              .info-row {
                  margin: 25px 0;
                  padding: 15px;
                  background-color: rgba(0, 75, 132, 0.5);
                  border-radius: 8px;
                  border: 1px solid rgb(13, 66, 87);
              }
              .info-label {
                  font-weight: bold;
                  color: white;
                  margin-bottom: 8px;
                  font-size: 20px;
                  text-shadow: 2px 2px 8px rgb(0, 0, 0);
              }
              .info-value {
                  color: white;
                  font-size: 20px;
                  text-shadow: 2px 2px 8px rgb(0, 0, 0);
              }
              .logout-btn {
                  background-color: rgb(255 165 198);
                  color: white;
                  border: none;
                  padding: 12px 30px;
                  font-size: 20px;
                  cursor: pointer;
                  border-radius: 8px;
                  margin-top: 30px;
                  text-shadow: 2px 2px 8px rgb(0, 0, 0);
                  transition: background-color 0.3s;
              }
              .logout-btn:hover {
                  background-color: rgb(249 116 166);
              }
          </style>
      </head>
      <body>
          <nav class="dashboard-nav">
              <div class="dashboard-logo">PetStack</div>
              <ul class="nav-menu">
                  <li class="nav-item" onclick="window.location.href='/account.html'">← Back to Dashboard</li>
              </ul>
          </nav>

          <div class="content-wrapper">
              <div class="account-card">
                  <h1>Account Information</h1>

                  <div class="info-row">
                      <div class="info-label">Display Name:</div>
                      <div class="info-value">${displayName}</div>
                  </div>

                  <div class="info-row">
                      <div class="info-label">Email:</div>
                      <div class="info-value">${user.email}</div>
                  </div>

                  <div class="info-row">
                      <div class="info-label">User ID:</div>
                      <div class="info-value">${user.user_id}</div>
                  </div>

                  <button class="logout-btn" onclick="logout()">Logout</button>
              </div>
          </div>

          <script>
              function logout() {
                  localStorage.removeItem('userData');
                  window.location.href = '/login.html';
              }
          </script>
      </body>
      </html>
    `);

  } catch (err) {
    console.error("Database error:", err);
    res.status(500).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <title>PetStack - Error</title>
          <link rel="stylesheet" href="account.css">
      </head>
      <body style="padding: 20px; font-family: 'Shadows Into Light Two', cursive, Arial, Helvetica, sans-serif; background-color: rgb(0 151 178); color: white; text-align: center;">
          <h1>Error</h1>
          <p style="color: rgb(255 165 198); font-size: 22px;">Failed to load account information</p>
          <a href="/account.html" style="color: rgb(255 165 198); text-decoration: none; font-size: 20px;">← Back to Dashboard</a>
      </body>
      </html>
    `);
  }
};

module.exports = {
  viewAccountInfo
};
