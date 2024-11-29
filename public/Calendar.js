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

/////////////////////////////////////////////// GLOBALS ///////////////////////////////////////////////
let urlParam = new URLSearchParams(window.location.search); // TODO: global var to retrieve passed in calendar id
//let selectedCalendarID = urlParam.get('calendarid'); TODO: for use when connecting
let selectedCalendarID = null;

let eventDates = []; // global array stores all the events associated to current calendar
let eventsOnDate = []; // global array stores all events associated to current calendar + day
let reminderList = document.getElementById("reminderList");


/////////////////////////////////////////////////////// Event ///////////////////////////////////////////////////////

async function getEventDateTime(event) {
    event.preventDefault();

    selectedCalendarID = document.getElementById('filterCalendarID').value;
    fetchEventonDate();


    const idValue = selectedCalendarID;
    const messageElement = document.getElementById("EventDateResultMsg");

    const response = await fetch("/fetch-EventDates", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            selectedCalendar: idValue
        })
    });

    const responseData = await response.json();

    const dateTuple = responseData.data;

    eventDates = []; // clear out event dates global array
    dateTuple.forEach(date => {
        date.forEach((ind, field) => {
            eventDates.push(ind);
        });
    });

    for (let i = 0; i < eventDates.length; i++) {
        console.log(eventDates[i]);
    }
    console.log(eventDates.length);

    messageElement.textContent = `Retrieved events: ${dateTuple}`;
    makeCalendar(currMonth, currYear); // reload calendar since events may be updated
}


async function getEventsOnDate() {

    const yearValue = selectedDate.getFullYear();
    const monthValue = selectedDate.getMonth() + 1; // MONTH IS 0 INDEX
    const dateValue = selectedDate.getDate();
    const calID = selectedCalendarID;

    const response = await fetch("/fetch-EventsOnDate", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            selectedCalendar: calID,
            selectedYear: yearValue,
            selectedMonth: monthValue,
            selectedDate: dateValue
        })
    });

    const responseData = await response.json();
    const dateTuple = responseData.data;

    //Note: array is in following order [EventId, EventName, EventDateTime, Duration, Details]

    eventsOnDate = []; // make temp array
    dateTuple.forEach(date => {
        date.forEach((ind, field) => {
            eventsOnDate.push(ind);
        });
    });

    for (let i = 0; i < eventsOnDate.length; i++) {
        console.log(eventsOnDate[i]);
    }
    console.log('events on date' + eventsOnDate.length);
    console.log('calendar ymd: ' + calID + " " + yearValue + monthValue + dateValue);

    fetchDailyEvent(); //this is called to update display after getting events filtered by date
}

function toDatetimeLocal(dateTime) {
    const date = new Date(dateTime);

    const pad = (num) => String(num).padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

async function updateEvent(listItem, eventID, eventNameInput, eventDateTimeInput, durationInput, detailsInput, usernameInput) {
    const response = await fetch('/update-event-details', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            EventID: eventID,
            EventName: eventNameInput,
            EventDateTime: eventDateTimeInput,
            Duration: durationInput,
            Details: detailsInput,
            Username: usernameInput
        })
    });

    const responseData = await response.json();
    if (responseData.success) {
        const updateSuccessMsg = document.createElement('p')
        updateSuccessMsg.textContent = 'Successfully updated Event details!';
        updateSuccessMsg.className = 'successMsg'
        listItem.appendChild(updateSuccessMsg)
    } else {
        const updateSuccessMsg = document.createElement('p')
        updateSuccessMsg.textContent = 'Error updating Event details';
        updateSuccessMsg.className = 'successMsg'
        listItem.appendChild(updateSuccessMsg)
    }
}

