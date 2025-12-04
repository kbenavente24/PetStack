// Pet management functions

// Load pets for a specific household
async function loadPets(householdId, householdName, inviteCode, userRole) {
    // Store current household info
    currentHouseholdId = householdId;
    currentUserRole = userRole;

    // Hide household view, show pet view
    document.getElementById('householdView').style.display = 'none';
    document.getElementById('petView').style.display = 'block';
    document.getElementById('currentHouseholdName').textContent = householdName;
    document.getElementById('householdInviteCode').textContent = inviteCode || '------';

    // Show appropriate household management button
    const householdActionsContainer = document.getElementById('householdActionsContainer');
    householdActionsContainer.innerHTML = '';

    if (userRole === 'creator') {
        householdActionsContainer.innerHTML = `
            <button class="delete-household-btn" onclick="confirmDeleteHousehold()">Delete Household</button>
        `;
    } else {
        householdActionsContainer.innerHTML = `
            <button class="leave-household-btn" onclick="confirmLeaveHousehold()">Leave Household</button>
        `;
    }

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
        container.innerHTML = `
            <div class="loading">
                No pets in this household yet.
                <br>
                <button class="add-pet-btn" onclick="addPet()">Add Pet</button>
            </div>
        `;
        return;
    }

    container.innerHTML = '';

    petsData.forEach(pet => {
        const card = document.createElement('div');
        console.log(pet.pet_id);
        card.onclick = () => getActivities(pet.pet_id, 'petView');
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

    // Add "Add Pet" button at the end
    const addPetCard = document.createElement('div');
    addPetCard.className = 'pet-card';
    addPetCard.onclick = () => addPet();
    addPetCard.style.cursor = 'pointer';

    const addCircle = document.createElement('div');
    addCircle.className = 'pet-circle';
    addCircle.style.background = 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)';
    addCircle.textContent = '+';
    addCircle.style.fontSize = '64px';

    const addLabel = document.createElement('div');
    addLabel.className = 'pet-name';
    addLabel.textContent = 'Add Pet';

    addPetCard.appendChild(addCircle);
    addPetCard.appendChild(addLabel);
    container.appendChild(addPetCard);
}

// Open add pet modal
function addPet() {
    document.getElementById('addPetModal').classList.add('show');
    document.getElementById('addPetMessage').className = 'modal-message';
    // Clear form
    document.getElementById('petNameInput').value = '';
    document.getElementById('petSpeciesInput').value = '';
    document.getElementById('petGenderInput').value = 'Unknown';
    document.getElementById('petBirthdateInput').value = '';
    document.getElementById('petNotesInput').value = '';
}

// Close add pet modal
function closeAddPetModal() {
    document.getElementById('addPetModal').classList.remove('show');
}

// Submit add pet
async function submitAddPet() {
    const petName = document.getElementById('petNameInput').value.trim();
    const petSpecies = document.getElementById('petSpeciesInput').value.trim();
    const petGender = document.getElementById('petGenderInput').value;
    const petBirthdate = document.getElementById('petBirthdateInput').value;
    const petNotes = document.getElementById('petNotesInput').value.trim();
    const messageDiv = document.getElementById('addPetMessage');

    if (!petName || !petSpecies) {
        messageDiv.textContent = 'Please enter pet name and species';
        messageDiv.className = 'modal-message error';
        return;
    }

    try {
        const response = await fetch('/pets/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                household_id: currentHouseholdId,
                pet_name: petName,
                pet_species: petSpecies,
                pet_gender: petGender,
                pet_birthdate: petBirthdate || null,
                owner_notes: petNotes || null
            })
        });

        const data = await response.json();

        if (data.success) {
            closeAddPetModal();
            // Reload pets for current household
            const response = await fetch(`/pets/byhousehold?household_id=${currentHouseholdId}`);
            const pets = await response.json();
            displayPets(pets);
        } else {
            messageDiv.textContent = data.error || 'Failed to add pet';
            messageDiv.className = 'modal-message error';
        }
    } catch (err) {
        messageDiv.textContent = 'Network error. Please try again.';
        messageDiv.className = 'modal-message error';
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
            container.innerHTML = '<div class="loading">No pets found across your households.<br><br>Start by navigating to the Households page to join or create a household!</div>';
            return;
        }

        container.innerHTML = '';
        allPets.forEach(pet => {
            const card = document.createElement('div');
            card.className = 'pet-card';
            card.onclick = () => getActivities(pet.pet_id, 'allPetsView');

            const circle = document.createElement('div');
            circle.className = 'pet-circle';
            circle.textContent = pet.pet_name.charAt(0).toUpperCase();

            const name = document.createElement('div');
            name.className = 'pet-name';
            name.textContent = pet.pet_name;

            const householdLabel = document.createElement('div');
            householdLabel.style.fontSize = '16px';
            householdLabel.style.color = 'white';
            householdLabel.style.textShadow = '3px 3px 10px rgb(0, 0, 0)';
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
