// Activity management functions

var globalPetId = null;

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
    document.getElementById('addActivityModal').style.display = 'block';
}

// Close modal
function closeAddActivityModal() {
    document.getElementById('addActivityModal').style.display = 'none';
}

async function submitAddActivity() {
    const activityType = document.getElementById('activityType').value.trim();
    const activityNotes = document.getElementById('activityNotes').value.trim();

    if (!activityType) {
        document.getElementById('addActivityMessage').textContent = "Activity type required.";
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
        const response = await fetch('/users/createNotesAndActivities', {
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

        if (result.error) {
            document.getElementById('addActivityMessage').textContent = result.error;
            return;
        }

        // Close modal
        closeAddActivityModal();

        // Refresh activity list
        getActivities(globalPetId);

    } catch (err) {
        console.error(err);
        document.getElementById('addActivityMessage').textContent = "Failed to add activity.";
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
        ${latestActivity.activity_date} @ ${latestActivity.activity_time}<br><br>
        ${latestActivity.activity_notes || 'No notes'}
    `;

    // Fill scrollable activity list
    const listContainer = document.getElementById('activityList');
    listContainer.innerHTML = '';

    data.forEach((act, index) => {
        const item = document.createElement('div');
        item.className = 'activity-item';

        item.innerHTML = `
            <strong>${act.activity_type}</strong>
            <div style="font-size:13px; color:#666;">
                ${act.activity_date} @ ${act.activity_time}
            </div>
        `;

        // Clicking shows that activity on top
        item.onclick = () => {
            document.getElementById('selectedActivity').innerHTML = `
                <strong>${act.activity_type}</strong><br>
                ${act.activity_date} @ ${act.activity_time}<br><br>
                ${act.activity_notes || 'No notes'}
            `;
        };

        listContainer.appendChild(item);
    });
}