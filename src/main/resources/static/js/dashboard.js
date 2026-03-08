import { setupActivityButtons, setupDateDisplay } from './activities.js';
import { loadPetsForHousehold, addPetCardFunctionality } from './pets.js';
import {
    populateHouseholdDropdown,
    setupHouseholdDropdownHandler,
    createHouseholdCardFunctionality,
    joinHouseholdCardFunctionality
} from './dashboard-households.js';

document.addEventListener('DOMContentLoaded', function() {
    setupDashboard();
});

async function setupDashboard() {
    setupActivityButtons();
    createHouseholdCardFunctionality();
    joinHouseholdCardFunctionality();
    setupDateDisplay();

    addPetCardFunctionality(async () => {
        const userHouseholds = JSON.parse(localStorage.getItem('households')) || [];
        const householdId = userHouseholds[0].householdId;
        populateHouseholdDropdown(userHouseholds, householdId);
        setupHouseholdDropdownHandler();
        await loadPetsForHousehold(householdId);
    });

    const token = localStorage.getItem('token');
    const displayName = localStorage.getItem('displayName');

    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    document.getElementById('user-display-name').textContent = displayName;

    const userHouseholds = JSON.parse(localStorage.getItem('households')) || [];
    if (userHouseholds.length === 0) {
        document.querySelector('.dashboard-main').classList.add('ready');
        return;
    }

    const lastHouseholdId = localStorage.getItem('lastHouseholdId');
    let selectedHousehold = userHouseholds.find(h => h.householdId == lastHouseholdId);
    if (!selectedHousehold) {
        selectedHousehold = userHouseholds[0];
    }

    populateHouseholdDropdown(userHouseholds, selectedHousehold.householdId);
    setupHouseholdDropdownHandler();

    await loadPetsForHousehold(selectedHousehold.householdId);
    document.querySelector('.dashboard-main').classList.add('ready');
}