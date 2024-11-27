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

async function currentPlan() {
    const bannerElem = document.getElementById('ddd');
    const response = await fetch('/premium-or-not', {
        method: "GET"
    });

    const responseData = await response.json();

    if (responseData.success) {
        bannerElem.textContent = 'Your Premium PlanID is: ' + responseData.plan;
    } else {
        bannerElem.textContent = 'Buy a Premium Plan';
    }
}



// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    checkDbConnection();
    // initialize();
    // banner();
    // fetchAndDisplayServers();
    // adminOrCreate();
    // premiumOrNot();
    currentPlan();
    // document.getElementById("createAccountTable").addEventListener("submit", insertUserAccount);
    // document.getElementById("displayServers").addEventListener("click", resetDemotable);
    // document.getElementById("insertDemotable").addEventListener("submit", insertDemotable);
    // document.getElementById("updataNameDemotable").addEventListener("submit", updateNameDemotable);
    // document.getElementById("countDemotable").addEventListener("click", countDemotable);
};
