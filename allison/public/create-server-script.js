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

// async function insertServerTable() {
//
//
// }

async function insertAdministratorTable() {}

async function insertChannelTable() {}

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
        channels.push(channel.value)
    }

    console.log(`serverName: ${serverName} \n insertAvatar: ${selectedAvatar} \n channels: ${channels}`);

    // STEP 1: Insert into the Server Table
    // TODO: work on username stuff later
    const response = await fetch('/insert-servertable/USERNAME', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ServerName: serverName,
            AvatarID: selectedAvatar,
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Data inserted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error inserting data!";
    }

    // STEP 2: Insert into the Administrator Table
    const administratorResponse = await insertAdministratorTable();

    // STEP 3: Insert into the Channel Table
    const channelResponse = await insertChannelTable();
}

// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    // checkDbConnection();
    fetchTableData();

    const addChannelBtn = document.querySelector('#addChannelBtn');
    const createServerBtn = document.querySelector('#createServerBtn');

    addChannelBtn.addEventListener('click', addChannel);
    createServerBtn.addEventListener('click', insertServerChannelAdminTables)
};

// General function to refresh the displayed table data.
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayAvatars();
}