async function displayEditForm(listItem, eventID) {
    //TODO:  IF THERE IS ALREADY A FORM, REMOVE PREV FORM
    // const lastChild = listItem.lastChild
    // if (lastChild.className === 'editEventForm' || lastChild.className === 'successMsg') {
    //     lastChild.remove()
    // }
    // GET EVENT DETAILS
    const response = await fetch('/edit-event-details', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            EventID: eventID,
        })
    });

    const responseData = await response.json();
    const eventDetailsData = responseData.EventDetails;
    console.log(eventDetailsData);

    const usernamesResponse = await fetch('/usernames', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const usernamesResponseData = await usernamesResponse.json();
    const usernamesRaw = usernamesResponseData.data;
    // console.log(usernamesRaw);

    const usernames = []
    for (const row of usernamesRaw) {
        usernames.push(row[0]);
    }
    console.log(`usernames: ${usernames}`)


    // CREATE EDIT FORM WITH PRE-EXISTING INFORMATION
    const eventName = eventDetailsData[0][0];
    const eventDateTime = eventDetailsData[0][1];
    const eventDuration = eventDetailsData[0][2];
    const eventDetails = eventDetailsData[0][3];
    const eventUsername = eventDetailsData[0][4];
    console.log(`name ${eventName} \n datetime ${eventDateTime} \n duration ${eventDuration} \n details ${eventDetails}`)

    // p; Edit Event with ID:
    const editEventMsg = document.createElement('h4')
    editEventMsg.textContent = `Edit Event ${eventID}`;

    const editEventForm = document.createElement('form');
    editEventForm.id = `editEventForm`;
    editEventForm.classname = 'editEventForm'

    // EventName
    const eventNameLabel = document.createElement('label')
    eventNameLabel.textContent = "Event Name: ";
    eventNameLabel.for = 'newEventName'
    const eventNameInput = document.createElement('input')
    eventNameInput.type = 'text'
    eventNameInput.value = eventName;
    eventNameInput.id = 'newEventName'
    editEventForm.appendChild(eventNameLabel);
    editEventForm.appendChild(eventNameInput);
    editEventForm.appendChild(document.createElement('br'));

    // EventDateTime
    const eventDateTimeLabel = document.createElement('label')
    eventDateTimeLabel.textContent = "Event DateTime: ";
    eventDateTimeLabel.for = 'newEventDateTime'
    const eventDateTimeInput = document.createElement('input')
    eventDateTimeInput.type = 'datetime-local'
    console.log(`TRY : ${toDatetimeLocal(eventDateTime)}`)
    eventDateTimeInput.value = toDatetimeLocal(eventDateTime);
    eventDateTimeInput.id = 'newEventDateTime'
    editEventForm.appendChild(eventDateTimeLabel);
    editEventForm.appendChild(eventDateTimeInput);
    editEventForm.appendChild(document.createElement('br'));

    // Duration
    const durationLabel = document.createElement('label')
    durationLabel.textContent = "Duration (hrs): ";
    durationLabel.for = 'newDuration'
    const durationInput = document.createElement('input')
    durationInput.type = 'number'
    durationInput.value = eventDuration;
    durationInput.id = 'newDuration'
    editEventForm.appendChild(durationLabel);
    editEventForm.appendChild(durationInput);
    editEventForm.appendChild(document.createElement('br'));

    // Details
    const detailsLabel = document.createElement('label')
    detailsLabel.textContent = "Details: "
    detailsLabel.for = 'newDetails'
    const detailsInput = document.createElement('input')
    detailsInput.type = 'text'
    detailsInput.value = eventDetails;
    detailsInput.id = 'newDuration'
    editEventForm.appendChild(detailsLabel);
    editEventForm.appendChild(detailsInput);
    editEventForm.appendChild(document.createElement('br'));

    // Usernames
    const usernameLabel = document.createElement('label')
    usernameLabel.textContent = 'Username'
    usernameLabel.for = 'usernameInput'
    const usernameSelect = document.createElement('select')
    usernameSelect.id = 'usernameInput'
    const defaultUsername = eventUsername;
    const defaultUsernameOption = document.createElement('option');
    defaultUsernameOption.textContent = defaultUsername;
    defaultUsernameOption.value = defaultUsername;
    usernameSelect.appendChild(defaultUsernameOption);

    for (const username of usernames) {
        if (username !== defaultUsername) {
            const usernameOption = document.createElement('option');
            usernameOption.value = username;
            usernameOption.textContent = username;
            usernameSelect.appendChild(usernameOption);
        }
    }
    editEventForm.appendChild(usernameLabel);
    editEventForm.appendChild(usernameSelect);
    editEventForm.appendChild(document.createElement('br'));

    const usernameInput = document.querySelector('#usernameInput');
    // console.log(`usernameinput : ${usernameInput.value}`)

    // Update button
    const updateBtn = document.createElement('button')
    updateBtn.className = 'updateBtn'
    updateBtn.textContent = 'Update';
    updateBtn.addEventListener('click', function () {
        console.log('updateEvent: ', eventNameInput.value, eventDateTimeInput.value, durationInput.value, detailsInput.value, usernameInput.value)
        updateEvent(listItem, eventID, eventNameInput.value, eventDateTimeInput.value, durationInput.value, detailsInput.value, usernameInput.value);
    })


    listItem.appendChild(editEventMsg);
    listItem.appendChild(editEventForm);
    listItem.appendChild(updateBtn);
    // editEvent(eventID);
}

