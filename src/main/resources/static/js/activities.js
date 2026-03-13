import { apiCall, getDayRange, formatTime12Hour, getActivityIcon, getOrdinalSuffix } from './utils.js';
import { showModal, hideModal, setModalContent } from './modals.js';


let today = new Date();

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

    const currDate = new Date();
    const petDropdown = document.getElementById('pet-dropdown');
    const petName = petDropdown.options[petDropdown.selectedIndex]?.text || 'your pet';
    const activityVerbs = {
        'FED': 'was fed',
        'WALKED': 'went for a walk',
        'PEE': 'peed',
        'POOP': 'pooped'
    };
    const activityVerb = activityVerbs[activityType] || activityType.toLowerCase();
    const activityIcons = {
        'FED': 'images/food-icon.png',
        'WALKED': 'images/walk-icon.png',
        'PEE': 'images/pee-icon.png',
        'POOP': 'images/poop-icon.png'
    };
    const iconSrc = activityIcons[activityType];

    if(currDate.toISOString().split('T')[0] == today.toISOString().split('T')[0]) {
        const currDate = new Date();
        const timeString = currDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });

        setModalContent(`
            <h2 class="text-center">Log Activity</h2>
            <div class="text-center mb-md"><img src="${iconSrc}" alt="${activityType}" class="modal-activity-icon"></div>
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

    
    } else {
        const date = getOrdinalSuffix(today.getDate());
        setModalContent(`
            <h2 class="text-center">Log Activity For Past Day</h2>
            <div class="text-center mb-md"><img src="${iconSrc}" alt="${activityType}" class="modal-activity-icon"></div>
            <p class="text-center mb-md">Select time that <strong>${petName}</strong> ${activityVerb} on ${today.toLocaleDateString('en-US', { weekday: 'long' })}
            the ${date}</p>
            <form id="past-day-log-form">
                <label>Time</label>
                <input type="time" name="activityTime" required>
                <div class="edit-activity-options">
                    <button type="submit" class="modal-btn" id="btn-confirm-log">Confirm</button>
                    <button type="button" class="modal-btn btn-secondary" id="btn-cancel-log">Back</button>
                </div>
            </form>
        `);

        document.getElementById('past-day-log-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const selectedTime = document.querySelector('input[name="activityTime"]').value;
            const [hours, minutes] = selectedTime.split(':');
            const timestamp = new Date(today);
            timestamp.setHours(parseInt(hours), parseInt(minutes), 0, 0);

            hideModal();
            await logActivity(activityType, timestamp.toISOString());
        });

        document.getElementById('btn-cancel-log').addEventListener('click', () => {
            hideModal();
        });

        showModal();
    }

}

export async function logActivity(activityType, customTimestamp) {
    const petId = document.getElementById('pet-dropdown').value;
    const householdId = document.getElementById('household-dropdown').value;

    const isViewingPastDay = new Date().toISOString().split('T')[0] !== today.toISOString().split('T')[0];
    const activityTimestamp = customTimestamp || new Date().toISOString();
    const { start, end } = getDayRange(isViewingPastDay ? today : new Date());

    await apiCall(`/api/activity`, {
        method: 'POST',
        body: JSON.stringify({
            petId: petId,
            activityType: activityType,
            activityTimestamp: activityTimestamp
        })
    });

    const activities = await apiCall(`/api/activity/pet?start=${start}&end=${end}&householdId=${householdId}&petId=${petId}`);
    displayActivityLog(activities);
}

export function displayActivityLog(activities) {
    const activityLog = document.getElementById('activity-log');
    activityLog.innerHTML = '';

    for (const activity of activities) {
        const log = document.createElement('li');
        log.className = 'activity-entry';

        if (activity.loggedByCurrentUser) {
                const editBtn = document.createElement('button');
                editBtn.className = 'activity-edit-btn';
                const editImg = document.createElement('img');
                editImg.src = 'images/pencil.png';
                editImg.alt = 'Edit';
                editImg.className = 'edit-icon-img';
                editBtn.appendChild(editImg);
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

/*

need to update the day on frontend as well 
*/


export async function loadActivitiesForPet(householdId, petId) {
    today = new Date();
    const { start, end } = getDayRange(today);

    try {
        const activities = await apiCall(`/api/activity/pet?start=${start}&end=${end}&householdId=${householdId}&petId=${petId}`);
        displayActivityLog(activities);
    } catch (error) {
        console.error('Failed to load activities:', error);
    }

    const dateSpan = document.getElementById('activity-date');
    dateSpan.textContent = today.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });


}

export async function refreshActivityLog() {
    const householdId = document.getElementById('household-dropdown').value;
    const petId = document.getElementById('pet-dropdown').value;

    const dateSpan = document.getElementById('activity-date');
    const displayedDate = new Date(dateSpan.textContent);
    const { start, end } = getDayRange(displayedDate);

    const activities = await apiCall(`/api/activity/pet?start=${start}&end=${end}&householdId=${householdId}&petId=${petId}`);
    displayActivityLog(activities);
}

export function setupDateDisplay() {
    const dateSpan = document.getElementById('activity-date');
    if (!dateSpan) return;

    const rememberCurrentDay = new Date();
    today = new Date();
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
        const householdId = document.getElementById('household-dropdown').value;
        const petId = document.getElementById('pet-dropdown').value;

        const changedActivityLog = await apiCall(`/api/activity/pet?start=${start}&end=${end}&householdId=${householdId}&petId=${petId}`);

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
        const householdId = document.getElementById('household-dropdown').value;
        const petId = document.getElementById('pet-dropdown').value;

        const changedActivityLog = await apiCall(`/api/activity/pet?start=${start}&end=${end}&householdId=${householdId}&petId=${petId}`);
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
                await apiCall(`/api/activity/${activity.activityId}`, {
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
            const currentTime = new Date(activity.activityTimestamp);
            const timeValue = currentTime.toTimeString().slice(0, 5);

            setModalContent(`
                <h2 class="text-center">Change Time</h2>
                <form id="change-time-form">
                    <label>New Time</label>
                    <input type="time" name="newTime" value="${timeValue}" required>
                    <div class="edit-activity-options">
                        <button type="submit" class="modal-btn">Update Time</button>
                        <button type="button" class="modal-btn btn-secondary" id="btn-back">Back</button>
                    </div>
                </form>
            `);

            document.getElementById('btn-back').addEventListener('click', () => {
                showEditOptions();
            });

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
            document.querySelector('.edit-activity-options').style.display = 'none';
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
