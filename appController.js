const express = require('express');
const appService = require('./appService');
const karenappService = require("./karen/karenappService");
// const allisonAppService = require("./allison/allisonAppService");
//const appService = require('./allisonAppService');
//const appService = require('./karenappService');

const router = express.Router();

///////////////////////////////////////// UNIVERSAL APPSERVICE /////////////////////////////////////////
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

router.post("/initiate-demotable", async (req, res) => {
    // const initiateResult = await allisonAppService.initiateDemotable();
    const initiateResult = await appService.initiateAllTables();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/paymenttable', async (req, res) => {
    const tableContent = await appService.fetchPaymentTableFromDb();
    res.json({data: tableContent});
});
router.get('/tiertable', async (req, res) => {
    const tableContent = await appService.fetchTierTableFromDb();
    res.json({data: tableContent});
});
router.get('/premiumplantable', async (req, res) => {
    const tableContent = await appService.fetchPremiumPlanTableFromDb();
    res.json({data: tableContent});
});
router.get('/locationtable', async (req, res) => {
    const tableContent = await appService.fetchLocationTableFromDb();
    res.json({data: tableContent});
});
router.get('/avatartable', async (req, res) => {
    const tableContent = await appService.fetchAvatarTableFromDb();
    res.json({data: tableContent});
});
router.get('/useraccounttable', async (req, res) => {
    const tableContent = await appService.fetchUserAccountTableFromDb();
    res.json({data: tableContent});
});
router.get('/calendartable', async (req, res) => {
    const tableContent = await appService.fetchCalendarTableFromDb();
    res.json({data: tableContent});
});
router.get('/eventtable', async (req, res) => {
    const tableContent = await appService.fetchEventTableFromDb();
    res.json({data: tableContent});
});
router.get('/servertable', async (req, res) => {
    const tableContent = await appService.fetchServerTableFromDb();
    res.json({data: tableContent});
});
router.get('/channeltable', async (req, res) => {
    const tableContent = await appService.fetchChannelTableFromDb();
    res.json({data: tableContent});
});
router.get('/generalmembertable', async (req, res) => {
    const tableContent = await appService.fetchGeneralMemberTableFromDb();
    res.json({data: tableContent});
});
router.get('/administratortable', async (req, res) => {
    const tableContent = await appService.fetchAdministratorTableFromDb();
    res.json({data: tableContent});
});
router.get('/messagetable', async (req, res) => {
    const tableContent = await appService.fetchMessageTableFromDb();
    res.json({data: tableContent});
});
router.get('/postedtotable', async (req, res) => {
    const tableContent = await appService.fetchPostedToTableFromDb();
    res.json({data: tableContent});
});
router.get('/joinstable', async (req, res) => {
    const tableContent = await appService.fetchJoinsTableFromDb();
    res.json({data: tableContent});
});

router.get('/usernames', async (req, res) => {
    const tableContent = await appService.fetchUsernames();
    res.json({data: tableContent});
});

///////////////////////////////////////// ALLISON APPSERVICE /////////////////////////////////////////
/////////////////////////////////////////SERVER PAGE//////////////////////////////////////////
router.post('/serverpage', async (req, res) => {
    const { ServerID } = req.body;

    const serverPageInfo = await appService.fetchServerPageInfo(ServerID);
    console.log(`appController: serverPageInfo: ${serverPageInfo}`)

    if (serverPageInfo) {
        res.json({ success: true, serverPageInfo: serverPageInfo});
    } else {
        res.status(500).json({ success: false });
    }
});

router.post('/serverpage-channels', async (req, res) => {
    const { ServerID } = req.body;

    const serverPageChannels = await appService.fetchServerPageChannels(ServerID);
    console.log(`appController: serverPageChannels: ${serverPageChannels}`)

    if (serverPageChannels) {
        res.json({ success: true, serverPageChannels: serverPageChannels});
    } else {
        res.status(500).json({ success: false });
    }
});

////////////////////GO TO A SERVER PAGE ////////////////////////////////////
router.post('/server', async (req, res) => {
    const { ServerID } = req.body;
    res.redirect(`/server.html?serverid=${encodeURIComponent(ServerID)}`)
});