function displayReminders() {
    reminderList.innerHTML = "";
    for (let i = 0; i < eventsOnDate.length/5; i++) {
        let eventID = eventsOnDate[i*5];                          // Access EventID
        let eventTitle = eventsOnDate[(i*5) + 1];                 // Access EventName
        let eventDate = new Date(eventsOnDate[(i*5) + 2]);  // Access EventDateTime
        let eventHours = eventsOnDate[(i*5) + 3];                  // Access EventDuration
        let eventText = `<strong>${eventTitle}</strong> -
            ${eventHours} hour event on
            ${eventDate.toLocaleDateString()}`;
        // let eventText = `<strong>${eventsOnDate[i]}</strong>`;
        let listItem = document.createElement("li");
        listItem.innerHTML = eventText;

        // Add a delete button for each reminder item
        let editButton =
            document.createElement("button");
        editButton.className = "edit-event";
        editButton.textContent = "Edit";
        // editButton.addEventListener('click', displayEditForm)
        editButton.onclick = function () {
            displayEditForm(listItem, eventID);
        };

        listItem.appendChild(editButton);
        reminderList.appendChild(listItem);
    }
    console.log("called print reminders");
}

function editEvent(eventID) {
    //


    //TODO: link directs away from here to an edit event page, passing in eventID being edited
    console.log(`this event is: ` + eventID);
}


///////////////////////////////////// Standalone delete function ////////////////////////////////////

// below function executes upon clicking the delete button on the edit event page

async function deleteButton(event) {
    event.preventDefault();
    await deleteEvent(eventID); //TODO: pass in appropriate eventID + add eventlistener to the button in the window section
}


async function deleteEvent(eventID) {
    const response = await fetch('/delete-event', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            eventID: eventID
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('deleteResultMsg');


    if (responseData.success) {
        messageElement.textContent = "Event deleted successfully!";
        //TODO: remove event from page
    } else {
        messageElement.textContent = "Error deleting event!";
    }
}



/////////////////////////////////////////////////// CALENDAR ///////////////////////////////////////////////////////


const calendarDates = document.querySelector('.calendar-dates');
const monthYear = document.getElementById('monthYear');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');

let selectedDate = new Date();
let currMonth = selectedDate.getMonth();
let currYear = selectedDate.getFullYear();

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];


function makeCalendar(month, year) {
    calendarDates.innerHTML = '';
    monthYear.textContent = `${months[month]} ${year}`;

    // Get the first day and number days in month
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Fill blanks before day 1
    for (let i = 0; i < firstDay; i++) {
        const blank = document.createElement('div');
        calendarDates.appendChild(blank);
    }

    // Fill calendar active month
    for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement('div');
        day.textContent = i;


        // Tags to add for currently selected day and days containing events
        if (i === selectedDate.getDate() && year === selectedDate.getFullYear() && month === selectedDate.getMonth()) {
            day.classList.add('current-date');
        } else if (checkEvents(i, month, year)) {
            day.classList.add('Event-date');
        }

        calendarDates.appendChild(day);
    }
}

function checkEvents(date, month, year) {
    return getMatchEventsOnDate(date, month, year).length > 0;
}

function getMatchEventsOnDate(date, month, year) {

    return eventDates.filter(function (event) {
        let singleEventDate = new Date(event);
        return (
            singleEventDate.getDate() === date &&
            singleEventDate.getMonth() === month &&
            singleEventDate.getFullYear() === year
        );
    });
}

calendarDates.addEventListener('click', (e) => {
    if (e.target.textContent !== '') {
        selectedDate = new Date(currYear, currMonth, e.target.textContent);
        makeCalendar(currMonth, currYear); // refresh calendar
        fetchEventonDate();                // refresh event
    }
});

prevMonthBtn.addEventListener('click', () => {
    if (currMonth === 0) {
        currMonth = 11;
        currYear--;
    } else {
        currMonth--;
    }
    makeCalendar(currMonth, currYear);
})

nextMonthBtn.addEventListener('click', () => {
    if (currMonth === 11) {
        currMonth = 0;
        currYear++;
    } else {
        currMonth++;
    }
    makeCalendar(currMonth, currYear);
})


makeCalendar(currMonth, currYear);

/////////////////////////////////////////////////// WINDOWS ///////////////////////////////////////////////////////

// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    checkDbConnection();
    //const urlParam = new URLSearchParams(window.location.search);
    urlParam = new URLSearchParams(window.location.search); // TODO: make sure we call on window load
    selectedCalendarID = urlParam.get('calendarid'); // TODO: try to get calendarid
    document.getElementById("findCalendarID").addEventListener("submit", getEventDateTime)
    document.getElementById('deleteButton').addEventListener("click", deleteButton)
    fetchEventonDate();
    fetchDailyEvent();

};

function fetchDailyEvent() {
    displayReminders();
}

function fetchEventonDate() {
    getEventsOnDate();
}

// function fetchEventTableData() {
//     fetchAndDisplayEvent();
// }
