/**
 * PetStack Frontend JavaScript
 *
 * This file will handle:
 * - Fetching data from your Spring Boot API
 * - Updating the page with that data
 * - Handling user interactions (form submissions, button clicks)
 */

// Wait for the page to fully load before running any JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('PetStack loaded!');

    // Set up form handlers based on which page we're on
    setupSignupForm();
    setupLoginForm();
    setupDashboard();
});

/**
 * Sets up the signup form submission handler
 * Only runs if the signup form exists on the current page
 */
function setupSignupForm() {
    const form = document.getElementById('signup-form');

    // If there's no signup form on this page, do nothing
    if (!form) return;

    form.addEventListener('submit', async function(event) {
        // IMPORTANT: Prevent the browser's default form behavior
        // Without this, the page would refresh and lose all data
        event.preventDefault();

        // Gather values from the form inputs
        // The 'id' attribute on each <input> lets us find them
        const email = document.getElementById('email').value;
        const displayName = document.getElementById('displayName').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validate passwords match BEFORE sending to server
        // This is called "client-side validation" - it's faster feedback for the user
        // Note: You should ALSO validate on the server, never trust the client alone
        if (password !== confirmPassword) {
            alert('Passwords do not match. Please try again.');
            return; // Stop here, don't submit to server
        }

        try {
            // Send the data to your backend API
            // This must match what your Spring controller expects
            const user = await apiCall('/api/auth/signup', {
                method: 'POST',
                body: JSON.stringify({
                    email: email,
                    displayName: displayName,
                    password: password
                })
            });

            console.log('User created:', user);

            // Success! Redirect to login page
            // Later you might auto-login instead
            window.location.href = '/login.html';

        } catch (error) {
            // Something went wrong - show the user
            // For now, just an alert. Later you'd show a nicer message
            alert('Signup failed. Please try again.');
            console.error('Signup error:', error);
        }
    });
}

/**
 * Sets up the login form submission handler
 * Only runs if the login form exists on the current page
 */
function setupLoginForm() {
    const form = document.getElementById('login-form');

    if (!form) return;

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await apiCall('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            console.log('Login successful:', response);

            // Store user info in localStorage so we know who's logged in
            // localStorage persists even if you close the browser
            localStorage.setItem('userId', response.userId);
            localStorage.setItem('displayName', response.displayName);

            // After successful login, redirect to the main app
            window.location.href = '/dashboard.html';

        } catch (error) {
            alert('Login failed. Please check your email and password.');
            console.error('Login error:', error);
        }
    });
}

/**
 * Sets up the dashboard page
 * Checks if user is logged in, displays their info, loads their pets
 */
async function setupDashboard() {
    // Check if we're on the dashboard page
    const displayNameElement = document.getElementById('user-display-name');

    if (!displayNameElement) return;  // Not on dashboard, do nothing

    // Check if user is logged in by looking for userId in localStorage
    const userId = localStorage.getItem('userId');
    const displayName = localStorage.getItem('displayName');

    if (!userId) {
        // Not logged in - redirect to login page
        window.location.href = '/login.html';
        return;
    }

    // User is logged in - show their name
    displayNameElement.textContent = displayName;

    // Load the user's pets
    try {
        const pets = await apiCall(`/api/pets/user/${userId}`);
        console.log('User pets:', pets);

        // If user has pets, show them; otherwise show empty state
        if (pets.length > 0) {
            displayPets(pets);
        }
    } catch (error) {
        console.error('Failed to load pets:', error);
    }
}

/**
 * Displays the user's pets on the dashboard
 */
function displayPets(pets) {
    // Hide empty state, show active state
    const emptyState = document.getElementById('empty-state');
    const activeState = document.getElementById('active-state');

    if (emptyState) emptyState.style.display = 'none';
    if (activeState) {
        activeState.style.display = 'block';

        // Build HTML for each pet
        let petsHtml = '<h3>Your Pets</h3><ul class="pets-list">';
        for (const pet of pets) {
            petsHtml += `<li class="pet-item">${pet.petName}</li>`;
        }
        petsHtml += '</ul>';

        activeState.innerHTML = petsHtml;
    }
}

/**
 * Helper function to make API calls to your backend
 *
 * @param {string} endpoint - The API endpoint (e.g., '/api/pets')
 * @param {object} options - Fetch options (method, body, etc.)
 * @returns {Promise} - The JSON response from the server
 *
 * Usage examples:
 *   const pets = await apiCall('/api/pets');
 *   const newPet = await apiCall('/api/pets', { method: 'POST', body: JSON.stringify({...}) });
 */
async function apiCall(endpoint, options = {}) {
    // Set default headers for JSON
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // Merge default options with provided options
    const fetchOptions = { ...defaultOptions, ...options };

    try {
        const response = await fetch(endpoint, fetchOptions);

        // Check if the request was successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse and return JSON response
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}
