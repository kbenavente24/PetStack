import { apiCall } from './utils.js';
import { showModal, hideModal, setModalContent } from './modals.js';
import { loadPetsForHousehold, addPetCardFunctionality, populatePetDropdown, setupPetDropdownHandler } from './pets.js';

export function populateHouseholdDropdown(households, selectedHouseholdId) {
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

export function setupHouseholdDropdownHandler() {
    const householdDropdown = document.getElementById('household-dropdown');
    if (!householdDropdown) return;

    householdDropdown.addEventListener('change', async (e) => {
        const householdId = e.target.value;
        await loadPetsForHousehold(householdId);
    });
}

export function createHouseholdCardFunctionality() {
    const createHouseholdButton = document.getElementById('btn-create-household');
    createHouseholdButton.addEventListener('click', () => {
        showCreateHouseholdModal();
    });
}

function showCreateHouseholdModal() {
    setModalContent(`
        <h2 class="text-center">Create a Household</h2>
        <p class="text-small mb-md">Households are groups of PetStack members that can collaboratively log activities for your pets. Once your household is created, you will be provided an invite code that you can then share with others!</p>
        <form id="create-household-form">
            <label>Your household's name</label>
            <input type="text" name="householdName" required>
            <button type="submit" class="modal-btn">Confirm</button>
        </form>
    `);

    showModal();

    const form = document.getElementById('create-household-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(form));
        data.role = "Creator";

        try {
            const household = await apiCall('/api/household', {
                method: 'POST',
                body: JSON.stringify(data)
            });

            hideModal();
            showFirstTimeHouseholdCreation(household);
        } catch (error) {
            console.error('Failed to create household:', error);
        }
    });
}

function showFirstTimeHouseholdCreation(household) {
    const topPageGreeting = document.getElementById('welcome-message');
    topPageGreeting.textContent = household.householdName;

    const firstHouseholdMessage = document.getElementById('empty-state-message');
    firstHouseholdMessage.textContent = "Now that you've created a household, it's time to add a pet. From there, you could either begin stacking or invite friends and family to your household!";

    document.getElementById('btn-add-pet').classList.remove('hidden');
    document.getElementById('btn-create-household').classList.add('hidden');
    document.getElementById('btn-join-household').classList.add('hidden');

    addPetCardFunctionality(household.householdId, async () => {
        populateHouseholdDropdown([household], household.householdId);
        setupHouseholdDropdownHandler();
        await loadPetsForHousehold(household.householdId);
    });
}

export function joinHouseholdCardFunctionality() {
    const joinHouseholdButton = document.getElementById('btn-join-household');
    joinHouseholdButton.addEventListener('click', () => {
        showJoinHouseholdModal();
    });
}

function showJoinHouseholdModal() {
    setModalContent(`
        <h2 class="text-center">Join a Household</h2>
        <p class="text-small mb-md">Each household is provided a unique invite code. If you were shared one, paste or enter it below!</p>
        <form id="join-household-form">
            <label>Invite Code</label>
            <input type="text" name="inviteCode" required>
            <button type="submit" class="modal-btn">Confirm</button>
        </form>
    `);

    showModal();

    const form = document.getElementById('join-household-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(form));
        data.role = "Member";

        try {
            const household = await apiCall('/api/householdmember', {
                method: 'POST',
                body: JSON.stringify(data)
            });

            showJoinHouseholdSuccess(household);
        } catch (error) {
            console.error('Failed to join household:', error);
        }
    });
}

function showJoinHouseholdSuccess(household) {
    setModalContent(`
        <h2 class="text-center">You successfully joined ${household.householdName}!</h2>
        <div class="edit-activity-options">
            <button class="modal-btn" id="btn-view-activity-log">View pet activity log</button>
            <button class="modal-btn btn-secondary" id="btn-go-to-households">Join or create another household</button>
        </div>
    `);

    document.getElementById('btn-view-activity-log').addEventListener('click', async () => {
        hideModal();

        const userStateRefresh = await apiCall('/api/users/me');
        populateHouseholdDropdown(userStateRefresh.households, household.householdId);
        setupHouseholdDropdownHandler();
        await loadPetsForHousehold(household.householdId);

        document.getElementById('empty-state')?.remove();
        document.getElementById('active-state')?.classList.remove('hidden');
    });

    document.getElementById('btn-go-to-households').addEventListener('click', () => {
        window.location.href = 'households.html';
    });
}
