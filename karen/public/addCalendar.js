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

// Fetches data from the calendar table and displays it.
async function fetchAndDisplayCalendar() {
    const tableElement = document.getElementById('Calendartable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/Calendartable', {
        method: 'GET'
    });

    const responseData = await response.json();
    const CalendartableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    CalendartableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}


// Inserts new records into the demotable.
async function insertCalendartable(event) {
    event.preventDefault();

    const idValue = document.getElementById('insertCalendarId').value;
    const nameValue = document.getElementById('insertCalendarName').value;
    const UsernameValue = document.getElementById('insertUserName').value;

    const response = await fetch('/insert-Calendartable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            CalendarID: idValue,
            CalendarName: nameValue,
            UserName: UsernameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Data inserted successfully!";
        fetchCalendarTableData();
    } else {
        messageElement.textContent = "Error inserting data!";
    }
}



// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    checkDbConnection();

    fetchCalendarTableData();

    document.getElementById("insertCalendartable").addEventListener("submit", insertCalendartable);

};

// General function to refresh the displayed table data.
// You can invoke this after any table-modifying operation to keep consistency.
function fetchCalendarTableData() {
    fetchAndDisplayCalendar();
}
