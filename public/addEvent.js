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

/////////////////////////////////////////////////////////////////////////////////////////
//
// // TODO: grab pieces and use in updateEvent
// async function updateNameCalendartable(event) {
//     event.preventDefault();
//
//     const oldNameValue = document.getElementById('updateOldName').value;
//     const newNameValue = document.getElementById('updateNewName').value;
//
//     const response = await fetch('/update-name-Calendartable', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             oldName: oldNameValue,
//             newName: newNameValue
//         })
//     });
//
//     const responseData = await response.json();
//     const messageElement = document.getElementById('updateNameResultMsg');
//
//     if (responseData.success) {
//         messageElement.textContent = "Name updated successfully!";
//         fetchCalendarTableData();
//     } else {
//         messageElement.textContent = "Error updating name!";
//     }
// }

// Fetches data from the calendar table and displays it.
async function fetchAndDisplayEvent() {
    const tableElement = document.getElementById('Eventtable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/Eventtable', {
        method: 'GET'
    });

    const responseData = await response.json();
    const EventtableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    EventtableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// Inserts new records into the demotable.
async function insertEventtable(event) {
    event.preventDefault();

    const idValue = document.getElementById('insertEventId').value;
    const nameValue = document.getElementById('insertEventName').value;
    const datetimeValue = document.getElementById('insertEventTime').value;
    const durationValue = document.getElementById('insertEventDuration').value;
    const detailsValue = document.getElementById('insertEventDetail').value;
    const EventUsernameValue = document.getElementById('insertEventUserName').value;

    const response = await fetch('/insert-Eventtable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            EventID: idValue,
            EventName: nameValue,
            EventDateTime: datetimeValue,
            Duration: durationValue,
            Details: detailsValue,
            EventUsername: EventUsernameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('EventinsertResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Event Data inserted successfully!";
        fetchEventTableData();
    } else {
        messageElement.textContent = "Error inserting Event data!";
    }
}


// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    checkDbConnection();

    // fetchCalendarTableData();
    fetchEventTableData();

    // document.getElementById("resetAllTables").addEventListener("click", resetAllTables);
    // document.getElementById("insertCalendartable").addEventListener("submit", insertCalendartable);
    // document.getElementById("updataNameCalendartable").addEventListener("submit", updateNameCalendartable);
    // document.getElementById("countCalendartable").addEventListener("click", countCalendartable);

    //document.getElementById("resetEventtable").addEventListener("click", resetEventtable);
    document.getElementById("insertEventtable").addEventListener("submit", insertEventtable);
    // document.getElementById("countEventtable").addEventListener("click", countEventtable);

    // document.getElementById("findCalendarID").addEventListener("submit", getEventDates);
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
// function fetchCalendarTableData() {
//     fetchAndDisplayCalendar();
// }
//
function fetchEventTableData() {
    fetchAndDisplayEvent();
}