/////////////////// JOIN SERVER - LIST FILTERED SERVERS ////////////////////
router.post('/join-server-list', async (req, res) => {
    const { Username } = req.body;

    // STEP 1: SELECT the servers the current user has NOT joined AND NOT an admin of
    const filteredUserServers = await appService.fetchFilteredUserServers(Username);
    console.log(`appController: FilteredUserServers: ${filteredUserServers}`)

    if (filteredUserServers) {
        res.json({ success: true, filteredServers: filteredUserServers});
    } else {
        res.status(500).json({ success: false });
    }
});

/* INSERT JOIN SERVER AND GENERAL MEMBER*/

router.post("/insert-joins-table", async (req, res) => {
    const { Username, ServerID } = req.body;

    const insertResult = await appService.insertJoinsTable(Username, ServerID);
    if (insertResult) {
        res.redirect(`/server.html?serverid=${encodeURIComponent(ServerID)}`)
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-general-member-table", async (req, res) => {
    const { Username } = req.body;

    const checkUserIsGeneralMember = await appService.isUserGeneralMember(Username)
    console.log(`isusergeneralmember: ${checkUserIsGeneralMember}`)
    let insertResult
    if (!checkUserIsGeneralMember) {
        insertResult = await appService.insertGeneralMemberTable(Username);
    }

    if (insertResult || checkUserIsGeneralMember) {
        res.json({ success: true});
    } else {
        res.status(500).json({ success: false });
    }
});

router.post('/server/calendar', async (req, res) => {
    const { CalendarID } = req.body;
    res.redirect(`/Calendar.html?calendarid=${encodeURIComponent(CalendarID)}`)
});

router.post('/edit-event-details', async (req, res) => {
    const { EventID } = req.body;
    const eventDetails = await appService.fetchEventDetails(EventID);
    console.log(`appController: edit event details: ${eventDetails}`)

    if (eventDetails) {
        res.json({ success: true, EventDetails: eventDetails});
    } else {
        res.status(500).json({ success: false });
    }
});

router.post('/update-event-details', async (req, res) => {
    const { EventID, EventName, Duration, Details, Username } = req.body;
    // const { EventID, EventName, EventDateTime, Duration, Details, Username } = req.body;
    const eventDetails = await appService.updateEventDetails(EventID, EventName, Duration, Details, Username );
    // const eventDetails = await appService.updateEventDetails(EventID, EventName, EventDateTime, Duration, Details, Username );
    console.log(`appController: edit event details: ${eventDetails}`)

    if (eventDetails) {
        res.json({ success: true});
    } else {
        res.status(500).json({ success: false });
    }
});

///////////////////////////////////////// KAREN APPSERVICE /////////////////////////////////////////

router.get('/Calendartable', async (req, res) => {
    const tableContent = await appService.fetchCalendarTableFromDb();
    res.json({data: tableContent});
});

router.post("/initiate-demotable", async (req, res) => {
    const initiateResult = await appService.initiateAllTables();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-Calendartable", async (req, res) => {
    const { CalendarID, CalendarName, UserName } = req.body;
    const insertResult = await appService.insertCalendartable(CalendarID, CalendarName, UserName);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-name-Calendartable", async (req, res) => {
    const { oldName, newName } = req.body;
    const updateResult = await appService.updateNameCalendartable(oldName, newName);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/count-Calendartable', async (req, res) => {
    const tableCount = await appService.countCalendartable();
    if (tableCount >= 0) {
        res.json({
            success: true,
            count: tableCount
        });
    } else {
        res.status(500).json({
            success: false,
            count: tableCount
        });
    }
});

router.post('/fetch-EventDates', async (req, res) => {

    //console.log("reached fetch-EventDates");

    const { selectedCalendar } = req.body;
    const result = await appService.fetchEventDates(selectedCalendar);
    res.json({ data: result });
});

router.post('/fetch-EventsOnDate', async (req, res) => {

    const { selectedCalendar, selectedYear, selectedMonth, selectedDate } = req.body;
    const result = await appService.fetchEventsOnDate(selectedCalendar, selectedYear, selectedMonth, selectedDate);
    console.log("reached fetch-EventsOnDate");
    res.json({ data: result });
});


router.get('/Eventtable', async (req, res) => {
    const tableContent = await appService.fetchEventTableFromDb();
    res.json({data: tableContent});
});

router.post("/insert-Eventtable", async (req, res) => {
    const { EventID, EventName, EventDateTime, Duration, Details, EventUsername } = req.body;
    const insertResult = await appService.insertEventtable(
        EventID, EventName, EventDateTime, Duration, Details, EventUsername);
    if (insertResult) {
        // const updatePostedTo = await appService.insertPostedtable(EventID, EventUsername);
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/count-Eventtable', async (req, res) => {
    const tableCount = await appService.countEventtable();
    if (tableCount >= 0) {
        res.json({
            success: true,
            count: tableCount
        });
    } else {
        res.status(500).json({
            success: false,
            count: tableCount
        });
    }
});

//////////////////////////////////////// EVENT SELECTION
router.post('/filter-events', async (req, res) => {
    const { QueryString } = req.body;

    const filteredEvents = await appService.fetchFilteredEvents(QueryString);
    console.log(`appController: filter events: ${filteredEvents}`)

    if (filteredEvents) {
        res.json({ success: true, filteredEvents: filteredEvents});
    } else {
        res.status(500).json({ success: false });
    }
});


////////////////////// Delete Event ///////////////////////

router.post("/delete-event", async (req, res) => {
   const { eventID } = req.body;
    const deleteResult = await appService.deleteEvent(eventID);
    if (deleteResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

//////////////////////Karen's addition

router.get('/fetch-BusyUser', async (req, res) => {
    const result = await karenappService.fetchBusyUser();
    res.json({ data: result });
});

router.post("/fetch-BusyMonth", async (req, res) => {
    const { userLimit } = req.body;
    const result = await karenappService.fetchBusyMonth(userLimit);
    res.json({ data: result });
});

router.post("/fetch-SharedEvents", async (req, res) => {
    const { query } = req.body;
    console.log("reached fetch-SharedEvents");
    const result = await karenappService.fetchSharedEvents(query);
    console.log("returned from fetch-SharedEvents");
    res.json({ data: result });
});

//////////////////////////////////////////////////ANANYA
router.get("/curr-user", async (req, res) => {
    const loginResult = await appService.currUser();
    res.send(loginResult);
});

router.get('/allAccounts', async (req, res) => {
    const tableContent = await appService.fetchAccountsFromDb();

    res.json({data: tableContent});
});

router.get('/user-details', async (req, res) => {
    const tableContent = await appService.fetchUserDetailsFromDb();
    console.log(tableContent);
    res.json({data: tableContent});
});

router.get('/allPlans', async (req, res) => {
    const tableContent = await appService.fetchPremiumPlanTableFromDb();
    // console.log(tableContent);
    res.json({data: tableContent});
});

router.get('/allPlanIDs', async (req, res) => {
    const tableContent = await appService.fetchPremiumPlanIDsFromDb();
    res.json({data: tableContent});
});

router.post('/project-plans', async (req, res) => {
    const { pID, tier, pI, mL, theme, bP, sP } = req.body;
    const tableContent = await appService.projectPlans(pID, tier, pI, mL, theme, bP, sP);
    res.json({data: tableContent});
});

router.get('/allRegions', async (req, res) => {
    const tableContent = await appService.fetchRegionsFromDb();
    res.json({data: tableContent});
});

router.get('/allAvatars', async (req, res) => {
    const tableContent = await appService.fetchAvatarsFromDb();
    res.json({data: tableContent});
});

router.get('/user-servers', async (req, res) => {
    const tableContent = await appService.fetchUserServersFromDb();
    res.json({data: tableContent});
});

router.post("/insert-userAccount", async (req, res) => {
    const { username, password, displayName, bio, region, avatar } = req.body;
    const insertResult = await appService.insertUserAccount(username, displayName, password, bio, region, avatar);
    if (insertResult === 1) {
        res.json({ success: true, val: 1 });
    } else if (insertResult === 0) {
        res.status(500).json({ success: false, val: 0 });
    } else {
        res.status(500).json({ success: false, val: -1 });
    }
});

router.post("/edit-password", async (req, res) => {
    const { password } = req.body;
    const insertResult = await appService.editPassword(password);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/edit-DN", async (req, res) => {
    const { displayName } = req.body;
    const insertResult = await appService.editDN(displayName);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/edit-bio", async (req, res) => {
    const {bio} = req.body;
    const insertResult = await appService.editBio(bio);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/edit-region", async (req, res) => {
    const { region } = req.body;
    const insertResult = await appService.editRegion(region);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/edit-avatar", async (req, res) => {
    const { avatar } = req.body;
    const insertResult = await appService.editAvatar(avatar);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/delete-account", async (req, res) => {
    // const { displayName, password, bio, region, avatar } = req.body;
    const deleteResult = await appService.deleteAccount();
    if (deleteResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/purchase-plan", async (req, res) => {
    const { purchase } = req.body;
    const purchaseResult = await appService.purchasePlan(purchase);
    if (purchaseResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/log-in", async (req, res) => {
    const { username, password } = req.body;
    const loginResult = await appService.loginUser(username, password);
    if (loginResult === 1) {
        res.json({ success: true, val: 1 });
    } else if (loginResult === 0) {
        res.status(500).json({ success: false, val: 0 });
    } else if (loginResult === 2) {
        res.status(500).json({ success: false, val: 2 });
    } else {
        res.status(500).json({ success: false, val: -1 });
    }
});

router.get("/admin-or-create", async (req, res) => {
    const isAdmin = await appService.checkIfAdmin();
    if (isAdmin[0]) {
        res.json({ success: true, serverName: isAdmin[1], serverID: isAdmin[2]});
    } else {
        res.status(500).json({ success: false, serverName: isAdmin[1], serverID: isAdmin[2]});
    }
});

router.get("/premium-or-not", async (req, res) => {
    const hasPremium = await appService.checkIfHasPremium();
    if (hasPremium[0]) {
        res.json({ success: true, plan: hasPremium[1]});
    } else {
        res.status(500).json({ success: false, plan: hasPremium[1]});
    }
});

router.post("/update-name-demotable", async (req, res) => {
    const { oldName, newName } = req.body;
    const updateResult = await appService.updateNameDemotable(oldName, newName);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

////////////////////////////////////////////////////////////////////////
/*CREATE SERVER*/

router.post("/insert-calendar-table", async (req, res) => {
    const { CalendarName } = req.body;
    const newCalendarId = await appService.generateCalendarId();
    console.log(`newCalendarID: ${newCalendarId}`)

    const insertResult = await appService.insertCalendarTable(newCalendarId, CalendarName);
    if (insertResult) {
        res.json({ success: true, calendarID: newCalendarId });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-server-table", async (req, res) => {
    const { ServerName, AvatarID, CalendarID, Username } = req.body;
    const newServerId = await appService.generateServerId();
    const adminsPlanID = await appService.getAdminPlanID(Username);
    console.log(`newServerID: ${newServerId} 
    \nadminPlanID: ${adminsPlanID}`)

    const insertResult = await appService.insertServerTable(newServerId, ServerName, adminsPlanID, CalendarID, AvatarID);
    if (insertResult) {
        res.json({ success: true, serverID: newServerId });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-administrator-table", async (req, res) => {
    const { Username, Tag, Signature, ServerID } = req.body;
    const insertResult = await appService.insertAdministratorTable(Username, Tag, Signature, ServerID);
    if (insertResult) {
        res.json({ success: true});
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-channel-table", async (req, res) => {
    const { channels, serverID } = req.body;
    console.log(`requested channels ${channels}`)
    let channelID = 1;
    for (const channel of channels) {
        try {
            console.log(channel)
            await appService.insertChannelTable(channelID, channel, serverID);
            channelID++;
        } catch (err) {
            console.log('error inserting channel', err)
        }
    }

    if (channels.length === channelID-1) {
        res.json({ success: true});
    } else {
        res.status(500).json({ success: false });
    }
});



module.exports = router;