// get stored user
let userID = localStorage.getItem('userData');
let dataInfo = JSON.parse(userID);
console.log(dataInfo.user.userId);

async function getHouseholds() {

    let userId = dataInfo.user.userId;

    if (!userId) {
        alert("Please enter a user_id");
        return;
    }

    try {
        const response = await fetch(`/users/viewhouseholds?user_id=${userId}`);
        const data = await response.json();

        //for loop it for options
        console.log(data[0].household_id);

        getPets(data[0].household_id);

    } catch (err) {
        console.error(err);
    }
}

async function getPets(houseHoldId) {
    try {
        const response = await fetch(`/users/viewPets?household_id=${houseHoldId}`);
        const data = await response.json();

        //for loop it for options
        console.log(data);
        console.log(data[0].pet_id);
        viewActivities(data[0].pet_id);

    } catch (err) {
        console.error(err);
    }
}

async function viewActivities(petId) {
    try {
        const response = await fetch(`/users/viewNotesAndActivities?pet_id=${petId}`);
        const data = await response.json();

        //for loop it for options
        console.log(data);

    } catch (err) {
        console.error(err);
    }
}

getHouseholds();