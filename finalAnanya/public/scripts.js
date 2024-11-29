/*
 * These functions below are for various webpage functionalities. 
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 * 
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your 
 *   backend endpoints 
 * and 
 *   HTML structure.
 * 
 */


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

// This function resets or initializes the demotable.
async function resetAllTables() {
    const response = await fetch("/initiate-demotable", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetResultMsg');
        messageElement.textContent = "demotable initiated successfully!";
        fetchTableData();
    } else {
        alert("Error initiating table!");
    }
}

async function fetchAndDisplayTable(getRequest) {
    const tableElement = document.getElementById(getRequest);
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch(getRequest, {
        method: 'GET'
    });

    const responseData = await response.json();
    const tableContent = responseData.data;
    // console.log(`premiumplantable content: ${tableContent}`)

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    tableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}


// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    checkDbConnection();
    fetchTableData();
    document.getElementById("resetDemotable").addEventListener("click", resetAllTables);
};

// General function to refresh the displayed table data.
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {

    fetchAndDisplayTable('servertable');
    fetchAndDisplayTable('premiumplantable');
    fetchAndDisplayTable('calendartable');
    fetchAndDisplayTable('useraccounttable');
    fetchAndDisplayTable('channeltable');
    fetchAndDisplayTable('generalmembertable');
    fetchAndDisplayTable('eventtable');
    fetchAndDisplayTable('administratortable');
    fetchAndDisplayTable('messagetable');
    fetchAndDisplayTable('postedtotable');
    fetchAndDisplayTable('joinstable');
}
