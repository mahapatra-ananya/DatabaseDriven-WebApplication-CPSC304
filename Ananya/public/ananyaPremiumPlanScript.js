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

// async function displayAllPlans() {
//     // event.preventDefault();
//
//     const tableElement = document.getElementById('allPlans');
//     const tableBody = tableElement.querySelector('tbody');
//
//     const response = await fetch('/allPlans', {
//         method: 'GET'
//     });
//
//     const responseData = await response.json();
//     const demotableContent = responseData.data;
//
//     // Always clear old, already fetched data before new fetching process.
//     if (tableBody) {
//         tableBody.innerHTML = '';
//     }
//
//     demotableContent.forEach(user => {
//         const row = tableBody.insertRow();
//         // const radioCell = row.insertCell(0);
//         // radioCell.
//         user.forEach((field, index) => {
//             const cell = row.insertCell(index);
//             cell.textContent = field;
//         });
//     });
// }

async function displayAllPlansProject(event) {
    event.preventDefault();

    const tableElement = document.getElementById('viewTablePlans');
    const tableBody = tableElement.querySelector('tbody');
    // const tableHead = tableElement.querySelector('thead');

    const planIDElem = document.getElementById('planID');
    const tierElem = document.getElementById('tier');
    const paymIntElem = document.getElementById('paymentInterval');
    const membLimElem = document.getElementById('memberLimit');
    const themeElem = document.getElementById('theme');
    const bpElem = document.getElementById('basePrice');
    const subsPayElem = document.getElementById('subscriptionPayment');

    const response = await fetch('project-plans', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            pID: planIDElem.checked,
            tier: tierElem.checked,
            pI: paymIntElem.checked,
            mL: membLimElem.checked,
            theme: themeElem.checked,
            bP: bpElem.checked,
            sP: subsPayElem.checked
        })
    });

    // let head = [];
    //
    // if (planIDElem.checked) {
    //     head.push("Plan ID");
    // }
    // if (tierElem.checked) {
    //     head.push("Tier");
    // }
    // if (paymIntElem.checked) {
    //     head.push("Payment Interval");
    // }
    // if (membLimElem.checked) {
    //     head.push("Member Limit");
    // }
    // if (themeElem.checked) {
    //     head.push("Theme");
    // }
    // if (bpElem.checked) {
    //     head.push("Base Price");
    // }
    // if (subsPayElem.checked) {
    //     head.push("Subscription Payment");
    // }

    const responseData = await response.json();
    const demotableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }
    // if (tableHead) {
    //     tableHead.innerHTML = '';
    // }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        // const radioCell = row.insertCell(0);
        // radioCell.
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
    //
    // head.forEach(user => {
    //     const row = tableHead.insertRow();
    //     // const radioCell = row.insertCell(0);
    //     // radioCell.
    //     user.forEach((field, index) => {
    //         const cell = row.insertCell(index);
    //         cell.textContent = field;
    //     });
    // });
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
    displaySelectOptions();
    // initialize();
    // banner();
    // fetchAndDisplayServers();
    // adminOrCreate();
    // premiumOrNot();
    currentPlan();
    // displayAllPlans();
    document.getElementById("purchasePlan").addEventListener("submit", purchasePremiumPlan);
    document.getElementById("viewPlans").addEventListener("submit", displayAllPlansProject);
    // document.getElementById("displayServers").addEventListener("click", resetDemotable);
    // document.getElementById("insertDemotable").addEventListener("submit", insertDemotable);
    // document.getElementById("updataNameDemotable").addEventListener("submit", updateNameDemotable);
    // document.getElementById("countDemotable").addEventListener("click", countDemotable);
};


