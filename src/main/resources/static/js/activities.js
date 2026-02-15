import { apiCall, getDayRange, formatTime12Hour, getActivityIcon } from './utils.js';
import { showModal, hideModal, setModalContent } from './modals.js';

export function setupActivityButtons() {
    const buttons = document.querySelectorAll('.activity-btn');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const activityType = button.dataset.type;
            showLogActivityConfirmation(activityType);
        });
    });
}

export function showLogActivityConfirmation(activityType) {
    const petDropdown = document.getElementById('pet-dropdown');
    const petName = petDropdown.options[petDropdown.selectedIndex]?.text || 'your pet';
    const currentTime = new Date();
    const timeString = currentTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    const activityVerbs = {
        'FED': 'was fed',
        'WALKED': 'went for a walk',
        'PEE': 'peed',
        'POOP': 'pooped'
    };
    const activityVerb = activityVerbs[activityType] || activityType.toLowerCase();

    setModalContent(`
        <h2 class="text-center">Log Activity</h2>
        <p class="text-center mb-md">Log that <strong>${petName}</strong> ${activityVerb} @ ${timeString}?</p>
        <div class="edit-activity-options">
            <button class="modal-btn" id="btn-confirm-log">Confirm</button>
            <button class="modal-btn btn-secondary" id="btn-cancel-log">Back</button>
        </div>
    `);

    document.getElementById('btn-confirm-log').addEventListener('click', async () => {
        hideModal();
        await logActivity(activityType);
    });

    document.getElementById('btn-cancel-log').addEventListener('click', () => {
        hideModal();
    });

    showModal();
}

export async function logActivity(activityType) {
    const userId = localStorage.getItem('userId');
    const petId = localStorage.getItem('petId');
    const householdDropdown = document.getElementById('household-dropdown');
    const householdId = householdDropdown ? householdDropdown.value : localStorage.getItem('lastHouseholdId');
    const activityTimestamp = new Date().toISOString();
    const { start, end } = getDayRange(new Date());

    await apiCall(`/api/activity`, {
        method: 'POST',
        body: JSON.stringify({
            userId: userId,
            petId: petId,
            activityType: activityType,
            activityTimestamp: activityTimestamp
        })
    });

    const activities = await apiCall(`/api/activity/pet?start=${start}&end=${end}&householdId=${householdId}&userId=${userId}&petId=${petId}`);
    displayActivityLog(activities);
}

export function displayActivityLog(activities) {
    const activityLog = document.getElementById('activity-log');
    activityLog.innerHTML = '';

    for (const activity of activities) {
        const log = document.createElement('li');
        log.className = 'activity-entry';

        if (activity.loggedByUserId === parseInt(localStorage.getItem('userId'), 10)) {
            const editBtn = document.createElement('button');
            editBtn.className = 'activity-edit-btn';
            editBtn.textContent = '📝';
            editBtn.addEventListener('click', () => {
                showEditActivityModal(activity);
            });
            log.appendChild(editBtn);
        }

        const icon = getActivityIcon(activity.activityType);
        const text = document.createElement('span');

        if (activity.activityType == "FED") {
            text.textContent = `${activity.petName} was fed by ${activity.loggedByName} @ ${formatTime12Hour(activity.activityTimestamp)}`;
        }
        if (activity.activityType == "WALKED") {
            text.textContent = `${activity.petName} walked with ${activity.loggedByName} @ ${formatTime12Hour(activity.activityTimestamp)}`;
        }
        if (activity.activityType == "POOP") {
            text.textContent = `${activity.petName} pooped with ${activity.loggedByName} @ ${formatTime12Hour(activity.activityTimestamp)}`;
        }
        if (activity.activityType == "PEE") {
            text.textContent = `${activity.petName} peed with ${activity.loggedByName} @ ${formatTime12Hour(activity.activityTimestamp)}`;
        }

        log.appendChild(icon);
        log.appendChild(text);
        activityLog.prepend(log);
    }
}

export async function loadActivitiesForPet(householdId, petId) {
    const userId = localStorage.getItem('userId');
    const today = new Date();
    const { start, end } = getDayRange(today);

    try {
        const activities = await apiCall(`/api/activity/pet?start=${start}&end=${end}&householdId=${householdId}&userId=${userId}&petId=${petId}`);
        displayActivityLog(activities);
    } catch (error) {
        console.error('Failed to load activities:', error);
    }
}

export async function refreshActivityLog() {
    const householdDropdown = document.getElementById('household-dropdown');
    const householdId = householdDropdown ? householdDropdown.value : localStorage.getItem('lastHouseholdId');
    const petId = localStorage.getItem('petId');
    const userId = localStorage.getItem('userId');

    const dateSpan = document.getElementById('activity-date');
    const displayedDate = new Date(dateSpan.textContent);
    const { start, end } = getDayRange(displayedDate);

    const activities = await apiCall(`/api/activity/pet?start=${start}&end=${end}&householdId=${householdId}&userId=${userId}&petId=${petId}`);
    displayActivityLog(activities);
}

