const express = require('express');
const karenappService = require('./karenappService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await karenappService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

/////////////////////////////////////////////// CALENDAR ///////////////////////////////////////////////

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


/////////////////////////////////////////////// EVENTS ///////////////////////////////////////////////

router.post('/fetch-EventDates', async (req, res) => {

    //console.log("reached fetch-EventDates");

    const { selectedCalendar } = req.body;
    const result = await karenappService.fetchEventDates(selectedCalendar);
    res.json({ data: result });
});

router.post('/fetch-EventsOnDate', async (req, res) => {

    const { selectedCalendar, selectedYear, selectedMonth, selectedDate } = req.body;
    const result = await karenappService.fetchEventsOnDate(selectedCalendar, selectedYear, selectedMonth, selectedDate);
    // console.log("reached fetch-EventsOnDate");
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

///////////////////////////////////////////// MERGE BELOW INTO GLOBAL DIR /////////////////////////////////////////////

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
    const { Calendar1, Calendar2, Calendar3 } = req.body;
    const result = await karenappService.fetchSharedEvents(Calendar1, Calendar2, Calendar3);
    res.json({ data: result });
});

module.exports = router;