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

async function currentPlan() {
    const bannerElem = document.getElementById('ddd');
    const response = await fetch('/premium-or-not', {
        method: "GET"
    });

    const responseData = await response.json();

    if (responseData.success) {
        bannerElem.textContent = 'Your Premium PlanID is: ' + responseData.plan;
    } else {
        bannerElem.textContent = 'Buy a Premium Plan';
    }
    // const buttonElem = document.getElementById('ddd');
    // const response = await fetch('/premium-or-not', {
    //     method: "GET"
    // });
    //
    // const responseData = await response.json();
    //
    //
    // if (responseData.success) {
    //     const button = document.createElement('button');
    //     // button.style.height = '100px';
    //     // button.style.width = '280px';
    //     button.textContent = 'Your Premium PlanID: ' + responseData.plan;
    //
    //     buttonElem.appendChild(button);
    // } else {
    //     const button = document.createElement('button');
    //     button.textContent = 'Buy a Premium Plan';
    //     buttonElem.appendChild(button);
    // }
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
        button.textContent = 'Your Server: ' + responseData.serverName;
        // button.value = responseData.ServerID;
        button.value = responseData.serverID;
        button.addEventListener('click', goToServer);
        buttonElem.appendChild(button);
    } else {
        const button = document.createElement('button');
        button.textContent = 'Create a Server';
        button.addEventListener('click', goToCreateServer);
        buttonElem.appendChild(button);
    }
}

async function goToCreateServer(event) {
    event.preventDefault();
    window.location.href = "create-server.html";
}


async function premiumOrNot() {
    const buttonElem = document.getElementById('premiumOrNot');
    const response = await fetch('/premium-or-not', {
        method: "GET"
    });

    const responseData = await response.json();


    if (responseData.success) {
        const button = document.createElement('button');
        // button.style.height = '100px';
        // button.style.width = '280px';
        button.textContent = 'Your Premium PlanID: ' + responseData.plan;
        buttonElem.appendChild(button);
    } else {
        const button = document.createElement('button');
        button.textContent = 'Buy a Premium Plan';
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

async function setAvatar() {
    const avatarElem = document.getElementById('avatar');

    const response = await fetch('user-details', {
        method: 'GET'
    });

    const responseData = await response.json();
    const responseContent = responseData.data;

    if (avatarElem.innerHTML) {avatarElem.innerHTML = '';}

    // console.log(responseContent);

    avatarElem.innerHTML = responseContent[0][5];
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

    if (serverList.length > 0) {
        // containerElement.style.height = '300px';
        containerElement.style.height = '300px';
        containerElement.style.width = '300px';
        containerElement.style.overflow = 'scroll';
    }

    // Iterate over the server data and create buttons for each one
    serverList.forEach(server => {
        const button = document.createElement('button');
        button.style.height = '100px';
        button.style.width = '280px';
        button.textContent = server[1];
        console.log(server[0])
        button.value = server[0];
        button.addEventListener('click', goToServer);
        containerElement.appendChild(button);
        containerElement.appendChild(document.createElement('br'));
    });
}

async function goToServer(event) {
    event.preventDefault();
    const joinServerID = event.target.value;
    const response = await fetch('/server', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ServerID: joinServerID,
        })
    });

    if (response.redirected) {
        window.location.href = response.url;
    } else {
        alert('failed to redirect')
    }
}

// //TODO: implement
// async function goToCalendar(event) {
//     event.preventDefault();
//     // const joinServerID = event.target.value;
//     const response = await fetch('/server', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             CalendarID: UserCalendarID,
//         })
//     });
//
//     if (response.redirected) {
//         window.location.href = response.url;
//     } else {
//         alert('failed to redirect')
//     }
// }



// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    checkDbConnection();
    initialize();
    banner();
    fetchAndDisplayServers();
    adminOrCreate();
    premiumOrNot();
    currentPlan();
    setAvatar();
    // document.getElementById("calendar").addEventListener("click", goToCalendar);
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