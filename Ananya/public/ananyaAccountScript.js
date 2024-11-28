
// This function checks the database connection and updates its status on the frontend.
async function checkDbConnection() {
    const statusElem = document.getElementById('dbStatus');
    const loadingGifElem = document.getElementById('loadingGif');

    const response = await fetch('/check-db-connection', {
        method: "GET"
    });

    // Hide the loading GIF once the response is received.
    loadingGifElem.style.display = 'none';
    // Display the statusElem's text in the placeholder.
    statusElem.style.display = 'inline';

    response.text()
        .then((text) => {
            statusElem.textContent = text;
        })
        .catch((error) => {
            statusElem.textContent = 'connection timed out';  // Adjust error handling if required.
        });
}





async function userDetails() {
    const displayNameElement = document.getElementById('displayName');
    const usernameElement = document.getElementById('username');
    const bioElement = document.getElementById('bio');
    const regionElement = document.getElementById('region');
    const countryElement = document.getElementById('country');
    const avatarElement = document.getElementById('avatar');

    const resultResponse = await fetch('/user-details', {
        method: 'GET'
    });

    const responseData = await resultResponse.json();
    const responseContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (regionElement.innerHTML) {regionElement.innerHTML = '';}
    if (displayNameElement.innerHTML) {displayNameElement.innerHTML = '';}
    if (bioElement.innerHTML) {bioElement.innerHTML = '';}
    if (usernameElement.innerHTML) {usernameElement.innerHTML = '';}
    if (countryElement.innerHTML) {countryElement.innerHTML = '';}
    if (avatarElement.innerHTML) {avatarElement.innerHTML = '';}

    console.log(responseContent);

    displayNameElement.innerHTML = "Display Name: " + responseContent[0][0];
    usernameElement.innerHTML = "Username: " + responseContent[0][1];
    bioElement.innerHTML = "Bio: " + responseContent[0][2];
    regionElement.innerHTML = "Region: " + responseContent[0][3];
    countryElement.innerHTML = "Country: " + responseContent[0][4];
    avatarElement.innerHTML = "Avatar: " + responseContent[0][5];
}



window.onload = function() {
    checkDbConnection();
    userDetails();
    // initialize();
    // displayRegionAndAvatarOptions();
    // document.getElementById("createAccountTable").addEventListener("submit", insertUserAccount);
    // document.getElementById("resetDemotable").addEventListener("click", resetDemotable);
    // document.getElementById("insertDemotable").addEventListener("submit", insertDemotable);
    // document.getElementById("updataNameDemotable").addEventListener("submit", updateNameDemotable);
    // document.getElementById("countDemotable").addEventListener("click", countDemotable);
};

// // General function to initiate all tables
// function initialize() {
//     fetchAndDisplayUsers();
// }