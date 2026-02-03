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
            localStorage.setItem('households', JSON.stringify(response.households));

            // if(response.households.length > 0){
            //     console.log("User has households in their account, adding them to local storage.");
            //     localStorage.setItem('households', JSON.stringify(response.households));
            // }

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
    joinHouseholdCardFunctionality();
    setupDateDisplay();

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

    // If a user does not have any households, show empty state
    const userHouseholds = JSON.parse(localStorage.getItem('households')) || [];
    if (userHouseholds.length === 0) {
        return;
    }

    // Determine which household to show (last used or first)
    const lastHouseholdId = localStorage.getItem('lastHouseholdId');
    let selectedHousehold = userHouseholds.find(h => h.householdId == lastHouseholdId);
    if (!selectedHousehold) {
        selectedHousehold = userHouseholds[0];
    }

    // Populate and setup household dropdown
    populateHouseholdDropdown(userHouseholds, selectedHousehold.householdId);
    setupHouseholdDropdownHandler();

    // Load pets for the selected household
    await loadPetsForHousehold(selectedHousehold.householdId);
}

/**
 * Populates the household dropdown with all user's households
 */
function populateHouseholdDropdown(households, selectedHouseholdId) {
    const householdDropdown = document.getElementById('household-dropdown');
    if (!householdDropdown) return;

    householdDropdown.innerHTML = '';
    households.forEach(household => {
        const option = document.createElement('option');
        option.value = household.householdId;
        option.textContent = household.householdName;
        if (household.householdId == selectedHouseholdId) {
            option.selected = true;
        }
        householdDropdown.appendChild(option);
    });
}

/**
 * Sets up the household dropdown change handler
 */
function setupHouseholdDropdownHandler() {
    const householdDropdown = document.getElementById('household-dropdown');
    if (!householdDropdown) return;

    householdDropdown.addEventListener('change', async (e) => {
        const householdId = e.target.value;
        localStorage.setItem('lastHouseholdId', householdId);
        await loadPetsForHousehold(householdId);
    });
}

/**
 * Loads pets for a household and updates the pet dropdown
 */
async function loadPetsForHousehold(householdId) {
    try {
        const pets = await apiCall(`/api/pets/${householdId}`);

        // Always show active state when user has households (so they can switch)
        const emptyState = document.getElementById('empty-state');
        const activeState = document.getElementById('active-state');
        document.getElementById('welcome-message').classList.add('hidden');
        if (emptyState) emptyState.style.display = 'none';
        if (activeState) activeState.classList.remove('hidden');

        // Save the household selection
        localStorage.setItem('lastHouseholdId', householdId);

        if (pets.length > 0) {
            // Determine which pet to select (last used or first)
            const lastPetId = localStorage.getItem('lastPetId');
            let selectedPet = pets.find(p => p.petId == lastPetId);
            if (!selectedPet) {
                selectedPet = pets[0];
            }

            // Populate pet dropdown
            populatePetDropdown(pets, selectedPet.petId);
            setupPetDropdownHandler(householdId);

            // Update pet avatar
            updatePetAvatar(selectedPet.petName);

            // Save current pet and load activities
            localStorage.setItem('petId', selectedPet.petId);
            localStorage.setItem('lastPetId', selectedPet.petId);
            await loadActivitiesForPet(householdId, selectedPet.petId);
        } else {
            // No pets in this household
            const petDropdown = document.getElementById('pet-dropdown');
            petDropdown.innerHTML = '<option>No pets yet</option>';
            updatePetAvatar('No Pet');
            document.getElementById('activity-log').innerHTML = '';
        }
    } catch (error) {
        console.error('Failed to load pets:', error);
    }
}

/**
 * Populates the pet dropdown with pets from the selected household
 */
function populatePetDropdown(pets, selectedPetId) {
    const petDropdown = document.getElementById('pet-dropdown');
    if (!petDropdown) return;

    petDropdown.innerHTML = '';
    pets.forEach(pet => {
        const option = document.createElement('option');
        option.value = pet.petId;
        option.textContent = pet.petName;
        if (pet.petId == selectedPetId) {
            option.selected = true;
        }
        petDropdown.appendChild(option);
    });
}

/**
 * Sets up the pet dropdown change handler
 */
