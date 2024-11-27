// TODO: UPDATE username
const USERNAME = 'GojoSatoru'

async function insertJoinServerAndGo(event) {
    event.preventDefault();

    // Get the selected server's ID
    const joinServerID = event.target.value;

    // Insert into join server table and immediately go to the server's page
    const generalMemberResponse = await fetch('/insert-general-member-table', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Username: USERNAME,
        })
    });

    const generalMemberResponseData = await generalMemberResponse.json();
    if (generalMemberResponseData.success) {
        console.log('success inserting user in general member table')
    } else {
        alert('Error becoming a general member')
        return;
    }

    // Insert into joins
    const insertJoinsResponse = await fetch('/insert-joins-table', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Username: USERNAME,
            ServerID: joinServerID,
        })
    });

    // const insertJoinsResponseData = await insertJoinsResponse.json();
    if (insertJoinsResponse.redirected) {
        console.log('success inserting user in joins table')
        window.location.href = insertJoinsResponse.url;
    } else {
        alert('Error joining Server')
        return;
    }
}

async function fetchAndDisplayFilteredServers() {
    const insertServerGroup = document.querySelector('#serverList');

    const response = await fetch('/join-server-list', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Username: USERNAME,
        })
    });

    const responseData = await response.json();
    const filteredServers = responseData.filteredServers;
    console.log(filteredServers);



    // Always clear old, already fetched data before new fetching process.
    if (insertServerGroup) {
        insertServerGroup.innerHTML = '';
    }

    if (filteredServers.length > 0) {
        filteredServers.forEach(server => {

            const serverItem = document.createElement('div');
            serverItem.className = 'serverItem';
            const serverName = document.createElement('p')
            serverName.className = 'serverName'
            serverName.textContent = server[1];
            const serverId = document.createElement('p')
            serverId.className = 'serverId'
            serverId.textContent = `ID: ${server[0]}`;
            const joinServerBtn = document.createElement('button')
            joinServerBtn.className = 'joinServerBtn'
            joinServerBtn.textContent = 'Join';
            joinServerBtn.value = server[0]
            joinServerBtn.addEventListener('click', insertJoinServerAndGo);

            serverItem.appendChild(serverName);
            serverItem.appendChild(serverId);
            serverItem.appendChild(joinServerBtn);

            serverList.appendChild(serverItem);
        });
    } else {
        const noAvailableServersMsg = document.createElement('p');
        noAvailableServersMsg.textContent ='There are currently no servers available for you to join. Please come back later!'
        insertServerGroup.appendChild(noAvailableServersMsg)
    }
}


// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    // checkDbConnection();

    fetchTableData();

};


// General function to refresh the displayed table data.
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
        fetchAndDisplayFilteredServers();
}
