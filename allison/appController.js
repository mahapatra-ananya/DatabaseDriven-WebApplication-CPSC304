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
        console.log(`avatartable: ${tableContent}`)
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
router.post("/insert-servertable/:username", async (req, res) => {
    const { serverName, avatarId } = req.body;
    const newServerId = await appService.generateServerId();
    const newCalendarId = await appService.generateCalendarId();
    const adminsPlan = await appService.getAdminPlanID(req.params['username']);
    const insertResult = await appService.insertServerTable(newServerId, serverName, adminsPlan, newCalendarId, avatarId);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

module.exports = router;