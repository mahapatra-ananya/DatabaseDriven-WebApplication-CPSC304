const express = require('express');
const allisonAppService = require('./allisonAppService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await allisonAppService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

router.get('/demotable', async (req, res) => {
    const tableContent = await allisonAppService.fetchDemotableFromDb();
    res.json({data: tableContent});
});

router.post("/initiate-demotable", async (req, res) => {
    // const initiateResult = await allisonAppService.initiateDemotable();
    const initiateResult = await allisonAppService.initiateAllTables();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-demotable", async (req, res) => {
    const { id, name, color } = req.body;
    const insertResult = await allisonAppService.insertDemotable(id, name, color);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-name-demotable", async (req, res) => {
    const { oldName, newName } = req.body;
    const updateResult = await allisonAppService.updateNameDemotable(oldName, newName);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/count-demotable', async (req, res) => {
    const tableCount = await allisonAppService.countDemotable();
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
    ///////////////////////////////////////////////////////////////////////////////////////////////
    /*GET endpoints*/
    router.get('/paymenttable', async (req, res) => {
        const tableContent = await allisonAppService.fetchPaymentTableFromDb();
        res.json({data: tableContent});
    });
    router.get('/tiertable', async (req, res) => {
        const tableContent = await allisonAppService.fetchTierTableFromDb();
        res.json({data: tableContent});
    });
    router.get('/premiumplantable', async (req, res) => {
        const tableContent = await allisonAppService.fetchPremiumPlanTableFromDb();
        res.json({data: tableContent});
    });
    router.get('/locationtable', async (req, res) => {
        const tableContent = await allisonAppService.fetchLocationTableFromDb();
        res.json({data: tableContent});
    });
    router.get('/avatartable', async (req, res) => {
        const tableContent = await allisonAppService.fetchAvatarTableFromDb();
        res.json({data: tableContent});
    });
    router.get('/useraccounttable', async (req, res) => {
        const tableContent = await allisonAppService.fetchUserAccountTableFromDb();
        res.json({data: tableContent});
    });
    router.get('/calendartable', async (req, res) => {
        const tableContent = await allisonAppService.fetchCalendarTableFromDb();
        res.json({data: tableContent});
    });
    router.get('/eventtable', async (req, res) => {
        const tableContent = await allisonAppService.fetchEventTableFromDb();
        res.json({data: tableContent});
    });
    router.get('/servertable', async (req, res) => {
        const tableContent = await allisonAppService.fetchServerTableFromDb();
        res.json({data: tableContent});
    });
    router.get('/channeltable', async (req, res) => {
        const tableContent = await allisonAppService.fetchChannelTableFromDb();
        res.json({data: tableContent});
    });
    router.get('/generalmembertable', async (req, res) => {
        const tableContent = await allisonAppService.fetchGeneralMemberTableFromDb();
        res.json({data: tableContent});
    });
    router.get('/administratortable', async (req, res) => {
        const tableContent = await allisonAppService.fetchAdministratorTableFromDb();
        res.json({data: tableContent});
    });
    router.get('/messagetable', async (req, res) => {
        const tableContent = await allisonAppService.fetchMessageTableFromDb();
        res.json({data: tableContent});
    });
    router.get('/postedtotable', async (req, res) => {
        const tableContent = await allisonAppService.fetchPostedToTableFromDb();
        res.json({data: tableContent});
    });
    router.get('/joinstable', async (req, res) => {
        const tableContent = await allisonAppService.fetchJoinsTableFromDb();
        res.json({data: tableContent});
    });

    ////////////////////////////////////////////////////////////////////////
/*CREATE SERVER*/

router.post("/insert-calendar-table", async (req, res) => {
    const { CalendarName } = req.body;
    const newCalendarId = await allisonAppService.generateCalendarId();
    console.log(`newCalendarID: ${newCalendarId}`)

    const insertResult = await allisonAppService.insertCalendarTable(newCalendarId, CalendarName);
    if (insertResult) {
        res.json({ success: true, calendarID: newCalendarId });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-server-table", async (req, res) => {
    const { ServerName, AvatarID, CalendarID, Username } = req.body;
    const newServerId = await allisonAppService.generateServerId();
    const adminsPlanID = await allisonAppService.getAdminPlanID(Username);
    console.log(`newServerID: ${newServerId} 
    \nadminPlanID: ${adminsPlanID}`)

    const insertResult = await allisonAppService.insertServerTable(newServerId, ServerName, adminsPlanID, CalendarID, AvatarID);
    if (insertResult) {
        res.json({ success: true, serverID: newServerId });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-administrator-table", async (req, res) => {
    const { Username, Tag, Signature, ServerID } = req.body;
    const insertResult = await allisonAppService.insertAdministratorTable(Username, Tag, Signature, ServerID);
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
            await allisonAppService.insertChannelTable(channelID, channel, serverID);
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

router.post('/server/calendar', async (req, res) => {
    const { CalendarID } = req.body;
    res.redirect(`/Calendar.html?calendarid=${encodeURIComponent(CalendarID)}`)
});

module.exports = router;