function setupPetDropdownHandler(householdId) {
    const petDropdown = document.getElementById('pet-dropdown');
    if (!petDropdown) return;

    // Remove existing listeners by cloning
    const newDropdown = petDropdown.cloneNode(true);
    petDropdown.parentNode.replaceChild(newDropdown, petDropdown);

    newDropdown.addEventListener('change', async (e) => {
        const petId = e.target.value;
        const petName = e.target.options[e.target.selectedIndex].text;

        localStorage.setItem('petId', petId);
        localStorage.setItem('lastPetId', petId);

        updatePetAvatar(petName);
        await loadActivitiesForPet(householdId, petId);
    });
}

/**
 * Updates the pet avatar display
 */
function updatePetAvatar(petName) {
    const petProfilePicture = document.getElementById('pet-avatar-name');
    if (petProfilePicture) {
        petProfilePicture.textContent = petName;
    }
}

/**
 * Loads activities for a specific pet
 */
async function loadActivitiesForPet(householdId, petId) {
    const userId = localStorage.getItem('userId');
    const today = new Date();
    const { start, end } = getDayRange(today);

    try {
        const activities = await apiCall(`/api/activity/pet?start=${start}&end=${end}&householdId=${householdId}&userId=${userId}&petId=${petId}`);
        displayActivityLog(activities);
    } catch (error) {
        console.error('Failed to load activities:', error);
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
        console.log("household id for testing:");
        console.log(JSON.parse(localStorage.getItem('households'))[0].householdId);
        data.householdId = JSON.parse(localStorage.getItem('households'))[0].householdId;
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
    
    
        const userStateRefresh = await apiCall(`/api/users/${localStorage.getItem('userId')}`, {
            method: 'GET'
        });
        localStorage.setItem('households', JSON.stringify(userStateRefresh.households));
        console.log(JSON.parse(localStorage.getItem('households')));
        //HOUSEHOLD CREATED SUCCESSFULLY--CLOSE THE MODAL
        document.getElementById('modal-overlay').classList.add('hidden');
        openModal('first-time-household-creation');
    
        } catch (error) {
            console.error('Failed to :', error);
        }
    });
}

