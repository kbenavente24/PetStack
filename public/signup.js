// Get references to form elements and sections
const signupForm = document.getElementById('signupForm');
const displayNameForm = document.getElementById('displayNameForm');
const messageArea = document.getElementById('messageArea');
const signupSection = document.getElementById('signupSection');
const displayNameSection = document.getElementById('displayNameSection');
const successSection = document.getElementById('successSection');

// Handle signup form submission (Step 1: Create account)
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Collect form data
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirm_password = document.getElementById('confirm_password').value;

    try {
        // Send signup request to backend API
        const response = await fetch('/users/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, confirm_password })
        });

        const data = await response.json();

        // If signup successful, move to display name section
        if (data.success) {
            signupSection.style.display = 'none';
            displayNameSection.style.display = 'block';
            // Store user ID for the next step
            document.getElementById('userId').value = data.userId;
        } else {
            // Display error message if signup failed
            showMessage(data.error);
        }
    } catch (error) {
        // Handle network or server errors
        showMessage('Network error. Please try again.');
    }
});

// Handle display name form submission (Step 2: Set display name)
displayNameForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get user ID and display name
    const user_id = document.getElementById('userId').value;
    const display_name = document.getElementById('display_name').value;

    try {
        // Send display name to backend API
        const response = await fetch('/users/set-displayname', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id, display_name })
        });

        const data = await response.json();

        // If successful, show success section with user info
        if (data.success) {
            displayNameSection.style.display = 'none';
            successSection.style.display = 'block';

            // Display personalized welcome message
            document.getElementById('welcomeMessage').textContent = `Welcome, ${data.user.displayName}!`;
        } else {
            // Display error message if setting display name failed
            showMessage(data.error);
        }
    } catch (error) {
        // Handle network or server errors
        showMessage('Network error. Please try again.');
    }
});

// Helper function to display messages to the user
function showMessage(text) {
    messageArea.textContent = text;
    messageArea.style.display = 'block';
}
