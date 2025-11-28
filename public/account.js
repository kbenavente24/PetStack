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

        console.log(data);

    } catch (err) {
        console.error(err);
    }
}

getHouseholds();