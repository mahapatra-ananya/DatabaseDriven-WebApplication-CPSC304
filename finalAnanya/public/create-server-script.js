// TODO: USERNAME STUFF
// let currentUsername = 'GojoSatoru';
let currentUsername;
let NEWSERVERID;

// Create Server Script
function addChannel() {
    const insertChannelGroup = document.querySelector('#insertChannelGroup');
    const newChannel = document.createElement('input');
    newChannel.type = 'text';
    newChannel.className = 'newChannel';
    newChannel.placeholder = 'Channel Name';

    insertChannelGroup.appendChild(newChannel);
}

async function fetchAndDisplayAvatars() {
    const insertAvatarGroup = document.querySelector('#insertAvatar');

    const response = await fetch('/avatartable', {
        method: 'GET'
    });

    const responseData = await response.json();
    const avatarOptions = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (insertAvatarGroup) {
        insertAvatarGroup.innerHTML = '';
    }

    avatarOptions.forEach(avatar => {

        const newAvatar = document.createElement('input');
        newAvatar.type = 'radio';
        newAvatar.id = avatar[0]; //AvatarID
        newAvatar.className = 'avatar'
        newAvatar.name = 'avatar';
        newAvatar.value = avatar[0];


        const newAvatarLabel = document.createElement('label')
        newAvatarLabel.textContent = avatar[3]; //IconDescription
        newAvatarLabel.for = avatar[0];

       insertAvatarGroup.appendChild(newAvatar);
       insertAvatarGroup.appendChild(newAvatarLabel);
    });

}

async function insertServerChannelAdminTables(event) {
    event.preventDefault();

    // Store the User Input
    const serverName = document.getElementById('insertServerName').value;
    const avatars = document.getElementsByClassName('avatar');
    let selectedAvatar;
    for (const avatar of avatars) {
        if (avatar.checked) {
            selectedAvatar = avatar.value;
        }
    }
    const rawChannels = document.getElementsByClassName('newChannel')
    let channels = [];
    for (const channel of rawChannels) {
        if (channel.value.trim().length > 0) {
            channels.push(channel.value)
        }
    }
    const inputTag = document.getElementById('insertTag').value;
    const inputSignature = document.getElementById('insertSignature').value;

    ////// USER INPUT CHECKING
    let emptyInput = []

    if (serverName === null || serverName === '') {
        emptyInput.push("Server Name")
    }

    if (selectedAvatar === null || selectedAvatar === '' || selectedAvatar === undefined) {
        emptyInput.push(" Select an Avatar")
    }

    if (channels === null || channels.length === 0) {
        emptyInput.push(" Channels")
    }

    if (emptyInput.length > 0) {
        alert(`Please fill out the following fields: ${emptyInput}`)
        return;
    }

    console.log(`serverName: ${serverName} \n 
    insertAvatar: ${selectedAvatar} \n 
    channels: ${channels}
    inputTag: ${inputTag}
    inputSignature: ${inputSignature},
    username: ${currentUsername}`);

    // STEP 1: Insert into the new calendar table
    const insertCalendarResponse = await fetch('/insert-calendar-table', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            CalendarName: `${serverName} Calendar`
        })
    });

    const insertCalendarResponseData = await insertCalendarResponse.json();
    const newCalendarId = insertCalendarResponseData.calendarID
    if (insertCalendarResponseData.success) {
            console.log(`Successfully created calendarid: ${newCalendarId}`);
        } else {
            alert('Error creating calendar')
            return;
        }

    // STEP 2: Insert into the Server Table
    const insertServerResponse = await fetch('/insert-server-table', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ServerName: serverName,
            AvatarID: selectedAvatar,
            CalendarID: newCalendarId,
            Username: currentUsername
        })
    });

    const insertServerResponseData = await insertServerResponse.json();
    // let newServerId;

    if (insertServerResponseData.success) {
        NEWSERVERID = insertServerResponseData.serverID;
        console.log(`Successfully created serverid: ${NEWSERVERID}`);
    } else {
        alert('Error Creating the Server')
        return;
    }

    // STEP 2: Insert into the Administrator Table
    const insertAdministratorResponse = await fetch('/insert-administrator-table', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Username: currentUsername,
            Tag: inputTag,
            Signature: inputSignature,
            ServerID: NEWSERVERID
        })
    });

    const insertAdministratorResponseData = await insertAdministratorResponse.json();

    if (insertAdministratorResponseData.success) {
        console.log('success inserting new administrator')
    } else {
        alert('error inserting administrator')
        return;
    }

    // // STEP 3: Insert into the Channel Table
    const insertChannelResponse = await fetch('/insert-channel-table', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            channels: channels,
            serverID: NEWSERVERID,
        })
    });

    const insertChannelResponseData = await insertChannelResponse.json();
    if (insertChannelResponseData.success) {
        console.log('success inserting the new channels')
        const serverSuccess = document.querySelector('#onInsertServerSuccess')
        serverSuccess.style.display = 'block';
        const successServerName = document.querySelector('#successServerName');
        successServerName.textContent = serverName;
    } else {
        alert('error inserting the new channels')
    }

    // TODO: IF ANY OF THESE FAILS, NEED TO DELETE THE PREVIOUS INSERTS..........
}

async function goToServerPage(event) {
    event.preventDefault();
    const response = await fetch('/server', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ServerID: NEWSERVERID,
        })
    });

    if (response.redirected) {
        NEWSERVERID = ''
        window.location.href = response.url;
    } else {
        alert('failed to redirect')
    }
}

async function getUser() {
    const user = await fetch('/curr-user', {
        method: "GET"
    });
    currentUsername = await user.text()
}

// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    // checkDbConnection();

    getUser()
    NEWSERVERID = '';
    fetchTableData();
    const addChannelBtn = document.querySelector('#addChannelBtn');
    const createServerBtn = document.querySelector('#createServerBtn');
    const nextBtn = document.querySelector('#nextBtn');

    addChannelBtn.addEventListener('click', addChannel);
    createServerBtn.addEventListener('click', insertServerChannelAdminTables)
    nextBtn.addEventListener('click', goToServerPage);
};


// General function to refresh the displayed table data.
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayAvatars();
}
