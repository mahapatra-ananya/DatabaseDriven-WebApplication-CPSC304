let urlParam;
let SERVERID;
let CALENDARID;

async function fetchAndDisplayServerInformation() {
    // TODO: NEED TO FIRST CHECK IF USER HAS ACCESS TO THIS SERVER

    // GET SERVER PAGE INFO
    const serverPageInfoResponse = await fetch('/serverpage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ServerID: SERVERID,
        })
    });

    const responseData = await serverPageInfoResponse.json();
    const serverPageInfo = responseData.serverPageInfo;
    console.log(serverPageInfo);

    if (responseData.success) {
        console.log('success fetching server info')
    } else {
        alert('Error fetching Server info')
        return;
    }

    // GET SERVER CHANNELS
    const serverPageChannelsResponse = await fetch('/serverpage-channels', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ServerID: SERVERID,
        })
    });

    const serverPageChannelsResponseData = await serverPageChannelsResponse.json();
    const serverPageChannels = serverPageChannelsResponseData.serverPageChannels;
    console.log(serverPageChannels);

    if (serverPageChannelsResponseData.success) {
        console.log('success fetching server channels')
    } else {
        alert('Error fetching Server Channels')
        return;
    }

    // Parse ServerPageInfo
    const serverName = serverPageInfo[0][0];
    const avatarID = serverPageInfo[0][1];
    let planID = serverPageInfo[0][2];
    CALENDARID = serverPageInfo[0][3];
    const planTier = serverPageInfo[0][4];
    const planMemberLimit = serverPageInfo[0][5];
    const planTheme = serverPageInfo[0][6];

    // Display ServerPageInfo
    document.querySelector('.serverName').textContent = serverName;
    document.querySelector('.serverAvatar').textContent = avatarID;
    if (planID === null ) {
        planID = 'None';
    }
    document.querySelector('.serverPlan').textContent = `Premium Plan: ${planID} ${planTier}`;
    const memberlimitmessage = document.createElement('p')
    memberlimitmessage.textContent = `Member Limit: ${planMemberLimit}`
    document.querySelector('.serverInformation').appendChild(memberlimitmessage)
    const calendarBtn = document.querySelector('.serverCalendarBtn');
    calendarBtn.textContent = `${serverName} Calendar`;
    //TODO: calendarBtn.addEventListener(goToServerCalendar)


    // SERVERPAGECHANNELS
    const channelList = document.querySelector('.channelList')
    channelList.className = 'channelList'
    // Always clear old, already fetched data before new fetching process.
    if (channelList) {
        channelList.innerHTML = '';
    }

    serverPageChannels.forEach(channel => {

        const channelItem = document.createElement('div');
        channelItem.className = 'channelItem'
        const channelName = document.createElement('p')
        channelName.className = 'channelName'
        channelName.textContent = `${channel[1]}`
        const goChannelBtn = document.createElement('button')
        goChannelBtn.className = 'goChannelBtn'
        goChannelBtn.textContent = 'View';

        channelItem.appendChild(channelName);
        channelItem.appendChild(goChannelBtn);
        channelList.appendChild(channelItem);
    });
}

async function goToServerCalendar(event) {
    event.preventDefault();
    const response = await fetch('/server/calendar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            CalendarID: CALENDARID,
        })
    });

    if (response.redirected) {
        NEWSERVERID = ''
        CALENDARID = null;
        window.location.href = response.url;
    } else {
        alert('failed to redirect')
    }
}

// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    // checkDbConnection();
    urlParam = new URLSearchParams(window.location.search);
    SERVERID = urlParam.get('serverid');

    fetchTableData();
};


// General function to refresh the displayed table data.
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayServerInformation()

    const calendarBtn = document.querySelector('.serverCalendarBtn');

    calendarBtn.addEventListener('click', goToServerCalendar);
}