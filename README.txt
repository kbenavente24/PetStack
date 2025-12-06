Welcome to PetStack!

This README provides complete documentation for the PetStack application. Use this as a reference for understanding the application architecture, 
setting up the development environment, and navigating the codebase.

TECHNOLOGIES USED:
   Node.js - JavaScript runtime environment
   Express.js (v5.1.0) - Web application framework for routing and middleware
   PostgreSQL - Relational DBMS
   pg (v8.16.3) - PostgreSQL client for Node.js
   dotenv (v17.2.3) - Environment variable management


SETUP INSTRUCTIONS

   1. INSTALL DEPENDENCIES
      Navigate to the PetStack directory and in your terminal, run:
      
      npm install
      
      This will install all required packages including:
      - express (web server framework)
      - pg (PostgreSQL client)
      - dotenv (environment variable management)

   2. DATABASE CONFIGURATION
      Create a .env file in the root PetStack directory and add the following line:
      
      DATABASE_URL=postgresql://postgres.tzvtvravpoebrnrqgmmo:PetsAreCool123!@aws-0-us-west-2.pooler.supabase.com:5432/postgres
      
      Note: Our database is cloud-hosted on Supabase. The final SQL script attached with our submission was used on the platform to create all tables, constraints, and sample data. We chose Supabase because it allowed our group to easily collaborate straight from our browsers using its built-in SQL editor, simple interface, and one of our members were already familiar with the platform.

   3. START THE APPLICATION
      Run the following command in your terminal:
      
      node server.js
      
      You should see: "Server running on http://localhost:3000"
      By default, the server uses port 3000 unless overridden by adding a PORT variable in the .env file.

   4. ACCESS THE APPLICATION
      Open your web browser and navigate to:

      http://localhost:3000/login.html

      From there, all navigation is automatic. New users can click the signup
      button to create an account.

CONTROLLER FILE SUMMARIES

   controllers/signup.js
      Purpose: Handles user registration and display name setup
      Key Functions:
      - signup(): Creates new user accounts with email and password
      - setDisplayName(): Updates user's display name after registration

   controllers/login.js
      Purpose: Handles user authentication
      Key Functions:
      - login(): Validates user credentials and returns user information

   controllers/households.js
      Purpose: Manages household CRUD operations and membership
      Key Functions:
      - viewhouseholds(): Retrieves all households a user belongs to
      - createHousehold(): Creates a new household with unique invite code
      - joinHousehold(): Adds user to existing household via invite code
      - leaveHousehold(): Removes member from household (not creators)
      - deleteHousehold(): Deletes entire household (creator only)

   controllers/pets.js
      Purpose: Manages pet information within households
      Key Functions:
      - viewPetsByHousehold(): Retrieves all pets for a specific household
      - addPet(): Creates new pet record in a household

   controllers/activities.js
      Purpose: Tracks pet activities and logs (feeding, vet visits, etc.)
      Key Functions:
      - addActivity(): Creates new activity with transaction processing for duplicate prevention
      - viewNotes(): Retrieves pet information including owner notes
      - viewActivities(): Retrieves all activities for a specific pet
      - getLastActivityOfType(): Finds most recent occurrence of specific activity type

   controllers/account-info.js
      Purpose: Displays user account information
      Key Functions:
      - viewAccountInfo(): Retrieves user data and generates HTML page (uses direct HTML generation pattern rather than JSON response)


TRANSACTION PROCESSING IN PETSTACK ACTIVITY MANAGER

   WHAT WE IMPLEMENTED:
      In our activity tracking system (controllers/activities.js), we use database transaction processing when users create new pet activities. This happens in the addActivity function (lines 8-79).

   HOW IT WORKS:

   1. BEGIN TRANSACTION
      When a user submits a new activity (like "Fed the dog" or "Vet visit"),
      we start a database transaction instead of immediately saving the data.

   2. DUPLICATE CHECK
      We first check if an identical activity already exists (same pet, same activity type, same date and time). This prevents duplicate entries from:
      - The same user clicking "submit" multiple times accidentally
      - Multiple household members trying to log the exact same activity for the same pet at the same exact time (which would be impossible in reality)

   3. DECISION POINT
      - If a duplicate is found → We ROLLBACK the transaction (undo everything) and send an error message back to the user
      - If no duplicate exists → We INSERT the new activity into the database (Lines 52-57)

   4. COMMIT OR ROLLBACK
      If everything succeeds, we COMMIT (permanently save) the transaction.
      If anything fails, we ROLLBACK (undo all changes).

   WHY THIS IS USEFUL FOR OUR APPLICATION:
      Data Integrity:
      Prevents duplicate activity entries that would clutter the activity timeline and confuse pet owners about when things actually happened and how many times it occured.

      All-or-Nothing Safety:
      If something goes wrong during the save process (database error, connection issue), the transaction ensures nothing gets partially saved. Either the entire activity is recorded correctly, or nothing changes at all.

      Better User Experience:
      Users see clear feedback messages about whether their activity was saved successfully or if it was rejected as a duplicate, with the transaction status included in the response.

      Prevents Race Conditions:
      If two household members try to log the same activity at the exact same time for the same pet, the transaction prevents both from being saved (a rare scenario, but something that is possible).

   IN PRACTICE:
      When a user fills out the activity form in the frontend
      (public/account/activity-manager.js) and clicks submit, the system sends
      a POST request to /users/addActivity. The addActivity function automatically
      uses transaction processing behind the scenes to ensure clean, reliable data
      storage without duplicates or partial saves.

      The frontend (activity-manager.js lines 121-153 and account.html lines 206-218)
      handles the transaction processing results by:
      - Displaying error messages if the transaction is rolled back (duplicate found
      or database error)
      - Closing the modal and refreshing the activity list if the transaction is
      committed successfully
      
APPLICATION ARCHITECTURE:

   PetStack implements a Single Page Application (SPA) design for the main user experience
   after authentication. Once a user logs in, they are directed to the main dashboard which
   consists of:

   - account.html: The primary dashboard page that serves as the container for all
     post-login functionality
   - account.css: Shared styling for the entire dashboard experience
   - public/account/ folder: Contains modular JavaScript files that handle different
     features within the single-page interface:
       * app-init.js: Application initialization
       * navigation.js: View navigation and routing
       * household-manager.js: Household management functionality
       * pet-manager.js: Pet management functionality
       * activity-manager.js: Activity tracking functionality

   This architecture minimizes page reloads and provides a seamless user experience by
   dynamically updating content within a single HTML page. Only the initial login and
   signup flows, and account info use separate HTML pages (login.html, signup.html, account-info.html)

   DESIGN PATTERN APPROACH:
      Our application primarily follows the JSON-based design pattern where the backend
      returns JSON data and the frontend uses JavaScript to dynamically render content.
      This approach is used in all controllers (signup.js, login.js, households.js,
      pets.js, activities.js) where:
      - Backend processes requests and returns JSON responses
      - Frontend JavaScript (in public/account/ folder) handles form submissions via fetch()
      - Results are dynamically rendered into the DOM without page reloads

      The exception is account-info.js, which uses the direct HTML generation pattern where
      the backend generates and returns complete HTML pages. This was intentionally kept as
      a demonstration of both design patterns.