export function setupDateDisplay() {
    const dateSpan = document.getElementById('activity-date');
    if (!dateSpan) return;

    const rememberCurrentDay = new Date();
    const today = new Date();
    dateSpan.textContent = today.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    const previousDayButton = document.getElementById('date-prev');
    const nextDayButton = document.getElementById('date-next');

    previousDayButton.addEventListener('click', async () => {
        today.setDate(today.getDate() - 1);
        const { start, end } = getDayRange(today);
        const householdDropdown = document.getElementById('household-dropdown');
        const householdId = householdDropdown ? householdDropdown.value : localStorage.getItem('lastHouseholdId');

        const changedActivityLog = await apiCall(`/api/activity/pet?start=${start}&end=${end}&householdId=${householdId}&userId=${localStorage.getItem('userId')}&petId=${localStorage.getItem('petId')}`);

        dateSpan.textContent = today.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
        displayActivityLog(changedActivityLog);
    });

    nextDayButton.addEventListener('click', async () => {
        if (today.toDateString() === rememberCurrentDay.toDateString()) {
            return;
        }
        today.setDate(today.getDate() + 1);
        const { start, end } = getDayRange(today);
        const householdDropdown = document.getElementById('household-dropdown');
        const householdId = householdDropdown ? householdDropdown.value : localStorage.getItem('lastHouseholdId');

        const changedActivityLog = await apiCall(`/api/activity/pet?start=${start}&end=${end}&householdId=${householdId}&userId=${localStorage.getItem('userId')}&petId=${localStorage.getItem('petId')}`);
        dateSpan.textContent = today.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
        displayActivityLog(changedActivityLog);
    });
}

function showEditActivityModal(activity) {
    function showEditOptions() {
        setModalContent(`
            <h2 class="text-center">Edit Activity</h2>
            <p class="text-small mb-md">What would you like to do with this activity?</p>
            <div class="edit-activity-options">
                <button class="modal-btn btn-danger" id="btn-delete-activity">Delete Activity</button>
                <button class="modal-btn" id="btn-change-time">Change Time</button>
                <button class="modal-btn" id="btn-change-type">Change Activity Type</button>
            </div>
            <div id="edit-activity-form-container"></div>
        `);
        attachEditListeners();
    }

    function showDeleteConfirmation() {
        setModalContent(`
            <h2 class="text-center">Delete Activity</h2>
            <p class="text-small mb-md">Are you sure you want to delete this activity? This cannot be undone.</p>
            <div class="edit-activity-options">
                <button class="modal-btn btn-danger" id="btn-confirm-delete">Yes, Delete</button>
                <button class="modal-btn btn-secondary" id="btn-back">Back</button>
            </div>
        `);

        document.getElementById('btn-confirm-delete').addEventListener('click', async () => {
            try {
                await apiCall(`/api/activity/${activity.activityId}?userId=${localStorage.getItem('userId')}`, {
                    method: 'DELETE'
                });
                hideModal();
                await refreshActivityLog();
            } catch (error) {
                console.error('Failed to delete activity:', error);
            }
        });

        document.getElementById('btn-back').addEventListener('click', () => {
            showEditOptions();
        });
    }

    function attachEditListeners() {
        document.getElementById('btn-delete-activity').addEventListener('click', () => {
            showDeleteConfirmation();
        });

        document.getElementById('btn-change-time').addEventListener('click', () => {
            const formContainer = document.getElementById('edit-activity-form-container');
            const currentTime = new Date(activity.activityTimestamp);
            const timeValue = currentTime.toTimeString().slice(0, 5);

            formContainer.innerHTML = `
                <form id="change-time-form" class="mt-md">
                    <label>New Time</label>
                    <input type="time" name="newTime" value="${timeValue}" required>
                    <button type="submit" class="modal-btn">Update Time</button>
                </form>
            `;

            document.getElementById('change-time-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const newTime = document.querySelector('input[name="newTime"]').value;

                const originalDate = new Date(activity.activityTimestamp);
                const [hours, minutes] = newTime.split(':');
                originalDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

                try {
                    await apiCall(`/api/activity/${activity.activityId}/time`, {
                        method: 'PUT',
                        body: JSON.stringify({
                            userId: parseInt(localStorage.getItem('userId')),
                            newTimestamp: originalDate.toISOString()
                        })
                    });
                    hideModal();
                    await refreshActivityLog();
                } catch (error) {
                    console.error('Failed to update time:', error);
                    alert('Failed to update time');
                }
            });
        });

        document.getElementById('btn-change-type').addEventListener('click', () => {
            const formContainer = document.getElementById('edit-activity-form-container');
            formContainer.innerHTML = `
                <form id="change-type-form" class="mt-md">
                    <label>New Activity Type</label>
                    <select name="newType" required>
                        <option value="FED" ${activity.activityType === 'FED' ? 'selected' : ''}>Fed</option>
                        <option value="WALKED" ${activity.activityType === 'WALKED' ? 'selected' : ''}>Walked</option>
                        <option value="PEE" ${activity.activityType === 'PEE' ? 'selected' : ''}>Pee</option>
                        <option value="POOP" ${activity.activityType === 'POOP' ? 'selected' : ''}>Poop</option>
                    </select>
                    <button type="submit" class="modal-btn">Update Type</button>
                </form>
            `;

            document.getElementById('change-type-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const newType = document.querySelector('select[name="newType"]').value;

                try {
                    await apiCall(`/api/activity/${activity.activityId}/type`, {
                        method: 'PUT',
                        body: JSON.stringify({
                            userId: parseInt(localStorage.getItem('userId')),
                            newType: newType
                        })
                    });
                    hideModal();
                    await refreshActivityLog();
                } catch (error) {
                    console.error('Failed to update type:', error);
                }
            });
        });
    }

    showEditOptions();
    showModal();
}
