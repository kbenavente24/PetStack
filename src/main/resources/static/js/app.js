import { setupSignupForm, setupLoginForm } from './auth.js';
import { setupActivityButtons, setupDateDisplay } from './activities.js';
import { loadPetsForHousehold, addPetCardFunctionality } from './pets.js';
import {
    populateHouseholdDropdown,
    setupHouseholdDropdownHandler,
    createHouseholdCardFunctionality,
    joinHouseholdCardFunctionality
} from './dashboard-households.js';

document.addEventListener('DOMContentLoaded', function() {
    console.log('PetStack loaded!');

    setupSignupForm();
    setupLoginForm();
    setupDashboard();
});

async function setupDashboard() {
    const displayNameElement = document.getElementById('user-display-name');
    if (!displayNameElement) return;

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

    const userId = localStorage.getItem('userId');
    const displayName = localStorage.getItem('displayName');

    if (!userId) {
        window.location.href = '/login.html';
        return;
    }

    displayNameElement.textContent = displayName;

    const userHouseholds = JSON.parse(localStorage.getItem('households')) || [];
    if (userHouseholds.length === 0) {
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
}
