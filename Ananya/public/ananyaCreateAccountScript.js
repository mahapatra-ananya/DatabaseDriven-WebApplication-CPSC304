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


// Fetches data from the demotable and displays it.
async function fetchAndDisplayUsers() {
    const tableElement = document.getElementById('allAccounts');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/allAccounts', {
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
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// This function resets or initializes the demotable.
// async function resetDemotable() {
//     const response = await fetch("/initiate-demotable", {
//         method: 'POST'
//     });
//     const responseData = await response.json();
//
//     if (responseData.success) {
//         const messageElement = document.getElementById('resetResultMsg');
//         messageElement.textContent = "demotable initiated successfully!";
//         fetchTableData();
//     } else {
//         alert("Error initiating table!");
//     }
// }

// // initialize all tables, do not display
// async function initializeAllTables() {
//     const response = await fetch("/initiate-demotable", {
//         method: 'POST'
//     });
//     const responseData = await response.json();
//
//     if (responseData.success) {
//         const messageElement = document.getElementById('resetResultMsg');
//         messageElement.textContent = "Tables initiated successfully!";
//         fetchAndDisplayUsers();
//     } else {
//         alert("Error initiating table!");
//     }
// }

// Inserts new account into the UserAccount.
async function insertUserAccount(event) {
    event.preventDefault();

    const usernameValue = document.getElementById('Username').value;
    const passwordValue = document.getElementById('Password').value;
    const displayNameValue = document.getElementById('DisplayName').value;
    const bioValue = document.getElementById('Bio').value;
    const regionValue = document.getElementById('Region').value;
    const avatarValue = document.getElementById('Avatar').value;


    // const exists = await fetch('/check-userExists', {
    //     method: "POST",
    //
    // });

    const response = await fetch('/insert-userAccount', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: usernameValue,
            displayName: displayNameValue,
            password: passwordValue,
            bio: bioValue,
            region: regionValue,
            avatar: avatarValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertResultMsg');


    if (responseData.success) {
        messageElement.textContent = "Data inserted successfully!";
        initialize();
        // const link = document.getElementById('linkToHome');
        // link.link();
        window.location.replace("ananyaHome.html")
        // let a = document.createElement('a');
        // // Create the text node for anchor element.
        // let link = document.createTextNode("Home Page");
        // // Append the text node to anchor element.
        // a.appendChild(link);
        // // Set the title.
        // a.title = "Home Page";
        // // Set the href property.
        // a.href = "ananyaHome.html";
        // // Append the anchor element to the body.
        // document.body.appendChild(a);
    } else {
        if (responseData.val === 0) {
            messageElement.textContent = "Username already exists!";
        } else {
            messageElement.textContent = "Error creating account!";
        }
    }
}

// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    checkDbConnection();
    initialize();
    document.getElementById("createAccountTable").addEventListener("submit", insertUserAccount);
    document.getElementById("resetDemotable").addEventListener("click", resetDemotable);
    // document.getElementById("insertDemotable").addEventListener("submit", insertDemotable);
    // document.getElementById("updataNameDemotable").addEventListener("submit", updateNameDemotable);
    // document.getElementById("countDemotable").addEventListener("click", countDemotable);
};

// General function to initiate all tables
function initialize() {
    fetchAndDisplayUsers();
}