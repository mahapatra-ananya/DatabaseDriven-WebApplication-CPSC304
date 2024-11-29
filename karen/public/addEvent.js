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

let currEventID = -1; // set up tracker for event ID // TODO add to allisons

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
        currEventID = idValue; // track event last inserted // TODO add to allisons
        messageElement.textContent = "Event Data created successfully!";
        fetchEventTableData();
    } else {
        messageElement.textContent = "Error creating Event!";
    }
}

////////////////////////////////TODO TO ADD TO ALLISONS BELOW

async function getAllCalendarIDName() {

    //this is general getter fn that already exists in controller to appservice
    const response = await fetch('/Calendartable', {
        method: 'GET'
    });

    const responseData = await response.json();
    const allCalendarTables = responseData.data;

    allCalendars = []; // local array to store retrieved calenadr table
    allCalendarTables.forEach(calendar => {
        calendar.forEach((ind, field) => {
            allCalendars.push(ind);
        });
    });

    // get gui checkbox div to populate
    let allCalendarList = document.getElementById('checkboxesCalendars');
    document.getElementById('checkboxesCalendars').innerHTML='';

    for (let i = 0; i < allCalendars.length/3; i++) {       //ID, name, username
        let CalendarID = allCalendars[i*3];                          // Access CalendarID
        let CalendarTitle = allCalendars[(i*3) + 1];                 // Access CalendarName

        var label= document.createElement("label");
        var description = document.createTextNode(CalendarTitle);
        var checkbox = document.createElement("input");

        checkbox.type = "checkbox";    // make the element a checkbox
        checkbox.name = CalendarTitle;      // give it a name we can check on the server side
        checkbox.value = CalendarID;         // make its value "calendarID"


        label.appendChild(checkbox);   // add the box to the element
        label.appendChild(description);// add the description to the element

        allCalendarList.appendChild(label);
    }
}

async function insertAllEventsIntoCalendar(event) {
    event.preventDefault();

    var checkedboxes = [];
    var checkednames = [];
    var checkboxes = document.querySelectorAll('input[type=checkbox]:checked');

    for (var i = 0; i < checkboxes.length; i++) {
        checkedboxes.push(checkboxes[i].value)
    }
    for (var i = 0; i < checkboxes.length; i++) {
        checkednames.push(checkboxes[i].name)
    }

    console.log(checkedboxes);//confirm we got the right calendar id's back

    const messageElement = document.getElementById('insertIntoCalendarResultMsg');
    let messages = '';


    if (checkedboxes.length < 1) {
        messages = "Please check at least one calendar";
    } else if (currEventID < 0) {
        messages = "Please create an event before adding to calendar";
    } else {
        for (var i = 0; i < checkedboxes.length; i++) {
            let msg = await insertIntoCalendar(checkedboxes[i]);
            let name = checkednames[i];
            messages = `${messages} ${msg} ${name}! `;
        }
    }
    messageElement.textContent = messages;
    fetchEventTableData();
}


async function insertIntoCalendar(CalendaridValue) {

    // const CalendaridValue = document.getElementById('insertIntoCalendarID').value;
    const EventidValue = currEventID;
    // const messageElement = document.getElementById('insertIntoCalendarResultMsg');

    // if (EventidValue < 0) {
    //     // messageElement.textContent = "Please make new event first before adding to a calendar!";
    //     return "Please make new event first before adding to a calendar!";
    // } else {
        const response = await fetch('/insert-EventToCalendar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                CalendarID: CalendaridValue,
                EventID: EventidValue
            })
        });

        const responseData = await response.json();

        if (responseData.success) {
            // messageElement.textContent = "Event posted to calendar successfully!";
            return "Event posted to ";
        } else {
            // messageElement.textContent = "Error posting event to calendar!";
            return "Error posting event to ";
        }
    // }

}

// async function insertIntoCalendar(event) {
//
//
//     const CalendaridValue = document.getElementById('insertIntoCalendarID').value;
//     const EventidValue = currEventID;
//     const messageElement = document.getElementById('insertIntoCalendarResultMsg');
//
//     if (EventidValue < 0) {
//         messageElement.textContent = "Please make new event first before adding to a calendar!";
//     } else {
//         const response = await fetch('/insert-EventToCalendar', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 CalendarID: CalendaridValue,
//                 EventID: EventidValue
//             })
//         });
//
//         const responseData = await response.json();
//
//         if (responseData.success) {
//             messageElement.textContent = "Event posted to calendar successfully!";
//             fetchEventTableData();
//         } else {
//             messageElement.textContent = "Error posting event to calendar!";
//         }
//     }
//
// }


// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    checkDbConnection();

    // fetchCalendarTableData();
    fetchEventTableData();
    getAllCalendarIDName(); // TODO: add to allison

    // document.getElementById("resetAllTables").addEventListener("click", resetAllTables);
    // document.getElementById("insertCalendartable").addEventListener("submit", insertCalendartable);
    // document.getElementById("updataNameCalendartable").addEventListener("submit", updateNameCalendartable);
    // document.getElementById("countCalendartable").addEventListener("click", countCalendartable);

    //document.getElementById("resetEventtable").addEventListener("click", resetEventtable);
    document.getElementById("insertEventtable").addEventListener("submit", insertEventtable);

    document.getElementById("insertToCalendar").addEventListener("submit", insertAllEventsIntoCalendar); // TODO: add to allisons
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
