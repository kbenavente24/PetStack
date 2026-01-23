/*
 * PetStack Frontend JavaScript
 */

// Wait for the page to fully load before running any JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('PetStack loaded!');

    // Set up form handlers based on which page we're on
    setupSignupForm();
    setupLoginForm();
    setupDashboard();
});

/**
 * --------------SIGN UP FORM SUBMISSION HANDLER------------------
 * Only runs if the signup form exists on the current page
 */
function setupSignupForm() {
    const form = document.getElementById('signup-form');

    // If there's no signup form on this page, do nothing
    if (!form) return;

    form.addEventListener('submit', async function(event) {
        // IMPORTANT: Prevent the browser's default form behavior
        // Without this, the page would refresh and lose all data
        event.preventDefault();

        // Gather values from the form inputs
        // The 'id' attribute on each <input> lets us find them
        const email = document.getElementById('email').value;
        const displayName = document.getElementById('displayName').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validate passwords match BEFORE sending to server
        // This is called "client-side validation" - it's faster feedback for the user
        // Note: You should ALSO validate on the server, never trust the client alone
        if (password !== confirmPassword) {
            alert('Passwords do not match. Please try again.');
            return; // Stop here, don't submit to server
        }

        try {
            // Send the data to your backend API
            // This must match what your Spring controller expects
            const user = await apiCall('/api/auth/signup', {
                method: 'POST',
                body: JSON.stringify({
                    email: email,
                    displayName: displayName,
                    password: password
                })
            });

            console.log('User created:', user);

            // Success! Redirect to login page
            // Later you might auto-login instead
            window.location.href = '/login.html';

        } catch (error) {
            // Something went wrong - show the user
            // For now, just an alert. Later you'd show a nicer message
            alert('Signup failed. Please try again.');
            console.error('Signup error:', error);
        }
    });
}

/**
 * --------------------LOGIN FORM SUBMISSION HANDLER-----------------------
//************************************************************************************
//************************************************************************************
//************************************************************************************
 * Only runs if the login form exists on the current page
 */
function setupLoginForm() {
    const form = document.getElementById('login-form');

    if (!form) return;

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await apiCall('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            console.log('Login successful:', response);

            // Store user info in localStorage so we know who's logged in
            // localStorage persists even if you close the browser
            localStorage.setItem('userId', response.userId);
            localStorage.setItem('displayName', response.displayName);

            if(response.households.length > 0){
                console.log("User has households in their account, adding them to local storage.");
                localStorage.setItem('households', JSON.stringify(response.households));
            }

            // After successful login, redirect to the main app
            window.location.href = '/dashboard.html';

        } catch (error) {
            alert('Login failed. Please check your email and password.');
            console.error('Login error:', error);
        }
    });
}

/**
 * -----------------------------DASHBOARD SETUP---------------------------------------
//************************************************************************************
//************************************************************************************
//************************************************************************************
 * Checks if user is logged in, displays their info, loads their pets
 */
async function setupDashboard() {
    // Check if we're on the dashboard page
    const displayNameElement = document.getElementById('user-display-name');
    

    if (!displayNameElement){
        return;
    }  // Not on dashboard, do nothing

    setupActivityButtons();
    createHouseholdCardFunctionality();
    addPetCardFunctionality();

    // Check if user is logged in by looking for userId in localStorage
    const userId = localStorage.getItem('userId');
    const displayName = localStorage.getItem('displayName');


    if (!userId) {
        // Not logged in - redirect to login page
        window.location.href = '/login.html';
        return;
    }

    // User is logged in - show their name
    displayNameElement.textContent = displayName;

    // If a user does not have any households, we do not need to proceed any further as the next
    // lines of code within this function pertain to loading households and/or pets.
    console.log(localStorage.getItem('households'));
    if(localStorage.getItem('households') === null){
        return;
    }
    const userHouseholds = JSON.parse(localStorage.getItem('households'));
    const firstHouseholdId = userHouseholds[0].householdId;
    console.log(firstHouseholdId);


    // Load the user's pets
    try {
        const today = new Date();
        const date = today.toISOString().split('T')[0];  // "2026-01-19"    
        const pets = await apiCall(`/api/pets/${firstHouseholdId}`);
        console.log(pets);
        // If user has pets, show them; otherwise show empty state
        console.log("hi");
        if (pets.length > 0) {
            const activities = await apiCall(`/api/activity/pet?date=${date}&householdId=${firstHouseholdId}&userId=${userId}&petId=${pets[0].petId}`);
            console.log(activities);
            displayPets(pets);
            displayActivityLog(activities);
            localStorage.setItem('petId', pets[0].petId);
        }
    } catch (error) {
        console.error('Failed to load pets:', error);
    }
}

