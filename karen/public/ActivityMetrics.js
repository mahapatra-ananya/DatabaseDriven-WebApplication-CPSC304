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


async function fetchAndDisplayBusyUser(event) {

    event.preventDefault();

    const tableElement = document.getElementById('UserTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/fetch-BusyUser', {
        method: 'GET'
    });

    const responseData = await response.json();
    const busyUser = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    busyUser.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// Inserts new records into the demotable.
async function insertMonthlyLimit(event) {
    event.preventDefault();

    const tableElement = document.getElementById('MonthTable');
    const tableBody = tableElement.querySelector('tbody');

    const limitValue = document.getElementById('insertMonthlyLimit').value;

    const response = await fetch('/fetch-BusyMonth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userLimit: limitValue
        })
    });

    const responseData = await response.json();
    const MonthTable = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    MonthTable.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}


let eventList = []; //global to store list of events returned
let selectedCalendarIDs = []; // global to store list of calendars requested

async function updateCalendarsRequested(event) {
    event.preventDefault();
    selectedCalendarIDs = []; // refresh array each click

    const Calendar1 = document.getElementById('calendar1').value;
    const Calendar2 = document.getElementById('calendar2').value;
    const Calendar3 = document.getElementById('calendar3').value;

    if (Calendar1) {
        selectedCalendarIDs.push(Calendar1);
    }
    if (Calendar2) {
        selectedCalendarIDs.push(Calendar2);
    }
    if (Calendar3) {
        selectedCalendarIDs.push(Calendar3);
    }
    getSharedEventsArray();
}

function makeSharedEventsQuery() {

    const qstart = 'SELECT a.EventID, a.EventName, a.EventDateTime FROM Event a RIGHT JOIN (SELECT EventID FROM PostedTo MINUS SELECT EventID FROM (SELECT * FROM (SELECT DISTINCT EventID FROM PostedTo) CROSS JOIN (SELECT CalendarID FROM Calendar WHERE CalendarID =';
    const qspacer = 'OR CalendarID =';
    const qend = ') MINUS SELECT EventID, CalendarID FROM PostedTo)) b ON a.EventID = b.EventID ORDER BY EventID';

    let query = `${qstart}`;

    if (selectedCalendarIDs.length > 0) {
        for (i = 0; i < selectedCalendarIDs.length; i++) {
            if (i === selectedCalendarIDs.length - 1) {
                query = `${query} ${selectedCalendarIDs[i]}`;
            } else {
                query = `${query} ${selectedCalendarIDs[i]} ${qspacer}`;
            }
        }
        query = `${query} ${qend}`;
    } else {
        query = 'SELECT EventID, EventName, EventDateTime FROM Event WHERE EventID = 0';
    }
    return(query);
}

async function getSharedEventsArray() {

    const query = makeSharedEventsQuery();

    const response = await fetch("/fetch-SharedEvents", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: query
        })
    });

    const responseData = await response.json();
    const MonthTable = responseData.data;


    eventList = []; // clear out event dates global array
    MonthTable.forEach(id => {
        id.forEach((ind, field) => {
            eventList.push(ind);
        });
    });

    for (let i = 0; i < eventList.length; i++) {
        console.log(eventList[i]);
    }
    console.log(eventList.length);
    fetchselectedEvents();

}



// global for event list html
let eventListDisplay = document.getElementById("eventList");

function displayEvents() {
    eventListDisplay.innerHTML = "";
    for (let i = 0; i < eventList.length/3; i++) {
        let eventID = eventList[i*3];                          // Access EventID
        let eventTitle = eventList[(i*3) + 1];                 // Access EventName
        let eventDate = new Date(eventList[(i*3) + 2]);  // Access EventDateTime
        let eventText = `<strong>${eventTitle}</strong> -
            held on
            ${eventDate.toLocaleDateString()}`;
        let listItem = document.createElement("li");
        listItem.innerHTML = eventText;
        eventListDisplay.appendChild(listItem);
    }
    console.log("called print events");
    console.log(eventListDisplay);
}


// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    checkDbConnection();
    getSharedEventsArray();
    fetchselectedEvents();
    //insertEventtable();


    //displayBusyUser();
    //insertMonthlyLimit();

    document.getElementById("showUserTable").addEventListener("submit", fetchAndDisplayBusyUser);
    document.getElementById("selectCalendarNum").addEventListener("submit", updateCalendarsRequested);
    document.getElementById("insertLimit").addEventListener("submit", insertMonthlyLimit);

};

function fetchselectedEvents() {
    displayEvents();
}

// function displayBusyUser() {
//     fetchAndDisplayBusyUser();
// }
