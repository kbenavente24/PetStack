// Import Express (Node.js web server framework)
const express = require('express');

// Create Express app instance
const app = express();

// Load our .env info by importing dotenv package and using its config() function
require('dotenv').config();

// Import our userController (contains backend logic and database queries)
const userController = require('./controllers/userController');

// Middleware Setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// DEFINING ROUTES (What the frontend calls to interact with the backend)

// POST /users/signup - Handle user signup (email + password)
app.post('/users/signup', userController.signup);

// POST /users/set-displayname - Handle setting display name
app.post('/users/set-displayname', userController.setDisplayName);

// GET /users/view - Get all users as JSON for the view-users.html page
app.get('/users/view', userController.viewAllUsers);

// Start the Server
// Define port that our server will listen on. If no port is set in the .env file, it will use 3000 by default
const PORT = process.env.PORT || 3000;

// Start the server and log a message indicating the URL
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
