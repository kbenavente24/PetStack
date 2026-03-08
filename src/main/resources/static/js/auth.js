import { apiCall } from './utils.js';

document.addEventListener('DOMContentLoaded', function() {
    setupSignupForm();
    setupLoginForm();
});

function setupSignupForm() {
    const form = document.getElementById('signup-form');
    if (!form) return;

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const displayName = document.getElementById('displayName').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            alert('Passwords do not match. Please try again.');
            return;
        }

        try {
            const user = await apiCall('/api/auth/signup', {
                method: 'POST',
                body: JSON.stringify({
                    email: email,
                    displayName: displayName,
                    password: password
                })
            });

            console.log('User created:', user);
            window.location.href = '/login.html';

        } catch (error) {
            alert('Signup failed. Please try again.');
            console.error('Signup error:', error);
        }
    });
}

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

            localStorage.setItem('token', response.token);
            localStorage.setItem('userId', response.user.userId);
            localStorage.setItem('displayName', response.user.displayName);
            localStorage.setItem('households', JSON.stringify(response.user.households));

            window.location.href = '/dashboard.html';

        } catch (error) {
            alert('Login failed. Please check your email and password.');
            console.error('Login error:', error);
        }
    });
}