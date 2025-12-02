// Initialization and authentication

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

// Shared state variables
let currentHouseholdId = null;
let currentUserRole = null;
let previousView = 'householdView';

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