//------------"ADD PET" MENU CARD FUNCTIONALITY + HELPER FUNCTIONS -------------------
//************************************************************************************
//************************************************************************************
//************************************************************************************
function addPetCardFunctionality(){
    const addPetButton = document.getElementById('btn-add-pet');
    addPetButton.addEventListener('click', e => {
        openModal('add-pet');
        setUpSubmittingPetForm();
    } )
}

function setUpSubmittingPetForm(){
    const form = document.getElementById('add-pet-form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(form));
        data.userId = localStorage.getItem('userId');
        data.householdId = JSON.parse(localStorage.getItem('households')).householdId;
        console.log(data);
    try {
      await apiCall('/api/pets', {
        method: 'POST',
        body: JSON.stringify(data)
      });

      openModal('first-pet-added');
      
      // Refresh pet list, show success, etc.
    } catch (error) {
      console.error('Failed to add pet:', error);
    }
    })
}

//------------"CREATE HOUSEHOLD" MENU CARD FUNCTIONALITY + HELPER FUNCTIONS -------------------
//************************************************************************************
//************************************************************************************
//************************************************************************************
//CARD THAT APPEARS AFTER PRESSING "CREATE A HOUSEHOLD" IN THE FIRST-TIME (EMPTY-STATE) DASHBOARD

function createHouseholdCardFunctionality(){
    const createHouseholdButton = document.getElementById('btn-create-household');
    createHouseholdButton.addEventListener('click', (e) => {
        openModal('create-household');
        setUpSubmittingHouseholdForm();
    })
}

function setUpSubmittingHouseholdForm(){
    const form = document.getElementById('create-household-form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(form));
        data.userId = localStorage.getItem('userId');
        data.role = "Creator";
    try {
        const household = await apiCall('/api/household', {
            method: 'POST',
            body: JSON.stringify(data)
        });

        localStorage.setItem('households', JSON.stringify(household));
        console.log(JSON.parse(localStorage.getItem('households')));
        //HOUSEHOLD CREATED SUCCESSFULLY--CLOSE THE MODAL
        document.getElementById('modal-overlay').classList.add('hidden');
        openModal('first-time-household-creation');
    
        } catch (error) {
            console.error('Failed to :', error);
        }
    });
}




/**
 * -----------------------------MODAL CONTROL---------------------------------------
//************************************************************************************
//************************************************************************************
//************************************************************************************
 * THIS DISPLAYS THE VARYING STATES OF THE DASHBOARD. THE PARAMETER "contentType" IS
// USED TO DETERMINE WHAT TO DISPLAY/HIDE/UNHIDE
 */

