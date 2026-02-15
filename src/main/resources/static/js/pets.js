import { apiCall } from './utils.js';
import { showModal, hideModal, setModalContent } from './modals.js';
import { loadActivitiesForPet, displayActivityLog } from './activities.js';

export async function loadPetsForHousehold(householdId) {
    try {
        const pets = await apiCall(`/api/pets/${householdId}`);

        const emptyState = document.getElementById('empty-state');
        const activeState = document.getElementById('active-state');
        document.getElementById('welcome-message').classList.add('hidden');
        if (emptyState) emptyState.style.display = 'none';
        if (activeState) activeState.classList.remove('hidden');

        localStorage.setItem('lastHouseholdId', householdId);

        if (pets.length > 0) {
            const lastPetId = localStorage.getItem('lastPetId');
            let selectedPet = pets.find(p => p.petId == lastPetId);
            if (!selectedPet) {
                selectedPet = pets[0];
            }

            populatePetDropdown(pets, selectedPet.petId);
            setupPetDropdownHandler(householdId);

            updatePetAvatar(selectedPet.petName);

            localStorage.setItem('petId', selectedPet.petId);
            localStorage.setItem('lastPetId', selectedPet.petId);
            await loadActivitiesForPet(householdId, selectedPet.petId);
        } else {
            const petDropdown = document.getElementById('pet-dropdown');
            petDropdown.innerHTML = '<option>No pets yet</option>';
            updatePetAvatar('No Pet');
            document.getElementById('activity-log').innerHTML = '';
        }
    } catch (error) {
        console.error('Failed to load pets:', error);
    }
}

export function populatePetDropdown(pets, selectedPetId) {
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

export function setupPetDropdownHandler(householdId) {
    const petDropdown = document.getElementById('pet-dropdown');
    if (!petDropdown) return;

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

export function updatePetAvatar(petName) {
    const petProfilePicture = document.getElementById('pet-avatar-name');
    if (petProfilePicture) {
        petProfilePicture.textContent = petName;
    }
}

export function addPetCardFunctionality(onPetAdded) {
    const addPetButton = document.getElementById('btn-add-pet');
    addPetButton.addEventListener('click', () => {
        showAddPetModal(onPetAdded);
    });
}

function showAddPetModal(onPetAdded) {
    setModalContent(`
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
    `);

    showModal();

    const form = document.getElementById('add-pet-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(form));
        data.userId = localStorage.getItem('userId');
        data.householdId = JSON.parse(localStorage.getItem('households'))[0].householdId;

        try {
            await apiCall('/api/pets', {
                method: 'POST',
                body: JSON.stringify(data)
            });

            showFirstPetAddedModal(onPetAdded);
        } catch (error) {
            console.error('Failed to add pet:', error);
        }
    });
}

function showFirstPetAddedModal(onPetAdded) {
    setModalContent(`
        <h2 class="text-center">Your pet has been added!</h2>
        <p class="text-small mb-md">What would you like to do next?</p>
        <button type="click" class="modal-btn" id="start-logging-activities">Start logging activities</button>
        <button type="click" class="modal-btn btn-secondary">Invite others</button>
    `);
    document.getElementById('modal-close').classList.add('hidden');

    document.getElementById('start-logging-activities').addEventListener('click', async () => {
        hideModal();
        document.getElementById('modal-close').classList.remove('hidden');

        if (onPetAdded) {
            await onPetAdded();
        }
    });
}
