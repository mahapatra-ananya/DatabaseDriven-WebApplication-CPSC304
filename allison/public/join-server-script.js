// TODO: UPDATE username
const USERNAME = 'goldfishlover'

const joinServerBtns = () => {
    // get every join server button
}

//TODO: TEMPORARY JUST FOR SHOW
document.querySelector(".joinServerBtn").addEventListener('click', () => {
    alert("TODO: Implement Join Button Clicked")
})

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

    filteredServers.forEach(server => {

        const serverItem = document.createElement('div');
        serverItem.className = 'serverItem';
        const serverName = document.createElement('p')
        serverName.className = 'serverName'
        serverName.textContent = server[1];
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


// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    // checkDbConnection();

    fetchTableData();

    // const addChannelBtn = document.querySelector('#addChannelBtn');
    // const createServerBtn = document.querySelector('#createServerBtn');
    // const nextBtn = document.querySelector('#nextBtn');
    //
    // addChannelBtn.addEventListener('click', addChannel);
    // createServerBtn.addEventListener('click', insertServerChannelAdminTables)
    // nextBtn.addEventListener('click', goToServerPage);
};


// General function to refresh the displayed table data.
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
        fetchAndDisplayFilteredServers();
}
