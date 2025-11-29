// Import Express (Node.js web server framework)
const express = require('express');

// Create Express app instance
const app = express();

// Load our .env info by importing dotenv package and using its config() function
require('dotenv').config();

// Import our controllers (contain backend logic and database queries)
const userController = require('./controllers/signup');
const viewUsersController = require('./controllers/viewUsers');
const loginController = require('./controllers/login'); // <-- NEW
const activities = require('./controllers/viewAcitvities');

// Middleware Setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve all files in /public (signup.html, login.html, account.html, etc.)
app.use(express.static('public'));

// DEFINING ROUTES (What the frontend calls to interact with the backend)

// POST /users/signup - Handle user signup (email + password)
app.post('/users/signup', userController.signup);

// POST /users/set-displayname - Handle setting display name
app.post('/users/set-displayname', userController.setDisplayName);

// POST /users/login - Handle login (email + password)
app.post('/users/login', loginController.login); // <-- NEW

// GET /users/view - Get all users as JSON for the view-users.html page
app.get('/users/view', viewUsersController.viewAllUsers);

app.get('/users/viewhouseholds', activities.viewhouseholds);

app.get('/users/viewNotesAndActivities', activities.viewNotesAndActivities);

app.get('/users/viewPets', activities.viewPets);

// Start the Server
// Define port that our server will listen on. If no port is set in the .env file, it will use 3000 by default
const PORT = process.env.PORT || 3000;

// Start the server and log a message indicating the URL
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});