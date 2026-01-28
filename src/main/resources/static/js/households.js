document.addEventListener('DOMContentLoaded', function() {
    console.log('Households Loaded!');
    setUpPage();
});


    function setUpPage(){
        const households = JSON.parse(localStorage.getItem('households'));
        const grid = document.createElement('div');
        grid.className = 'households-grid';
        grid.id = 'households-grid';
        const pageContent = document.getElementById('households-content');

        households.forEach(household => {
            const circle = document.createElement('div');
            circle.className = 'household-circle';
            circle.textContent = household.householdName;

            circle.addEventListener('click',(e) => {
                document.getElementById('household-page-btns').classList.add("hidden");
                individualHouseholdBehavior(household);
            })
            grid.appendChild(circle);
        });

        pageContent.appendChild(grid);
        setUpCreateHouseholdButton();
    }

    function individualHouseholdBehavior(household){
        document.getElementById('households-content').classList.add('hidden');
        const individualHouseholdContent = document.getElementById('individual-household-content');
        individualHouseholdContent.classList.remove('hidden');
        individualHouseholdContent.innerHTML = '';
        const circle = document.createElement('div');
        circle.className = 'household-profile-picture';
        individualHouseholdContent.append(circle);
        document.getElementById('welcome-message').textContent = household.householdName;

        const inviteCode = document.createElement('p');
        inviteCode.textContent = `Invite Code: ${household.inviteCode}`
        individualHouseholdContent.appendChild(inviteCode);

    }

    function setUpCreateHouseholdButton(){
        const createHouseholdButton = document.getElementById('create-household-btn');
        createHouseholdButton.addEventListener('click', (e) => {
            openModal('create');
        });
    }



    function openModal(contentType){
        const content = document.getElementById('modal-content');
        const closeModalButton = document.getElementById('modal-close');
        closeModalButton.addEventListener('click', (e) => {
            document.getElementById('modal-overlay').classList.add('hidden');
        });

        if(contentType === 'create'){
            document.getElementById('modal-overlay').classList.remove('hidden'); 
            content.innerHTML = `
            <h2 class="text-center">Create a Household</h2>
            <p class="text-small mb-md">Households are groups of PetStack members that can collaboratively log activities for your pets. Once your household is created, you will be provided an invite code that you can then share with others!</p>
            <form id="create-household-form">
                <label>Your household's name</label>
                <input type="text" name="householdName" required>
                <button type="submit" class="modal-btn">Confirm</button>
            </form>
            `;

            const form = document.getElementById('create-household-form');
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const data = Object.fromEntries(new FormData(form));
                data.userId = localStorage.getItem('userId');
                data.role = "Creator";
            try {
                const household = await apiCall('/api/household', {
                    method: 'POST',
                    body: JSON.stringify(data)
                });

            const existingHouseholds = JSON.parse(localStorage.getItem('households'));
            existingHouseholds.push(household);
            localStorage.setItem('households', JSON.stringify(existingHouseholds));
            console.log(JSON.parse(localStorage.getItem('households')));
            //HOUSEHOLD CREATED SUCCESSFULLY--CLOSE THE MODAL
            document.getElementById('modal-overlay').classList.add('hidden');
            const grid = document.getElementById('households-grid');
            const circle = document.createElement('div');
            circle.className = 'household-circle';
            circle.textContent = household.householdName;
            grid.appendChild(circle);

            circle.addEventListener('click',(e) => {
                document.getElementById('household-page-btns').classList.add("hidden");
                individualHouseholdBehavior(household);
            })
            } catch (error) {
                console.error('Failed to :', error);
            }
         });     

                   
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
