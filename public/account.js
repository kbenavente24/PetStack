// Get stored user data
let userData = localStorage.getItem('userData');
let dataInfo = JSON.parse(userData);

// Check if user is logged in
if (!dataInfo || !dataInfo.user) {
    window.location.href = '/login.html';
}

const userId = dataInfo.user.userId;
const displayName = dataInfo.user.displayName || dataInfo.user.email;

// Update welcome text
document.getElementById('welcomeText').textContent = `Welcome, ${displayName}!`;

let households = [];

// Fetch and display households on page load
async function loadHouseholds() {
    try {
        const response = await fetch(`/users/viewhouseholds?user_id=${userId}`);
        const data = await response.json();

        households = data;
        displayHouseholds(data);

    } catch (err) {
        console.error('Error loading households:', err);
        document.getElementById('householdsContainer').innerHTML =
            '<div class="error">Error loading households. Please try again.</div>';
    }
}

// Display households as cards
function displayHouseholds(householdsData) {
    const container = document.getElementById('householdsContainer');

    if (householdsData.length === 0) {
        container.innerHTML = '<div class="loading">You are not part of any households yet.</div>';
        return;
    }

    container.innerHTML = '';

    householdsData.forEach(household => {
        const card = document.createElement('div');
        card.className = 'household-card';
        card.onclick = () => loadPets(household.household_id, household.household_name);

        const name = document.createElement('div');
        name.className = 'household-name';
        name.textContent = household.household_name;

        card.appendChild(name);
        container.appendChild(card);
    });
}

// load activities for a pet.
async function getActivities(petId) {
    try {
        const response = await fetch(`/users/viewNotesAndActivities?pet_id=${petId}`);
        const data = await response.json();

        //for loop it for options

        displayActivity(data);

    } catch (err) {
        console.error(err);
    }
}

function displayActivity(data) {
    document.getElementById('householdView').style.display = 'none';
    document.getElementById('petView').style.display = 'none';
    document.getElementById('activityView').style.display = 'block';

    console.log("Activity Data:", data);

    // Data example:
    // [
    //   { pet_name, owner_notes, activity_type, activity_date, activity_time, activity_notes },
    //   ...
    // ]

    if (!data || data.length === 0) {
        document.getElementById('activityList').innerHTML =
            '<div>No activities found.</div>';
        return;
    }

    const petName = data[0].pet_name;
    const ownerNotes = data[0].owner_notes;

    // Set pet name and owner notes on top
    document.getElementById('activityPetName').textContent = petName;
    document.getElementById('ownerNotes').textContent = ownerNotes;

    // Default "selected activity" = most recent activity
    const latestActivity = data[0];
    document.getElementById('selectedActivity').innerHTML = `
        <strong>${latestActivity.activity_type}</strong><br>
        ${latestActivity.activity_date} @ ${latestActivity.activity_time}<br><br>
        ${latestActivity.activity_notes}
    `;

    // Fill scrollable activity list
    const listContainer = document.getElementById('activityList');
    listContainer.innerHTML = '';

    data.forEach((act, index) => {
        const item = document.createElement('div');
        item.className = 'activity-item';

        item.innerHTML = `
            <strong>${act.activity_type}</strong>  
            <div style="font-size:13px; color:#666;">
                ${act.activity_date} @ ${act.activity_time}
            </div>
        `;

        // Clicking shows that activity on top
        item.onclick = () => {
            document.getElementById('selectedActivity').innerHTML = `
                <strong>${act.activity_type}</strong><br>
                ${act.activity_date} @ ${act.activity_time}<br><br>
                ${act.activity_notes}
            `;
        };

        listContainer.appendChild(item);
    });
}

// Load pets for a specific household
async function loadPets(householdId, householdName) {
    // Hide household view, show pet view
    document.getElementById('householdView').style.display = 'none';
    document.getElementById('petView').style.display = 'block';
    document.getElementById('currentHouseholdName').textContent = householdName;

    try {
        const response = await fetch(`/pets/byhousehold?household_id=${householdId}`);
        const pets = await response.json();

        displayPets(pets);

    } catch (err) {
        console.error('Error loading pets:', err);
        document.getElementById('petsContainer').innerHTML =
            '<div class="error">Error loading pets. Please try again.</div>';
    }
}

