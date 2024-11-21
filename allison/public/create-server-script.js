// Create Server Script
 const addChannelBtn = document.querySelector('#addChannelBtn');
const insertChannelGroup = document.querySelector('#insertChannelGroup');
const createServerBtn = document.querySelector('#createServerBtn');

function addChannel() {
    const newChannel = document.createElement('input');
    newChannel.type = 'text';
    newChannel.id = 'newChannel';
    newChannel.placeholder = 'Channel Name';

    insertChannelGroup.appendChild(newChannel);
}

async function insertServerAndChannelTable(event) {
    event.preventDefault();
    alert('TODO: Implement InsertServerAndChannelTable')
}

addChannelBtn.addEventListener('click', addChannel);
createServerBtn.addEventListener('click', insertServerAndChannelTable)