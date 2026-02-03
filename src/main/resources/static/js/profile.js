document.addEventListener('DOMContentLoaded', function() {
    console.log('Profile page loaded!');
    setupProfilePage();
});

function setupProfilePage() {
    // Display the user's name
    const displayName = localStorage.getItem('displayName') || 'User';
    document.getElementById('profile-display-name').textContent = displayName;

    // Sign out button
    const signOutBtn = document.getElementById('btn-sign-out');
    signOutBtn.addEventListener('click', handleSignOut);

    // Change display name button
    const changeNameBtn = document.getElementById('btn-change-display-name');
    changeNameBtn.addEventListener('click', openChangeNameModal);

    // Modal close button
    const closeModalBtn = document.getElementById('modal-close');
    closeModalBtn.addEventListener('click', closeModal);
}

function handleSignOut() {
    // Clear all user data from localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('displayName');
    localStorage.removeItem('households');

    // Redirect to login page
    window.location.href = 'login.html';
}

function openChangeNameModal() {
    const content = document.getElementById('modal-content');
    const currentName = localStorage.getItem('displayName') || '';

    content.innerHTML = `
        <h2 class="text-center">Change Display Name</h2>
        <p class="text-small mb-md">This is the name other household members will see.</p>
        <form id="change-name-form">
            <label>New Display Name</label>
            <input type="text" name="displayName" value="${currentName}" required>
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
    const userId = localStorage.getItem('userId');

    if (!newDisplayName) {
        alert('Please enter a display name');
        return;
    }

    // TODO: Add API endpoint to update display name on the backend
    // For now, just update localStorage
    localStorage.setItem('displayName', newDisplayName);
    document.getElementById('profile-display-name').textContent = newDisplayName;

    closeModal();
}

function closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
}
