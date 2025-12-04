// Navigation and view management

// Navigation function
function navigateTo(section) {
    // If navigating to account, redirect to server-rendered page
    if (section === 'account') {
        const userId = dataInfo.user.userId;
        window.location.href = `/account/info?user_id=${userId}`;
        return;
    }

    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));

    // Hide all views (including activity view to ensure clean navigation)
    document.getElementById('householdView').style.display = 'none';
    document.getElementById('petView').style.display = 'none';
    document.getElementById('allPetsView').style.display = 'none';
    document.getElementById('accountView').style.display = 'none';
    document.getElementById('activityView').style.display = 'none';

    // Show selected view
    if (section === 'households') {
        document.getElementById('navHouseholds').classList.add('active');
        document.getElementById('householdView').style.display = 'block';
        document.getElementById('pageTitle').textContent = 'Your Households';
    } else if (section === 'pets') {
        document.getElementById('navPets').classList.add('active');
        document.getElementById('allPetsView').style.display = 'block';
        document.getElementById('pageTitle').textContent = 'All Your Pets';
        loadAllPets();
    }
}

// Go back to households view
function showHouseholds() {
    document.getElementById('petView').style.display = 'none';
    document.getElementById('activityView').style.display = 'none';
    document.getElementById('householdView').style.display = 'block';
}

// Go back to previous pets view
function showPets() {
    document.getElementById('activityView').style.display = 'none';
    document.getElementById('householdView').style.display = 'none';
    document.getElementById('petView').style.display = 'none';
    document.getElementById('allPetsView').style.display = 'none';

    // Show the previous view
    document.getElementById(previousView).style.display = 'block';
}