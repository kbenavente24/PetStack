// Household management functions

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
    const header = document.getElementById('householdsHeader');

    if (householdsData.length === 0) {
        header.style.display = 'none';
        container.innerHTML = `
            <div class="no-households">
                <div class="no-households-text">You are not part of any households yet.</div>
                <div class="household-actions">
                    <button class="household-action-btn" onclick="joinHousehold()">Join Household</button>
                    <button class="household-action-btn secondary" onclick="createHousehold()">Create Household</button>
                </div>
            </div>
        `;
        return;
    }

    // Show the add household button when user has households
    header.style.display = 'flex';
    container.innerHTML = '';

    householdsData.forEach(household => {
        const card = document.createElement('div');
        card.className = 'household-card';
        card.onclick = () => loadPets(household.household_id, household.household_name, household.invite_code, household.user_role);

        const name = document.createElement('div');
        name.className = 'household-name';
        name.textContent = household.household_name;

        card.appendChild(name);
        container.appendChild(card);
    });
}

// Open create household modal
function createHousehold() {
    document.getElementById('createHouseholdModal').classList.add('show');
    document.getElementById('householdNameInput').value = '';
    document.getElementById('createMessage').className = 'modal-message';
}

// Close create household modal
function closeCreateModal() {
    document.getElementById('createHouseholdModal').classList.remove('show');
}

// Submit create household
async function submitCreateHousehold() {
    const householdName = document.getElementById('householdNameInput').value.trim();
    const messageDiv = document.getElementById('createMessage');

    if (!householdName) {
        messageDiv.textContent = 'Please enter a household name';
        messageDiv.className = 'modal-message error';
        return;
    }

    try {
        const response = await fetch('/households/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                household_name: householdName
            })
        });

        const data = await response.json();

        if (data.success) {
            // Close modal and navigate directly to the new household
            closeCreateModal();
            await loadHouseholds();
            // Navigate to the newly created household (creator role)
            loadPets(data.household_id, householdName, data.invite_code, 'creator');
        } else {
            messageDiv.textContent = data.error || 'Failed to create household';
            messageDiv.className = 'modal-message error';
        }
    } catch (err) {
        messageDiv.textContent = 'Network error. Please try again.';
        messageDiv.className = 'modal-message error';
    }
}

// Open join household modal
function joinHousehold() {
    document.getElementById('joinHouseholdModal').classList.add('show');
    document.getElementById('inviteCodeInput').value = '';
    document.getElementById('joinMessage').className = 'modal-message';
}

// Close join household modal
function closeJoinModal() {
    document.getElementById('joinHouseholdModal').classList.remove('show');
}

// Submit join household
async function submitJoinHousehold() {
    const inviteCode = document.getElementById('inviteCodeInput').value.trim();
    const messageDiv = document.getElementById('joinMessage');

    if (!inviteCode) {
        messageDiv.textContent = 'Please enter an invite code';
        messageDiv.className = 'modal-message error';
        return;
    }

    try {
        const response = await fetch('/households/join', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                invite_code: inviteCode
            })
        });

        const data = await response.json();

        if (data.success) {
            messageDiv.textContent = 'Successfully joined household!';
            messageDiv.className = 'modal-message success';

            // Reload households after 1.5 seconds
            setTimeout(() => {
                closeJoinModal();
                loadHouseholds();
            }, 1500);
        } else {
            messageDiv.textContent = data.error || 'Failed to join household';
            messageDiv.className = 'modal-message error';
        }
    } catch (err) {
        messageDiv.textContent = 'Network error. Please try again.';
        messageDiv.className = 'modal-message error';
    }
}

// Open leave household confirmation
function confirmLeaveHousehold() {
    document.getElementById('leaveHouseholdModal').classList.add('show');
    document.getElementById('leaveMessage').className = 'modal-message';
}

// Close leave household modal
function closeLeaveModal() {
    document.getElementById('leaveHouseholdModal').classList.remove('show');
}

// Submit leave household
async function submitLeaveHousehold() {
    const messageDiv = document.getElementById('leaveMessage');

    try {
        const response = await fetch('/households/leave', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                household_id: currentHouseholdId
            })
        });

        const data = await response.json();

        if (data.success) {
            closeLeaveModal();
            await loadHouseholds();
            showHouseholds();
        } else {
            messageDiv.textContent = data.error || 'Failed to leave household';
            messageDiv.className = 'modal-message error';
        }
    } catch (err) {
        messageDiv.textContent = 'Network error. Please try again.';
        messageDiv.className = 'modal-message error';
    }
}

// Open delete household confirmation
function confirmDeleteHousehold() {
    document.getElementById('deleteHouseholdModal').classList.add('show');
    document.getElementById('deleteMessage').className = 'modal-message';
    document.getElementById('deleteConfirmInput').value = '';
}

// Close delete household modal
function closeDeleteModal() {
    document.getElementById('deleteHouseholdModal').classList.remove('show');
}

// Submit delete household
async function submitDeleteHousehold() {
    const confirmText = document.getElementById('deleteConfirmInput').value.trim();
    const messageDiv = document.getElementById('deleteMessage');
    const householdName = document.getElementById('currentHouseholdName').textContent;

    if (confirmText !== householdName) {
        messageDiv.textContent = 'Household name does not match';
        messageDiv.className = 'modal-message error';
        return;
    }

    try {
        const response = await fetch('/households/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                household_id: currentHouseholdId
            })
        });

        const data = await response.json();

        if (data.success) {
            closeDeleteModal();
            await loadHouseholds();
            showHouseholds();
        } else {
            messageDiv.textContent = data.error || 'Failed to delete household';
            messageDiv.className = 'modal-message error';
        }
    } catch (err) {
        messageDiv.textContent = 'Network error. Please try again.';
        messageDiv.className = 'modal-message error';
    }
}
