// Import Express (Node.js web server framework)
const express = require('express');

// Create Express app instance
const app = express();

// Load our .env info by importing dotenv package and using its config() function
require('dotenv').config();

// Import our controllers (contain backend logic and database queries)
const userController = require('./controllers/signup');
const loginController = require('./controllers/login');
const households = require('./controllers/households');
const pets = require('./controllers/pets');
const activities = require('./controllers/activities');

// Middleware Setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// DEFINING ROUTES (What the frontend calls to interact with the backend)

// POST /users/signup - Handle user signup (email + password)
app.post('/users/signup', userController.signup);

// POST /users/set-displayname - Handle setting display name
app.post('/users/set-displayname', userController.setDisplayName);

// POST /users/login - Handle login (email + password)
app.post('/users/login', loginController.login); // <-- NEW

// Household routes
app.get('/users/viewhouseholds', households.viewhouseholds);
app.post('/households/create', households.createHousehold);
app.post('/households/join', households.joinHousehold);
app.post('/households/leave', households.leaveHousehold);
app.post('/households/delete', households.deleteHousehold);

// Pet routes
app.get('/pets/byhousehold', pets.viewPetsByHousehold);
app.post('/pets/add', pets.addPet);

// Activity routes
app.get('/users/viewNotesAndActivities', activities.viewNotesAndActivities);
app.post('/users/createNotesAndActivities', activities.createNotesAndActivities);

// Start the Server
// Define port that our server will listen on. If no port is set in the .env file, it will use 3000 by default
const PORT = process.env.PORT || 3000;

// Start the server and log a message indicating the URL
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
