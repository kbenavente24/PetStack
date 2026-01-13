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

    // Your code will go here
    // Example: fetchPets(), setupEventListeners(), etc.
});

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
