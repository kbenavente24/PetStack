// Activity management functions

var globalPetId = null;

// Format the date and time to user-friendly format
function formatDateTime(dateStr, timeStr) {
    try {
        // Handle null or undefined values
        if (!dateStr || !timeStr) {
            return 'Date/Time unavailable';
        }

        // If dateStr includes timestamp, extract just the date part
        if (dateStr.includes('T')) {
            dateStr = dateStr.split('T')[0];
        }

        // If timeStr has timezone info, extract just the time part
        if (timeStr.includes('+') || timeStr.includes('-')) {
            timeStr = timeStr.split(/[+-]/)[0];
        }

        // Ensure timeStr is in HH:MM:SS format (add seconds if missing)
        const timeParts = timeStr.split(':');
        if (timeParts.length === 2) {
            timeStr = `${timeStr}:00`;
        }

        // Combine date and time strings and create Date object
        const date = new Date(`${dateStr}T${timeStr}`);

        // Check if date is valid
        if (isNaN(date.getTime())) {
            console.error('Invalid date:', dateStr, timeStr);
            return 'Invalid date';
        }

        // Format date
        const dateOptions = {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        };

        // Format time
        const timeOptions = {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        };

        const formattedDate = date.toLocaleDateString('en-US', dateOptions);
        const formattedTime = date.toLocaleTimeString('en-US', timeOptions);

        return `${formattedDate} at ${formattedTime}`;
    } catch (error) {
        console.error('Error formatting date/time:', error, 'dateStr:', dateStr, 'timeStr:', timeStr);
        return 'Format error';
    }
}

// Load activities for a pet
async function getActivities(petId, fromView = null) {
    globalPetId = petId;
    if (fromView) {
        previousView = fromView;
        // Update back button text based on where we came from
        const backButton = document.getElementById('activityBackButton');
        if (fromView === 'petView') {
            backButton.textContent = '← Back to Household';
        } else if (fromView === 'allPetsView') {
            backButton.textContent = '← Back to Pets';
        }
    }
    try {
        const response = await fetch(`/users/viewNotesAndActivities?pet_id=${petId}`);
        const data = await response.json();

        displayActivity(data);

    } catch (err) {
        console.error(err);
    }
}

function openAddActivityModal() {
    document.getElementById('addActivityModal').classList.add('show');
    document.getElementById('addActivityMessage').className = 'modal-message';
    // Clear form
    document.getElementById('activityType').value = '';
    document.getElementById('activityNotes').value = '';
}

// Close modal
function closeAddActivityModal() {
    document.getElementById('addActivityModal').classList.remove('show');
}

async function submitAddActivity() {
    const activityType = document.getElementById('activityType').value.trim();
    const activityNotes = document.getElementById('activityNotes').value.trim();
    const messageDiv = document.getElementById('addActivityMessage');

    if (!activityType) {
        messageDiv.textContent = "Activity type required.";
        messageDiv.className = 'modal-message error';
        return;
    }

    // You already have the pet loaded — stored in data[0]
    let userData = localStorage.getItem('userData');
    let dataInfo = JSON.parse(userData);
    const userId = dataInfo.user.userId;

    // Generate today's date/time
    const now = new Date();
    const activity_date = now.toISOString().slice(0, 10);  // YYYY-MM-DD
    const activity_time = now.toTimeString().slice(0, 8);  // HH:MM:SS

    try {
        const response = await fetch('/users/addActivity', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                pet_id: globalPetId,
                activity_type: activityType,
                activity_date,
                activity_time,
                activity_notes: activityNotes
            })
        });

        const result = await response.json();

        if (!response.ok || result.error) {
            messageDiv.textContent = result.error || 'Failed to add activity';
            messageDiv.className = 'modal-message error';
            return;
        }

        // Close modal
        closeAddActivityModal();

        // Refresh activity list
        getActivities(globalPetId);

    } catch (err) {
        console.error('Error adding activity:', err);
        messageDiv.textContent = "Failed to add activity. Please try again.";
        messageDiv.className = 'modal-message error';
    }
}