function joinHouseholdCardFunctionality(){
    const joinHouseholdButton = document.getElementById('btn-join-household');
    joinHouseholdButton.addEventListener('click', (e) => {
        openModal('join-household');
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

function openModal(contentType, data = null){
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
      <button type="click" class="modal-btn" id="start-logging-activities">Start logging activities</button>
      <button type="click" class="modal-btn btn-secondary">Invite others</button>
    `;
    document.getElementById('modal-close').classList.add('hidden');

    const startLoggingActivitiesBtn = document.getElementById('start-logging-activities');
    startLoggingActivitiesBtn.addEventListener('click', async (e) => {
        document.getElementById('modal-overlay').classList.add('hidden');
        document.getElementById('modal-close').classList.remove('hidden');

        const userHouseholds = JSON.parse(localStorage.getItem('households')) || [];
        const householdId = userHouseholds[0].householdId;

        // Populate household dropdown
        populateHouseholdDropdown(userHouseholds, householdId);
        setupHouseholdDropdownHandler();

        // Load pets and show active state
        await loadPetsForHousehold(householdId);
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
        topPageGreeting.textContent = JSON.parse(localStorage.getItem('households'))[0].householdName;
        const firstHouseholdMessage = document.getElementById('empty-state-message');
        firstHouseholdMessage.textContent = "Now that you've created a household, it's time to add a pet. From there, you could either begin stacking or invite friends and family to your household!";
        document.getElementById('btn-add-pet').classList.remove('hidden');
        document.getElementById('btn-create-household').classList.add('hidden');
        document.getElementById('btn-join-household').classList.add('hidden');
    }

    if(contentType === "join-household"){
    content.innerHTML = `
      <h2 class="text-center">Join a Household</h2>
      <p class="text-small mb-md">Each household is provided a unique invite code. If you were shared one, paste or enter it below!</p>
      <form id="join-household-form">
        <label>Invite Code</label>
        <input type="text" name="inviteCode" required>
        <button type="submit" class="modal-btn">Confirm</button>
      </form>
    `;

    const form = document.getElementById('join-household-form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(form));
        data.userId = localStorage.getItem('userId');
        data.role = "Member";
    try {
        const household = await apiCall('/api/householdmember', {
            method: 'POST',
            body: JSON.stringify(data)
        });

        const userStateRefresh = await apiCall(`/api/users/${localStorage.getItem('userId')}`, {
            method: 'GET'
        });
        localStorage.setItem('households', JSON.stringify(userStateRefresh.households));
        console.log(JSON.parse(localStorage.getItem('households')));
        //HOUSEHOLD CREATED SUCCESSFULLY--CLOSE THE MODAL
        document.getElementById('modal-overlay').classList.add('hidden');
    
        } catch (error) {
            console.error('Failed to :', error);
        }
    });
    document.getElementById('modal-overlay').classList.remove('hidden');
    }

    if(contentType === 'edit-activity'){
        const activity = data; // data parameter contains the activity object

        // Helper to show main edit options
        function showEditOptions() {
            content.innerHTML = `
                <h2 class="text-center">Edit Activity</h2>
                <p class="text-small mb-md">What would you like to do with this activity?</p>
                <div class="edit-activity-options">
                    <button class="modal-btn btn-danger" id="btn-delete-activity">Delete Activity</button>
                    <button class="modal-btn" id="btn-change-time">Change Time</button>
                    <button class="modal-btn" id="btn-change-type">Change Activity Type</button>
                </div>
                <div id="edit-activity-form-container"></div>
            `;
            attachEditListeners();
        }

        // Helper to show delete confirmation
        function showDeleteConfirmation() {
            content.innerHTML = `
                <h2 class="text-center">Delete Activity</h2>
                <p class="text-small mb-md">Are you sure you want to delete this activity? This cannot be undone.</p>
                <div class="edit-activity-options">
                    <button class="modal-btn btn-danger" id="btn-confirm-delete">Yes, Delete</button>
                    <button class="modal-btn btn-secondary" id="btn-back">Back</button>
                </div>
            `;

            document.getElementById('btn-confirm-delete').addEventListener('click', async () => {
                try {
                    await apiCall(`/api/activity/${activity.activityId}?userId=${localStorage.getItem('userId')}`, {
                        method: 'DELETE'
                    });
                    document.getElementById('modal-overlay').classList.add('hidden');
                    await refreshActivityLog();
                } catch (error) {
                    console.error('Failed to delete activity:', error);
                }
            });

            document.getElementById('btn-back').addEventListener('click', () => {
                showEditOptions();
            });
        }

        // Attach listeners to edit option buttons
        function attachEditListeners() {
            // Delete Activity - show confirmation
            document.getElementById('btn-delete-activity').addEventListener('click', () => {
                showDeleteConfirmation();
            });

        // Change Time
        document.getElementById('btn-change-time').addEventListener('click', () => {
            const formContainer = document.getElementById('edit-activity-form-container');
            const currentTime = new Date(activity.activityTimestamp);
            const timeValue = currentTime.toTimeString().slice(0, 5); // HH:MM format

            formContainer.innerHTML = `
                <form id="change-time-form" class="mt-md">
                    <label>New Time</label>
                    <input type="time" name="newTime" value="${timeValue}" required>
                    <button type="submit" class="modal-btn">Update Time</button>
                </form>
            `;

            document.getElementById('change-time-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const newTime = document.querySelector('input[name="newTime"]').value;

                // Combine original date with new time
                const originalDate = new Date(activity.activityTimestamp);
                const [hours, minutes] = newTime.split(':');
                originalDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

                try {
                    await apiCall(`/api/activity/${activity.activityId}/time`, {
                        method: 'PUT',
                        body: JSON.stringify({
                            userId: parseInt(localStorage.getItem('userId')),
                            newTimestamp: originalDate.toISOString()
                        })
                    });
                    document.getElementById('modal-overlay').classList.add('hidden');
                    await refreshActivityLog();
                } catch (error) {
                    console.error('Failed to update time:', error);
                    alert('Failed to update time');
                }
            });
        });

        // Change Type
        document.getElementById('btn-change-type').addEventListener('click', () => {
            const formContainer = document.getElementById('edit-activity-form-container');
            formContainer.innerHTML = `
                <form id="change-type-form" class="mt-md">
                    <label>New Activity Type</label>
                    <select name="newType" required>
                        <option value="FED" ${activity.activityType === 'FED' ? 'selected' : ''}>Fed</option>
                        <option value="WALKED" ${activity.activityType === 'WALKED' ? 'selected' : ''}>Walked</option>
                        <option value="PEE" ${activity.activityType === 'PEE' ? 'selected' : ''}>Pee</option>
                        <option value="POOP" ${activity.activityType === 'POOP' ? 'selected' : ''}>Poop</option>
                    </select>
                    <button type="submit" class="modal-btn">Update Type</button>
                </form>
            `;

            document.getElementById('change-type-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const newType = document.querySelector('select[name="newType"]').value;

                try {
                    await apiCall(`/api/activity/${activity.activityId}/type`, {
                        method: 'PUT',
                        body: JSON.stringify({
                            userId: parseInt(localStorage.getItem('userId')),
                            newType: newType
                        })
                    });
                    document.getElementById('modal-overlay').classList.add('hidden');
                    await refreshActivityLog();
                } catch (error) {
                    console.error('Failed to update type:', error);
                }
            });
        });
        } // end attachEditListeners

        // Initialize with edit options view
        showEditOptions();
        document.getElementById('modal-overlay').classList.remove('hidden');
    }

    if(contentType === 'log-activity-confirm'){
        const { activityType, petName, timeString } = data;

        // Get activity verb for display
        const activityVerbs = {
            'FED': 'was fed',
            'WALKED': 'went for a walk',
            'PEE': 'peed',
            'POOP': 'pooped'
        };
        const activityVerb = activityVerbs[activityType] || activityType.toLowerCase();

        content.innerHTML = `
            <h2 class="text-center">Log Activity</h2>
            <p class="text-center mb-md">Log that <strong>${petName}</strong> ${activityVerb} @ ${timeString}?</p>
            <div class="edit-activity-options">
                <button class="modal-btn" id="btn-confirm-log">Confirm</button>
                <button class="modal-btn btn-secondary" id="btn-cancel-log">Back</button>
            </div>
        `;

        document.getElementById('btn-confirm-log').addEventListener('click', async () => {
            document.getElementById('modal-overlay').classList.add('hidden');
            await logActivity(activityType);
        });

        document.getElementById('btn-cancel-log').addEventListener('click', () => {
            document.getElementById('modal-overlay').classList.add('hidden');
        });

        document.getElementById('modal-overlay').classList.remove('hidden');
    }

}

/**
 * Helper function to refresh the activity log after edits
 */
async function refreshActivityLog() {
    const householdDropdown = document.getElementById('household-dropdown');
    const householdId = householdDropdown ? householdDropdown.value : localStorage.getItem('lastHouseholdId');
    const petId = localStorage.getItem('petId');
    const userId = localStorage.getItem('userId');

    // Get current displayed date from the date span
    const dateSpan = document.getElementById('activity-date');
    const displayedDate = new Date(dateSpan.textContent);
    const { start, end } = getDayRange(displayedDate);

    const activities = await apiCall(`/api/activity/pet?start=${start}&end=${end}&householdId=${householdId}&userId=${userId}&petId=${petId}`);
    displayActivityLog(activities);
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
            showLogActivityConfirmation(activityType);
        });
    });
}

function showLogActivityConfirmation(activityType) {
    // Get pet name from dropdown
    const petDropdown = document.getElementById('pet-dropdown');
    const petName = petDropdown.options[petDropdown.selectedIndex]?.text || 'your pet';
    const currentTime = new Date();
    const timeString = currentTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    openModal('log-activity-confirm', { activityType, petName, timeString });
}

async function logActivity(activityType){
    const userId = localStorage.getItem('userId');
    const petId = localStorage.getItem('petId');
    // Use the currently selected household from dropdown
    const householdDropdown = document.getElementById('household-dropdown');
    const householdId = householdDropdown ? householdDropdown.value : localStorage.getItem('lastHouseholdId');
    const activityTimestamp = new Date().toISOString();
    const { start, end } = getDayRange(new Date());

    await apiCall(`/api/activity`, {
        method: 'POST',
        body: JSON.stringify({
            userId: userId,
            petId: petId,
            activityType: activityType,
            activityTimestamp: activityTimestamp
        })
    });

    const activities = await apiCall(`/api/activity/pet?start=${start}&end=${end}&householdId=${householdId}&userId=${userId}&petId=${petId}`);
    displayActivityLog(activities);
}

function displayActivityLog(activities){
    const activityLog = document.getElementById('activity-log');
    activityLog.innerHTML = '';
    for(const activity of activities){
        const log = document.createElement('li');
        log.className = 'activity-entry';

        // Edit button (only shown for activities logged by current user)
        if(activity.loggedByUserId === parseInt(localStorage.getItem('userId'), 10)){
            const editBtn = document.createElement('button');
            editBtn.className = 'activity-edit-btn';
            editBtn.textContent = '📝';
            editBtn.addEventListener('click', () => {
                openModal('edit-activity', activity);
            });
            log.appendChild(editBtn);
        }

        const icon = getActivityIcon(activity.activityType);
        const text = document.createElement('span');

        if(activity.activityType == "FED"){
            text.textContent = `${activity.petName} was fed by ${activity.loggedByName} @ ${formatTime12Hour(activity.activityTimestamp)}`;
        }
        if(activity.activityType == "WALKED"){
            text.textContent = `${activity.petName} walked with ${activity.loggedByName} @ ${formatTime12Hour(activity.activityTimestamp)}`;
        }
        if(activity.activityType == "POOP"){
            text.textContent = `${activity.petName} pooped with ${activity.loggedByName} @ ${formatTime12Hour(activity.activityTimestamp)}`;
        }
        if(activity.activityType == "PEE"){
            text.textContent = `${activity.petName} peed with ${activity.loggedByName} @ ${formatTime12Hour(activity.activityTimestamp)}`;
        }

        log.appendChild(icon);
        log.appendChild(text);
        activityLog.prepend(log);
    }
}

function setupDateDisplay() {
    const dateSpan = document.getElementById('activity-date');
    if (!dateSpan) return;
    const rememberCurrentDay = new Date();
    const today = new Date();
    dateSpan.textContent = today.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    const previousDayButton = document.getElementById('date-prev');
    const nextDayButton = document.getElementById('date-next');

    previousDayButton.addEventListener('click', async (e) => {
        today.setDate(today.getDate() - 1);
        const { start, end } = getDayRange(today);
        // Use the currently selected household from dropdown
        const householdDropdown = document.getElementById('household-dropdown');
        const householdId = householdDropdown ? householdDropdown.value : localStorage.getItem('lastHouseholdId');

        const changedActivityLog = await apiCall(`/api/activity/pet?start=${start}&end=${end}&householdId=${householdId}&userId=${localStorage.getItem('userId')}&petId=${localStorage.getItem('petId')}`);

        dateSpan.textContent = today.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
        displayActivityLog(changedActivityLog);
    })

    nextDayButton.addEventListener('click', async (e) => {
        if(today.toDateString() === rememberCurrentDay.toDateString()){
            return;
        }
        today.setDate(today.getDate() + 1);
        const { start, end } = getDayRange(today);
        // Use the currently selected household from dropdown
        const householdDropdown = document.getElementById('household-dropdown');
        const householdId = householdDropdown ? householdDropdown.value : localStorage.getItem('lastHouseholdId');

        const changedActivityLog = await apiCall(`/api/activity/pet?start=${start}&end=${end}&householdId=${householdId}&userId=${localStorage.getItem('userId')}&petId=${localStorage.getItem('petId')}`);
        dateSpan.textContent = today.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
        displayActivityLog(changedActivityLog);
    })
}

/**
 * Returns the icon element for a given activity type
 * @param {string} activityType - The type of activity (FED, WALKED, PEE, POOP)
 * @returns {HTMLElement} The icon element (img or span)
 */
function getActivityIcon(activityType) {
    const iconMap = {
        'FED': { type: 'image', value: 'images/food-icon.png' },
        'WALKED': { type: 'image', value: 'images/walking-icon.png' },
        'PEE': { type: 'image', value: 'images/pee.png' },
        'POOP': { type: 'image', value: 'images/poop.png' }
    };

    const iconData = iconMap[activityType] || { type: 'emoji', value: '❓' };

    if (iconData.type === 'image') {
        const img = document.createElement('img');
        img.src = iconData.value;
        img.alt = activityType;
        img.className = 'activity-entry-icon';
        return img;
    } else {
        const span = document.createElement('span');
        span.textContent = iconData.value;
        span.className = 'activity-entry-icon';
        return span;
    }
}

/**
 * Converts ISO timestamp to 12-hour format in local timezone
 * @param {string} isoTimestamp - ISO timestamp like "2026-01-29T20:30:45.123Z"
 * @returns {string} Time in "H:MM AM/PM" format
 */
function formatTime12Hour(isoTimestamp) {
    const date = new Date(isoTimestamp);
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

function formatLocalDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Gets the start and end of day as ISO timestamps for API queries
 * @param {Date} date - The date to get range for
 * @returns {Object} - { start: ISO string, end: ISO string }
 */
function getDayRange(date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    
    return {
        start: start.toISOString(),
        end: end.toISOString()
    };
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

        // Handle empty responses (like DELETE which returns 204 No Content)
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}