// Display pets as circles
function displayPets(petsData) {
    const container = document.getElementById('petsContainer');

    if (petsData.length === 0) {
        container.innerHTML = '<div class="loading">No pets in this household yet.</div>';
        return;
    }

    container.innerHTML = '';

    petsData.forEach(pet => {
        const card = document.createElement('div');
        console.log(pet.pet_id);
        card.onclick = () => getActivities(pet.pet_id);
        card.className = 'pet-card';

        const circle = document.createElement('div');
        circle.className = 'pet-circle';
        // Show first letter of pet name in the circle
        circle.textContent = pet.pet_name.charAt(0).toUpperCase();

        const name = document.createElement('div');
        name.className = 'pet-name';
        name.textContent = pet.pet_name;

        card.appendChild(circle);
        card.appendChild(name);
        container.appendChild(card);
    });
}

// Go back to households view
function showHouseholds() {
    document.getElementById('petView').style.display = 'none';
    document.getElementById('activityView').style.display = 'none';
    document.getElementById('householdView').style.display = 'block';
}

// Go back to households view
function showPets() {
    document.getElementById('petView').style.display = 'block';
    document.getElementById('activityView').style.display = 'none';
    document.getElementById('householdView').style.display = 'none';
}

// Navigation function
function navigateTo(section) {
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));

    // Hide all views
    document.getElementById('householdView').style.display = 'none';
    document.getElementById('petView').style.display = 'none';
    document.getElementById('allPetsView').style.display = 'none';
    document.getElementById('accountView').style.display = 'none';

    // Show selected view
    if (section === 'households') {
        document.getElementById('navHouseholds').classList.add('active');
        document.getElementById('householdView').style.display = 'block';
        document.getElementById('pageTitle').textContent = 'Your Households';
    } else if (section === 'pets') {
        document.getElementById('navPets').classList.add('active');
        document.getElementById('allPetsView').style.display = 'block';
        document.getElementById('pageTitle').textContent = 'All Your Pets';
        loadAllPets();
    } else if (section === 'account') {
        document.getElementById('navAccount').classList.add('active');
        document.getElementById('accountView').style.display = 'block';
        document.getElementById('pageTitle').textContent = 'Account Settings';
        displayAccountInfo();
    }
}

// Load all pets across all households
async function loadAllPets() {
    const container = document.getElementById('allPetsContainer');
    container.innerHTML = '<div class="loading">Loading all your pets...</div>';

    try {
        // Fetch all households first
        const householdsResponse = await fetch(`/users/viewhouseholds?user_id=${userId}`);
        const householdsData = await householdsResponse.json();

        // Fetch pets for each household
        let allPets = [];
        for (const household of householdsData) {
            const petsResponse = await fetch(`/pets/byhousehold?household_id=${household.household_id}`);
            const pets = await petsResponse.json();

            // Add household name to each pet
            pets.forEach(pet => {
                pet.household_name = household.household_name;
            });

            allPets = allPets.concat(pets);
        }

        if (allPets.length === 0) {
            container.innerHTML = '<div class="loading">No pets found across your households.</div>';
            return;
        }

        container.innerHTML = '';
        allPets.forEach(pet => {
            const card = document.createElement('div');
            card.className = 'pet-card';

            const circle = document.createElement('div');
            circle.className = 'pet-circle';
            circle.textContent = pet.pet_name.charAt(0).toUpperCase();

            const name = document.createElement('div');
            name.className = 'pet-name';
            name.textContent = pet.pet_name;

            const householdLabel = document.createElement('div');
            householdLabel.style.fontSize = '14px';
            householdLabel.style.color = '#666';
            householdLabel.style.marginTop = '5px';
            householdLabel.textContent = pet.household_name;

            card.appendChild(circle);
            card.appendChild(name);
            card.appendChild(householdLabel);
            container.appendChild(card);
        });

    } catch (err) {
        console.error('Error loading all pets:', err);
        container.innerHTML = '<div class="error">Error loading pets. Please try again.</div>';
    }
}

// Display account information
function displayAccountInfo() {
    document.getElementById('accountDisplayName').textContent = displayName;
    document.getElementById('accountEmail').textContent = dataInfo.user.email;
    document.getElementById('accountUserId').textContent = userId;
}

// Logout function
function logout() {
    localStorage.removeItem('userData');
    window.location.href = '/login.html';
}

// Load households when page loads
loadHouseholds();