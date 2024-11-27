const express = require('express');
const appService = require('./appService');
const allisonAppService = require('./allisonAppService');
const karenappService = require('./karenappService');

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


router.get('/demotable', async (req, res) => {
    const tableContent = await appService.fetchDemotableFromDb();
    res.json({data: tableContent});
});

router.post("/initiate-demotable", async (req, res) => {
    const initiateResult = await appService.initiateDemotable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-demotable", async (req, res) => {
    const { id, name } = req.body;
    const insertResult = await appService.insertDemotable(id, name);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
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

router.get('/count-demotable', async (req, res) => {
    const tableCount = await appService.countDemotable();
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

///////////////////////////////////////// ALLISON APPSERVICE /////////////////////////////////////////
/////////////////////////////////////////SERVER PAGE//////////////////////////////////////////
router.post('/serverpage', async (req, res) => {
    const { ServerID } = req.body;

    const serverPageInfo = await allisonAppService.fetchServerPageInfo(ServerID);
    console.log(`appController: serverPageInfo: ${serverPageInfo}`)

    if (serverPageInfo) {
        res.json({ success: true, serverPageInfo: serverPageInfo});
    } else {
        res.status(500).json({ success: false });
    }
});

router.post('/serverpage-channels', async (req, res) => {
    const { ServerID } = req.body;

    const serverPageChannels = await allisonAppService.fetchServerPageChannels(ServerID);
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
    const filteredUserServers = await allisonAppService.fetchFilteredUserServers(Username);
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

    const insertResult = await allisonAppService.insertJoinsTable(Username, ServerID);
    if (insertResult) {
        res.redirect(`/server.html?serverid=${encodeURIComponent(ServerID)}`)
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-general-member-table", async (req, res) => {
    const { Username } = req.body;

    const checkUserIsGeneralMember = await allisonAppService.isUserGeneralMember(Username)
    console.log(`isusergeneralmember: ${checkUserIsGeneralMember}`)
    let insertResult
    if (!checkUserIsGeneralMember) {
        insertResult = await allisonAppService.insertGeneralMemberTable(Username);
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


///////////////////////////////////////// KAREN APPSERVICE /////////////////////////////////////////

router.get('/Calendartable', async (req, res) => {
    const tableContent = await karenappService.fetchCalendarTableFromDb();
    res.json({data: tableContent});
});

router.post("/initiate-AllTables", async (req, res) => {
    const initiateResult = await karenappService.initiateAllTables();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-Calendartable", async (req, res) => {
    const { CalendarID, CalendarName, UserName } = req.body;
    const insertResult = await karenappService.insertCalendartable(CalendarID, CalendarName, UserName);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-name-Calendartable", async (req, res) => {
    const { oldName, newName } = req.body;
    const updateResult = await karenappService.updateNameCalendartable(oldName, newName);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/count-Calendartable', async (req, res) => {
    const tableCount = await karenappService.countCalendartable();
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
    const result = await karenappService.fetchEventDates(selectedCalendar);
    res.json({ data: result });
});

router.post('/fetch-EventsOnDate', async (req, res) => {

    const { selectedCalendar, selectedYear, selectedMonth, selectedDate } = req.body;
    const result = await karenappService.fetchEventsOnDate(selectedCalendar, selectedYear, selectedMonth, selectedDate);
    console.log("reached fetch-EventsOnDate");
    res.json({ data: result });
});


router.get('/Eventtable', async (req, res) => {
    const tableContent = await karenappService.fetchEventTableFromDb();
    res.json({data: tableContent});
});

router.post("/insert-Eventtable", async (req, res) => {
    const { EventID, EventName, EventDateTime, Duration, Details, EventUsername } = req.body;
    const insertResult = await karenappService.insertEventtable(
        EventID, EventName, EventDateTime, Duration, Details, EventUsername);
    if (insertResult) {
        // const updatePostedTo = await appService.insertPostedtable(EventID, EventUsername);
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/count-Eventtable', async (req, res) => {
    const tableCount = await karenappService.countEventtable();
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

module.exports = router;