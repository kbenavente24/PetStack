import { apiCall } from './utils.js';
import { setupActivityButtons, setupDateDisplay } from './activities.js';
import { loadPetsForHousehold } from './pets.js';
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

    const token = localStorage.getItem('token');
    const displayName = localStorage.getItem('displayName');

    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    document.getElementById('user-display-name').textContent = displayName;


    try {
        const getUserForHouseholds = await apiCall('/api/users/me', {
            method: 'GET'
        });

        if(getUserForHouseholds.households.length === 0){
            document.querySelector('.dashboard-main').classList.add('ready');
            return;        
        }
    
        populateHouseholdDropdown(getUserForHouseholds.households, getUserForHouseholds.households[0].householdId);
        setupHouseholdDropdownHandler();

        await loadPetsForHousehold(getUserForHouseholds.households[0].householdId);
        document.querySelector('.dashboard-main').classList.add('ready');

    } catch (error){
        alert('Failed to get user information');    
    }

}