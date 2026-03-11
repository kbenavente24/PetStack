import { apiCall } from './utils.js';

let currentDisplayName = '';

document.addEventListener('DOMContentLoaded', function() {
    setupProfilePage();
});

async function setupProfilePage() {
    // Sign out button
    const signOutBtn = document.getElementById('btn-sign-out');
    signOutBtn.addEventListener('click', handleSignOut);

    // Change display name button
    const changeNameBtn = document.getElementById('btn-change-display-name');
    changeNameBtn.addEventListener('click', openChangeNameModal);

    // Modal close button
    const closeModalBtn = document.getElementById('modal-close');
    closeModalBtn.addEventListener('click', closeModal);

    try {
        const user = await apiCall('/api/users/me');
        currentDisplayName = user.displayName;
        document.getElementById('profile-display-name').textContent = currentDisplayName;
    } catch (error) {
        console.error('Failed to load profile:', error);
    }

    document.querySelector('.dashboard-main').classList.add('ready');
}

function handleSignOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('displayName');
    localStorage.removeItem('households');

    window.location.href = 'index.html';
}

function openChangeNameModal() {
    const content = document.getElementById('modal-content');

    content.innerHTML = `
        <h2 class="text-center">Change Display Name</h2>
        <p class="text-small mb-md">This is the name other household members will see.</p>
        <form id="change-name-form">
            <label>New Display Name</label>
            <input type="text" name="displayName" value="${currentDisplayName}" required>
            <button type="submit" class="modal-btn">Save</button>
        </form>
    `;

    document.getElementById('modal-overlay').classList.remove('hidden');

    const form = document.getElementById('change-name-form');
    form.addEventListener('submit', handleChangeDisplayName);
}

async function handleChangeDisplayName(e) {
    e.preventDefault();

    const form = e.target;
    const newDisplayName = form.displayName.value.trim();

    if (!newDisplayName) {
        alert('Please enter a display name');
        return;
    }

    try {
        await apiCall(`/api/users/me/updatename?newDisplayName=${newDisplayName}`, {
            method: 'PUT'
        });

        currentDisplayName = newDisplayName;
        document.getElementById('profile-display-name').textContent = newDisplayName;
        closeModal();
    } catch (error) {
        console.error('Failed to update name:', error);
        alert('Failed to update display name');
    }
}

function closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
}
