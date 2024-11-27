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

async function banner() {
    const bannerElem = document.getElementById('welcomeBanner');
    const response = await fetch('/curr-user', {
        method: "GET"
    });

    response.text()
        .then((text) => {
            bannerElem.textContent = 'Welcome, ' + text;
        })
        .catch((error) => {
            bannerElem.textContent = 'Error: Username not found';  // Adjust error handling if required.
        });
}

async function adminOrCreate() {
    const buttonElem = document.getElementById('adminOrCreateServer');
    const response = await fetch('/admin-or-create', {
        method: "GET"
    });

    const responseData = await response.json();


    if (responseData.success) {
        const button = document.createElement('button');
        button.style.height = '100px';
        button.style.width = '280px';
        button.textContent = 'Go to Your Server';
        buttonElem.appendChild(button);
    } else {
        const button = document.createElement('button');
        button.textContent = 'Create a Server';
        buttonElem.appendChild(button);
    }
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


// Fetches data from the demotable and displays it.
async function fetchAndDisplayServers() {
    const containerElement = document.getElementById('displayServers');

    const response = await fetch('/user-servers', {
        method: 'GET'
    });

    const responseData = await response.json();
    const serverList = responseData.data;

    // Clear the container before adding new buttons
    if (containerElement.innerHTML) {
        containerElement.innerHTML = '';
    }

    // Iterate over the server data and create buttons for each one
    serverList.forEach(server => {
        const button = document.createElement('button');
        button.style.height = '100px';
        button.style.width = '280px';
        button.textContent = server;
        containerElement.appendChild(button);
        containerElement.appendChild(document.createElement('br'));
    });
}



// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    checkDbConnection();
    initialize();
    banner();
    fetchAndDisplayServers();
    adminOrCreate();
    // document.getElementById("createAccountTable").addEventListener("submit", insertUserAccount);
    // document.getElementById("displayServers").addEventListener("click", resetDemotable);
    // document.getElementById("insertDemotable").addEventListener("submit", insertDemotable);
    // document.getElementById("updataNameDemotable").addEventListener("submit", updateNameDemotable);
    // document.getElementById("countDemotable").addEventListener("click", countDemotable);
};

// General function to initiate all tables
function initialize() {
    fetchAndDisplayUsers();
}