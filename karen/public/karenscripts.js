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

//TODO: calendar

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

// This function resets or initializes the demotable.
async function resetAllTables() {
    const response = await fetch("/initiate-AllTables", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetResultMsg');
        messageElement.textContent = "Tables initiated successfully!";
        fetchCalendarTableData();
        fetchEventTableData(); //added to turn calendar reset into global reset
    } else {
        alert("Error initiating Tables!");
    }
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

// Updates names in the calendar table.
async function updateNameCalendartable(event) {
    event.preventDefault();

    const oldNameValue = document.getElementById('updateOldName').value;
    const newNameValue = document.getElementById('updateNewName').value;

    const response = await fetch('/update-name-Calendartable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            oldName: oldNameValue,
            newName: newNameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateNameResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Name updated successfully!";
        fetchCalendarTableData();
    } else {
        messageElement.textContent = "Error updating name!";
    }
}

// Counts rows in the demotable.
// Modify the function accordingly if using different aggregate functions or procedures.
async function countCalendartable() {
    const response = await fetch("/count-Calendartable", {
        method: 'GET'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('countResultMsg');

    if (responseData.success) {
        const tupleCount = responseData.count;
        messageElement.textContent = `The number of tuples in calendar table: ${tupleCount}`;
    } else {
        alert("Error in count calendar table!");
    }
}

//TODO: Event

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

// Counts rows in the demotable.
// Modify the function accordingly if using different aggregate functions or procedures.
async function countEventtable() {
    const response = await fetch("/count-Eventtable", {
        method: 'GET'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('countEventResultMsg');

    if (responseData.success) {
        const tupleCount = responseData.count;
        messageElement.textContent = `The number of tuples in Event table: ${tupleCount}`;
    } else {
        alert("Error in count Event table!");
    }
}

// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    checkDbConnection();

    fetchCalendarTableData();
    fetchEventTableData();

    document.getElementById("resetAllTables").addEventListener("click", resetAllTables);
    document.getElementById("insertCalendartable").addEventListener("submit", insertCalendartable);
    document.getElementById("updataNameCalendartable").addEventListener("submit", updateNameCalendartable);
    document.getElementById("countCalendartable").addEventListener("click", countCalendartable);

    //document.getElementById("resetEventtable").addEventListener("click", resetEventtable);
    document.getElementById("insertEventtable").addEventListener("submit", insertEventtable);
    document.getElementById("countEventtable").addEventListener("click", countEventtable);

};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchCalendarTableData() {
    fetchAndDisplayCalendar();
}

function fetchEventTableData() {
    fetchAndDisplayEvent();
}



/////////////////////////////////////////////////// CALENDAR ///////////////////////////////////////////////////////
const monthYear = document.getElementById("monthYear");
const datesElement = document.getElementById("dates");
const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");

let currDate = new Date();

let testEvent = new Date(currDate.getFullYear(),currDate.getMonth(),20); // use to test event

const updateCalendar = () => {
    const currYear = currDate.getFullYear();
    const currMonth = currDate.getMonth();
    const first = new Date(currYear, currMonth, 0);
    const last = new Date(currYear, currMonth + 1,0)
    const totalDays = last.getDate();

    const firstDayIndex = first.getDay();
    const lastDayIndex = last.getDay();

    const monthYearLabel = currDate.toLocaleString('default', {month: 'long', year: 'numeric'});
    monthYear.textContent = monthYearLabel;


    let datesHTML = '';

    for (let i = firstDayIndex; i > 0; i--) {
        const prevDate = new Date(currYear, currMonth, 0 - i);
        datesHTML += `<div class = "date inactive">${prevDate.getDate()}</div>`;
    }

     for (let i = 0; i < totalDays; i++) {
         const date = new Date(currYear, currMonth, i);
         const activeClass = date.toDateString() === new Date().toDateString() ? 'active' : '';
         datesHTML += `<div class = "date ${activeClass}">${i}</div>`;
     }

    for (let i = 0; i < 7 - lastDayIndex; i++) {
        const nextDate = new Date(currYear,currMonth + 1, i);
        datesHTML += `<div class = "date inactive">${nextDate.getDate()}</div>`;
    }

    datesElement.innerHTML = datesHTML;
}

prevMonth.addEventListener('click', () => {
    currDate.setMonth(currDate.getMonth() - 1);
    updateCalendar();
})

nextMonth.addEventListener('click', () => {
    currDate.setMonth(currDate.getMonth() + 1);
    updateCalendar();
})

updateCalendar();

// TODO: calendar code below
// Define an array to store events
// let events = [];
//
// // letiables to store event input fields and reminder list
// let eventDateInput =
//     document.getElementById("eventDate");
// let eventTitleInput =
//     document.getElementById("eventTitle");
// let eventDescriptionInput =
//     document.getElementById("eventDescription");
// let reminderList =
//     document.getElementById("reminderList");
//
// // Counter to generate unique event IDs
// let eventIdCounter = 1;
//
// // Function to add events
// function addEvent() {
//     let date = eventDateInput.value;
//     let title = eventTitleInput.value;
//     let description = eventDescriptionInput.value;
//
//     if (date && title) {
//         // Create a unique event ID
//         let eventId = eventIdCounter++;
//
//         events.push(
//             {
//                 id: eventId, date: date,
//                 title: title,
//                 description: description
//             }
//         );
//         showCalendar(currentMonth, currentYear);
//         eventDateInput.value = "";
//         eventTitleInput.value = "";
//         eventDescriptionInput.value = "";
//         displayReminders();
//     }
// }
//
// // Function to delete an event by ID
// function deleteEvent(eventId) {
//     // Find the index of the event with the given ID
//     let eventIndex =
//         events.findIndex((event) =>
//             event.id === eventId);
//
//     if (eventIndex !== -1) {
//         // Remove the event from the events array
//         events.splice(eventIndex, 1);
//         showCalendar(currentMonth, currentYear);
//         displayReminders();
//     }
// }
//
// // Function to display reminders
// function displayReminders() {
//     reminderList.innerHTML = "";
//     for (let i = 0; i < events.length; i++) {
//         let event = events[i];
//         let eventDate = new Date(event.date);
//         if (eventDate.getMonth() ===
//             currentMonth &&
//             eventDate.getFullYear() ===
//             currentYear) {
//             let listItem = document.createElement("li");
//             listItem.innerHTML =
//                 `<strong>${event.title}</strong> -
//             ${event.description} on
//             ${eventDate.toLocaleDateString()}`;
//
//             // Add a delete button for each reminder item
//             let deleteButton =
//                 document.createElement("button");
//             deleteButton.className = "delete-event";
//             deleteButton.textContent = "Delete";
//             deleteButton.onclick = function () {
//                 deleteEvent(event.id);
//             };
//
//             listItem.appendChild(deleteButton);
//             reminderList.appendChild(listItem);
//         }
//     }
// }
//
// // Function to generate a range of
// // years for the year select input
// function generate_year_range(start, end) {
//     let years = "";
//     for (let year = start; year <= end; year++) {
//         years += "<option value='" +
//             year + "'>" + year + "</option>";
//     }
//     return years;
// }
//
// // Initialize date-related letiables
// today = new Date();
// currentMonth = today.getMonth();
// currentYear = today.getFullYear();
// selectYear = document.getElementById("year");
// selectMonth = document.getElementById("month");
//
// createYear = generate_year_range(1970, 2050);
//
// document.getElementById("year").innerHTML = createYear;
//
// let calendar = document.getElementById("calendar");
//
// let months = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December"
// ];
// let days = [
//     "Sun", "Mon", "Tue", "Wed",
//     "Thu", "Fri", "Sat"];
//
// $dataHead = "<tr>";
// for (dhead in days) {
//     $dataHead += "<th data-days='" +
//         days[dhead] + "'>" +
//         days[dhead] + "</th>";
// }
// $dataHead += "</tr>";
//
// document.getElementById("thead-month").innerHTML = $dataHead;
//
// monthAndYear =
//     document.getElementById("monthAndYear");
// showCalendar(currentMonth, currentYear);
//
// // Function to navigate to the next month
// function next() {
//     currentYear = currentMonth === 11 ?
//         currentYear + 1 : currentYear;
//     currentMonth = (currentMonth + 1) % 12;
//     showCalendar(currentMonth, currentYear);
// }
//
// // Function to navigate to the previous month
// function previous() {
//     currentYear = currentMonth === 0 ?
//         currentYear - 1 : currentYear;
//     currentMonth = currentMonth === 0 ?
//         11 : currentMonth - 1;
//     showCalendar(currentMonth, currentYear);
// }
//
// // Function to jump to a specific month and year
// function jump() {
//     currentYear = parseInt(selectYear.value);
//     currentMonth = parseInt(selectMonth.value);
//     showCalendar(currentMonth, currentYear);
// }
//
// // Function to display the calendar
// function showCalendar(month, year) {
//     let firstDay = new Date(year, month, 1).getDay();
//     tbl = document.getElementById("calendar-body");
//     tbl.innerHTML = "";
//     monthAndYear.innerHTML = months[month] + " " + year;
//     selectYear.value = year;
//     selectMonth.value = month;
//
//     let date = 1;
//     for (let i = 0; i < 6; i++) {
//         let row = document.createElement("tr");
//         for (let j = 0; j < 7; j++) {
//             if (i === 0 && j < firstDay) {
//                 cell = document.createElement("td");
//                 cellText = document.createTextNode("");
//                 cell.appendChild(cellText);
//                 row.appendChild(cell);
//             } else if (date > daysInMonth(month, year)) {
//                 break;
//             } else {
//                 cell = document.createElement("td");
//                 cell.setAttribute("data-date", date);
//                 cell.setAttribute("data-month", month + 1);
//                 cell.setAttribute("data-year", year);
//                 cell.setAttribute("data-month_name", months[month]);
//                 cell.className = "date-picker";
//                 cell.innerHTML = "<span>" + date + "</span";
//
//                 if (
//                     date === today.getDate() &&
//                     year === today.getFullYear() &&
//                     month === today.getMonth()
//                 ) {
//                     cell.className = "date-picker selected";
//                 }
//
//                 // Check if there are events on this date
//                 if (hasEventOnDate(date, month, year)) {
//                     cell.classList.add("event-marker");
//                     cell.appendChild(
//                         createEventTooltip(date, month, year)
//                     );
//                 }
//
//                 row.appendChild(cell);
//                 date++;
//             }
//         }
//         tbl.appendChild(row);
//     }
//
//     displayReminders();
// }
//
// // Function to create an event tooltip
// function createEventTooltip(date, month, year) {
//     let tooltip = document.createElement("div");
//     tooltip.className = "event-tooltip";
//     let eventsOnDate = getEventsOnDate(date, month, year);
//     for (let i = 0; i < eventsOnDate.length; i++) {
//         let event = eventsOnDate[i];
//         let eventDate = new Date(event.date);
//         let eventText = `<strong>${event.title}</strong> -
//             ${event.description} on
//             ${eventDate.toLocaleDateString()}`;
//         let eventElement = document.createElement("p");
//         eventElement.innerHTML = eventText;
//         tooltip.appendChild(eventElement);
//     }
//     return tooltip;
// }
//
// // Function to get events on a specific date
// function getEventsOnDate(date, month, year) {
//     return events.filter(function (event) {
//         let eventDate = new Date(event.date);
//         return (
//             eventDate.getDate() === date &&
//             eventDate.getMonth() === month &&
//             eventDate.getFullYear() === year
//         );
//     });
// }
//
// // Function to check if there are events on a specific date
// function hasEventOnDate(date, month, year) {
//     return getEventsOnDate(date, month, year).length > 0;
// }
//
// // Function to get the number of days in a month
// function daysInMonth(iMonth, iYear) {
//     return 32 - new Date(iYear, iMonth, 32).getDate();
// }
//
// // Call the showCalendar function initially to display the calendar
// showCalendar(currentMonth, currentYear);
