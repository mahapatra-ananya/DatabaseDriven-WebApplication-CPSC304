const express = require('express');
const appService = require('./appService');

const router = express.Router();

// ----------------------------------------------------------
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
    // const initiateResult = await appService.initiateDemotable();
    const initiateResult = await appService.initiateAllTables();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-demotable", async (req, res) => {
    const { id, name, color } = req.body;
    const insertResult = await appService.insertDemotable(id, name, color);
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
    ///////////////////////////////////////////////////////////////////////////////////////////////
    /*GET endpoints*/
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

module.exports = router;