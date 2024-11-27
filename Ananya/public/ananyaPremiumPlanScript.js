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
    const bannerElem = document.getElementById('displayPlan');
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

async function purchasePremiumPlan(event) {
    event.preventDefault();

    const purchaseValue = document.getElementById('purchase').value;
    // console.log(purchaseValue);

    const response = await fetch('/purchase-plan', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            purchase: purchaseValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('purchaseMsg');


    if (responseData.success) {
        messageElement.textContent = "Purchase successful!";
    } else {
        messageElement.textContent = "Error purchasing premium plan!";
    }
}

async function displayAllPlans() {
    const tableElement = document.getElementById('allPlans');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/allPlans', {
        method: 'GET'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        // const radioCell = row.insertCell(0);
        // radioCell.
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function displaySelectOptions() {
    const element = document.getElementById('purchase');
    // const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/allPlanIDs', {
        method: 'GET'
    });

    const responseData = await response.json();
    const planContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (element.innerHTML) {
        element.innerHTML = '';
    }

    planContent.forEach(planID => {
        const option = document.createElement('option');
        // button.style.height = '100px';
        // button.style.width = '280px';
        option.textContent = planID;
        element.appendChild(option);
        // containerElement.appendChild(document.createElement('br'));
    });
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
    displayAllPlans();
    document.getElementById("purchasePlan").addEventListener("submit", purchasePremiumPlan);
    // document.getElementById("displayServers").addEventListener("click", resetDemotable);
    // document.getElementById("insertDemotable").addEventListener("submit", insertDemotable);
    // document.getElementById("updataNameDemotable").addEventListener("submit", updateNameDemotable);
    // document.getElementById("countDemotable").addEventListener("click", countDemotable);
};