function openModal(contentType){
    const content = document.getElementById('modal-content');

    const closeModalButton = document.getElementById('modal-close');
    closeModalButton.addEventListener('click', (e) => {
    const modalOverlay = document.getElementById('modal-overlay').classList.add('hidden');
    })

    if(contentType === 'add-pet'){
    content.innerHTML = `
      <h2 class="text-center">Pet Information</h2>
      <p class="text-small mb-md">Before adding your pet, we'll need a bit of info!</p>
      <form id="add-pet-form">
        <label>Your Pet's Name</label>
        <input type="text" name="petName" required>
        <label>Your Pet's Breed</label>
        <input type="text" name="petSpecies" required>
        <label>Your Pet's Date of Birth (Optional)</label>
        <input type="text" name="petBirthdate" required>
        <button type="submit" class="modal-btn">Confirm</button>
      </form>
    `;

    document.getElementById('modal-overlay').classList.remove('hidden');

    }


    if(contentType === 'first-pet-added'){
    content.innerHTML = `
      <h2 class="text-center">Your pet has been added!</h2>
      <p class="text-small mb-md">What would you like to do next?</p>
      <button type="click" id="start-logging-activities">Start logging activities></button>
      <button type="click">Invite others></button>
    `;
    document.getElementById('modal-close').classList.add('hidden');

    const startLoggingActivitiesBtn = document.getElementById('start-logging-activities');
    startLoggingActivitiesBtn.addEventListener('click', async (e) => {
        document.getElementById('modal-overlay').classList.add('hidden');
        const userId = localStorage.getItem('userId');
        const householdId = JSON.parse(localStorage.getItem('households')).householdId;
        const pets = await apiCall(`/api/pets/${householdId}`);
        if (pets.length > 0) {
        displayPets(pets);
        localStorage.setItem('petId', pets[0].petId);
        // Load activities for today...
            }
        });
    }

    if(contentType === 'create-household'){
    content.innerHTML = `
      <h2 class="text-center">Create a Household</h2>
      <p class="text-small mb-md">Households are groups of PetStack members that can collaboratively log activities for your pets. Once your household is created, you will be provided an invite code that you can then share with others!</p>
      <form id="create-household-form">
        <label>Your household's name</label>
        <input type="text" name="householdName" required>
        <button type="submit" class="modal-btn">Confirm</button>
      </form>
    `;
    document.getElementById('modal-overlay').classList.remove('hidden');
    }

    if(contentType === 'first-time-household-creation'){
        const topPageGreeting = document.getElementById('welcome-message');
        topPageGreeting.textContent = JSON.parse(localStorage.getItem('households')).householdName;
        const firstHouseholdMessage = document.getElementById('empty-state-message');
        firstHouseholdMessage.textContent = "Now that you've created a household, it's time to add a pet. From there, you could either begin stacking or invite friends and family to your household!";
        document.getElementById('btn-add-pet').classList.remove('hidden');
        document.getElementById('btn-create-household').classList.add('hidden');
        document.getElementById('btn-join-household').classList.add('hidden');

        
    }

}


/**
 * ---------------------ACTIVITY LOG + PET DROPDOWN MENU------------------------------
//************************************************************************************
//************************************************************************************
//************************************************************************************
 * 
 */

function setupActivityButtons() {
    const buttons = document.querySelectorAll('.activity-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const activityType = button.dataset.type;  // reads data-type attribute
            logActivity(activityType);
        });
    });
}

async function logActivity(activityType){
    const userId = localStorage.getItem('userId');
    const petId = localStorage.getItem('petId');
    const today = new Date();
    const todaysDate = today.toISOString().split('T')[0];
    const todaysTime = today.toTimeString().split(' ')[0];  // "14:30:45"
    await apiCall(`/api/activity`, {
        method: 'POST',
        body: JSON.stringify({
            userId: userId,
            petId: petId,
            activityType: activityType,
            activityDate: todaysDate,
            activityTime: todaysTime,
        })
    } );
    const activities = await apiCall(`/api/activity/pet?date=${todaysDate}&userId=${userId}&petId=${petId}`);
    displayActivityLog(activities);
}

/**
 * Displays the user's pets on the dashboard
 */
function displayPets(pets) {
    // Hide empty state, show active state
    const emptyState = document.getElementById('empty-state');
    const activeState = document.getElementById('active-state');

    if (emptyState) emptyState.style.display = 'none';
    if (activeState) {
        activeState.classList.remove('hidden');
    }

    const petDropdown = document.getElementById('pet-dropdown');
    const option = document.createElement('option');
    option.textContent = pets[0].petName;
    petDropdown.appendChild(option);

}

function displayActivityLog(activities){
    const activityLog = document.getElementById('activity-log');
    activityLog.innerHTML = '';
    for(const activity of activities){
    const log = document.createElement('li');
    log.className = 'activity-entry';  
    log.textContent = `${activity.petName} was ${activity.activityType} with ${activity.loggedByName} @ ${activity.activityTime}`
    activityLog.append(log);
    }
}



/**
 * Helper function to make API calls to your backend
 *
 * @param {string} endpoint - The API endpoint (e.g., '/api/pets')
 * @param {object} options - Fetch options (method, body, etc.)
 * @returns {Promise} - The JSON response from the server
 *
 * Usage examples:
 *   const pets = await apiCall('/api/pets');
 *   const newPet = await apiCall('/api/pets', { method: 'POST', body: JSON.stringify({...}) });
 */
async function apiCall(endpoint, options = {}) {
    // Set default headers for JSON
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // Merge default options with provided options
    const fetchOptions = { ...defaultOptions, ...options };

    try {
        const response = await fetch(endpoint, fetchOptions);

        // Check if the request was successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse and return JSON response
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}