// Display activity view
function displayActivity(data) {
    document.getElementById('householdView').style.display = 'none';
    document.getElementById('petView').style.display = 'none';
    document.getElementById('allPetsView').style.display = 'none';
    document.getElementById('activityView').style.display = 'block';

    console.log("Activity Data:", data);

    // Check if we have data and if the first row has an activity (activity_id is not null)
    if (!data || data.length === 0 || !data[0].activity_id) {
        // Still show pet name and owner notes even if no activities
        if (data && data.length > 0) {
            document.getElementById('activityPetName').textContent = data[0].pet_name;
            document.getElementById('ownerNotes').textContent = data[0].owner_notes || 'No notes available.';
        }
        document.getElementById('selectedActivity').innerHTML = '<div>No activity selected.</div>';
        document.getElementById('activityList').innerHTML =
            '<div>No activities found.</div>';
        return;
    }

    const petName = data[0].pet_name;
    const ownerNotes = data[0].owner_notes;

    // Set pet name and owner notes on top
    document.getElementById('activityPetName').textContent = petName;
    document.getElementById('ownerNotes').textContent = ownerNotes || 'No notes available.';

    // Default "selected activity" = most recent activity
    const latestActivity = data[0];
    document.getElementById('selectedActivity').innerHTML = `
        <strong>${latestActivity.activity_type}</strong><br>
        ${formatDateTime(latestActivity.activity_date, latestActivity.activity_time)}<br><br>
        ${latestActivity.activity_notes || 'No notes'}
    `;

    // Fill scrollable activity list
    const listContainer = document.getElementById('activityList');
    listContainer.innerHTML = '';

    data.forEach((act) => {
        const item = document.createElement('div');
        item.className = 'activity-item';

        // Formatted date in activities table
        const formattedDate = act.activity_date.split("T")[0];

        item.innerHTML = `
            <strong>${act.activity_type}</strong>
            <div class="inner-activity-text">
                ${formatDateTime(act.activity_date, act.activity_time)}
            </div>
        `;

        // Clicking shows that activity on top
        item.onclick = () => {
            document.getElementById('selectedActivity').innerHTML = `
                <strong>${act.activity_type}</strong><br>
                ${formatDateTime(act.activity_date, act.activity_time)}<br><br>
                ${act.activity_notes || 'No notes'}
            `;
        };

        listContainer.appendChild(item);
    });
}

// Open last activity search modal
function openLastActivityModal() {
    document.getElementById('lastActivityModal').classList.add('show');
    document.getElementById('lastActivityMessage').className = 'modal-message';
    document.getElementById('lastActivityMessage').textContent = 'Enter an activity type to find when it last occurred for this pet.';
    document.getElementById('lastActivityTypeInput').value = '';
    document.getElementById('lastActivityResultModal').innerHTML = 'Search results will appear here...';
}

// Close last activity search modal
function closeLastActivityModal() {
    document.getElementById('lastActivityModal').classList.remove('show');
}

// Submit last activity search
async function submitLastActivitySearch() {
    const activityType = document.getElementById('lastActivityTypeInput').value.trim();
    const resultDiv = document.getElementById('lastActivityResultModal');
    const messageDiv = document.getElementById('lastActivityMessage');

    if (!activityType) {
        messageDiv.textContent = 'Please enter an activity type.';
        messageDiv.className = 'modal-message error';
        return;
    }

    if (!globalPetId) {
        messageDiv.textContent = 'No pet selected.';
        messageDiv.className = 'modal-message error';
        return;
    }

    // Reset message
    messageDiv.className = 'modal-message';
    messageDiv.textContent = 'Searching...';

    try {
        const response = await fetch(`/activities/last?pet_id=${globalPetId}&activity_type=${encodeURIComponent(activityType)}`);
        const result = await response.json();

        if (!response.ok || result.error) {
            messageDiv.textContent = result.error || 'Activity not found';
            messageDiv.className = 'modal-message error';
            resultDiv.innerHTML = `<span style="color: rgb(255 165 198);">No ${activityType} activity found for this pet.</span>`;
            return;
        }

        // Display the result
        messageDiv.textContent = 'Search complete!';
        messageDiv.className = 'modal-message';
        resultDiv.innerHTML = `
            <strong style="font-size: 18px;">Last ${activityType}:</strong><br><br>
            <div style="font-size: 16px;">
                 ${formatDateTime(result.activity_date, result.activity_time)}<br>
                 Logged by: <strong>${result.user_name}</strong>
            </div>
        `;

    } catch (err) {
        console.error('Error looking up last activity:', err);
        messageDiv.textContent = 'Failed to lookup activity. Please try again.';
        messageDiv.className = 'modal-message error';
        resultDiv.innerHTML = '<span style="color: rgb(255 165 198);">An error occurred while searching.</span>';
    }
}