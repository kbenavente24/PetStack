import { apiCall } from './utils.js';

document.addEventListener('DOMContentLoaded', function() {
    console.log('Households Loaded!');
    setUpPage();
});


    async function setUpPage(){

        try{

            const response = await apiCall('/api/users/me', {
                method: 'GET'
            })

            console.log('get method worked');

            const households = response.households;
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
            setUpJoinHouseholdButton();
            document.querySelector('.dashboard-main').classList.add('ready');
        } catch (error){
            alert('Failed to get households! Please contact site developer.');
        }
        
    }

    function individualHouseholdBehavior(household){
        document.getElementById('households-content').classList.add('hidden');
        const individualHouseholdContent = document.getElementById('individual-household-content');
        individualHouseholdContent.classList.remove('hidden');
        individualHouseholdContent.innerHTML = '';
        document.getElementById('welcome-message').textContent = household.householdName;

        // Household profile picture
        const circle = document.createElement('div');
        circle.className = 'household-profile-picture';
        individualHouseholdContent.appendChild(circle);

        // Invite code
        const inviteCode = document.createElement('p');
        inviteCode.className = 'invite-code';
        inviteCode.textContent = `Invite Code: ${household.inviteCode}`;
        individualHouseholdContent.appendChild(inviteCode);

        // Tab toggle container
        const tabContainer = document.createElement('div');
        tabContainer.className = 'tab-toggle';

        const membersTab = document.createElement('button');
        membersTab.className = 'tab-btn active';
        membersTab.textContent = 'Members';
        membersTab.dataset.tab = 'members';

        const petsTab = document.createElement('button');
        petsTab.className = 'tab-btn';
        petsTab.textContent = 'Pets';
        petsTab.dataset.tab = 'pets';

        tabContainer.appendChild(membersTab);
        tabContainer.appendChild(petsTab);
        individualHouseholdContent.appendChild(tabContainer);

        // List container
        const listContainer = document.createElement('ul');
        listContainer.className = 'household-list';
        listContainer.id = 'household-list';
        individualHouseholdContent.appendChild(listContainer);

        // Show members by default
        renderMembersList(listContainer, household);

        // Tab click handlers
        membersTab.addEventListener('click', () => {
            membersTab.classList.add('active');
            petsTab.classList.remove('active');
            renderMembersList(listContainer, household);
        });

        petsTab.addEventListener('click', () => {
            petsTab.classList.add('active');
            membersTab.classList.remove('active');
            renderPetsList(listContainer, household);
        });
    }

    async function renderMembersList(container, household) {
        container.innerHTML = '';

        try {
            const members = await apiCall(`/api/householdmember/${household.householdId}`);

            if (members.length === 0) {
                container.innerHTML = '<li class="list-empty">No members yet</li>';
                return;
            }

            members.forEach((member, index) => {
                const li = document.createElement('li');
                li.className = 'list-item';

                // First member is always the current user (sorted that way by backend)
                const isCurrentUser = index === 0;
                const displayName = isCurrentUser ? `${member.displayName} (You)` : member.displayName;

                li.innerHTML = `
                    <span class="list-item-icon">${member.profilePicture || '👤'}</span>
                    <span class="list-item-name">${displayName}</span>
                    <span class="list-item-badge">${member.userRole}</span>
                `;
                container.appendChild(li);
            });
        } catch (error) {
            console.error('Failed to load members:', error);
            container.innerHTML = '<li class="list-empty">Failed to load members</li>';
        }
    }

    async function renderPetsList(container, household) {
        container.innerHTML = '';

        // Add Pet button
        const addPetLi = document.createElement('li');
        addPetLi.className = 'list-action-btn';
        addPetLi.innerHTML = `<button class="btn btn-primary btn-full" id="btn-add-pet-household">+ Add Pet</button>`;
        container.appendChild(addPetLi);

        addPetLi.querySelector('#btn-add-pet-household').addEventListener('click', () => {
            openModal('addPet', household);
        });

        try {
            const pets = await apiCall(`/api/pets/${household.householdId}`);

            if (pets.length === 0) {
                const emptyLi = document.createElement('li');
                emptyLi.className = 'list-empty';
                emptyLi.textContent = 'No pets yet';
                container.appendChild(emptyLi);
                return;
            }

            pets.forEach(pet => {
                const li = document.createElement('li');
                li.className = 'list-item';
                li.innerHTML = `
                    <span class="list-item-icon">🐾</span>
                    <span class="list-item-name">${pet.petName}</span>
                    <span class="list-item-badge">${pet.petSpecies || 'Pet'}</span>
                `;
                container.appendChild(li);
            });
        } catch (error) {
            console.error('Failed to load pets:', error);
            const errorLi = document.createElement('li');
            errorLi.className = 'list-empty';
            errorLi.textContent = 'Failed to load pets';
            container.appendChild(errorLi);
        }
    }

    function setUpCreateHouseholdButton(){
        const createHouseholdButton = document.getElementById('create-household-btn');
        createHouseholdButton.addEventListener('click', (e) => {
            openModal('create');
        });
    }

    function setUpJoinHouseholdButton(){
        const joinHouseholdButton = document.getElementById('join-household-btn');
        joinHouseholdButton.addEventListener('click', (e) => {
            openModal('join');
        })
    }



    function openModal(contentType, household = null){
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
                data.role = "Creator";
            try {
                const household = await apiCall('/api/household', {
                    method: 'POST',
                    body: JSON.stringify(data)
                });

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

        if(contentType === "join"){
            content.innerHTML = `
            <h2 class="text-center">Join a Household</h2>
            <p class="text-small mb-md">Each household is provided a unique invite code. If you were shared one, paste or enter it below!</p>
            <form id="join-household-form">
                <label>Invite Code</label>
                <input type="text" name="inviteCode" required>
                <button type="submit" class="modal-btn">Confirm</button>
            </form>
            `;

        const form = document.getElementById('join-household-form');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const data = Object.fromEntries(new FormData(form));
            data.role = "Member";
        try {
            const household = await apiCall('/api/householdmember', {
                method: 'POST',
                body: JSON.stringify(data)
            });

            //HOUSEHOLD CREATED SUCCESSFULLY--CLOSE THE MODAL
            document.getElementById('modal-overlay').classList.add('hidden');
            const grid = document.getElementById('households-grid');
            const circle = document.createElement('div');
            circle.className = 'household-circle';
            circle.textContent = household.householdName;
            circle.addEventListener('click',(e) => {
                document.getElementById('household-page-btns').classList.add("hidden");
                individualHouseholdBehavior(household);
            })
            grid.appendChild(circle);        
            } catch (error) {
                console.error('Failed to :', error);
            }
        });
        document.getElementById('modal-overlay').classList.remove('hidden');
        }

        if(contentType === 'addPet'){
            content.innerHTML = `
            <h2 class="text-center">Add a Pet</h2>
            <p class="text-small mb-md">Add a new pet to ${household.householdName}.</p>
            <form id="add-pet-form">
                <label>Your Pet's Name</label>
                <input type="text" name="petName" required>
                <label>Type of Pet</label>
                <select name="petSpecies" required>
                    <option value="" disabled selected>Select one</option>
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Bird">Bird</option>
                    <option value="Rabbit">Rabbit</option>
                    <option value="Fish">Fish</option>
                    <option value="Reptile">Reptile</option>
                </select>
                <button type="submit" class="modal-btn">Add Pet</button>
            </form>
            `;

            const form = document.getElementById('add-pet-form');
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const data = Object.fromEntries(new FormData(form));
                data.householdId = household.householdId;

                try {
                    const pet = await apiCall('/api/pets', {
                        method: 'POST',
                        body: JSON.stringify(data)
                    });

                    // Close modal and refresh pets list
                    document.getElementById('modal-overlay').classList.add('hidden');
                    const listContainer = document.getElementById('household-list');
                    renderPetsList(listContainer, household);
                } catch (error) {
                    console.error('Failed to add pet:', error);
                }
            });
            document.getElementById('modal-overlay').classList.remove('hidden');
        }

    }

