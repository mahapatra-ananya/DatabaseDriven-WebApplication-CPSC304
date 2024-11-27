const express = require('express');
const appService = require('./ananyaAppService');
const {currentUser} = require("./ananyaAppService");
// const globalScript = require('../globalScript');

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

router.get("/curr-user", async (req, res) => {
    const loginResult = await appService.currUser();
    res.send(loginResult);
});

// router.get("/curr-user-display-name", async (req, res) => {
//     const loginResult = await appService.currUserDisplayName();
//     res.send(loginResult);
// });


router.get('/demotable', async (req, res) => {
    const tableContent = await appService.fetchDemotableFromDb();
    res.json({data: tableContent});
});

router.get('/allAccounts', async (req, res) => {
    const tableContent = await appService.fetchAccountsFromDb();
    res.json({data: tableContent});
});

router.get('/user-servers', async (req, res) => {
    const tableContent = await appService.fetchUserServersFromDb();
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

router.post("/insert-demotable", async (req, res) => {
    const { id, name } = req.body;
    const insertResult = await appService.insertDemotable(id, name);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-userAccount", async (req, res) => {
    const { username, password, displayName, bio, region, avatar } = req.body;
    const insertResult = await appService.insertUserAccount(username, displayName, password, bio, region, avatar);
    //const existing = appService.userExists;
    // if (existing) {
    //     res.status(500).json({ success: false });
    //     res.send('This username already exists');
    // }
    if (insertResult === 1) {
        res.json({ success: true, val: 1 });
    } else if (insertResult === 0) {
        res.status(500).json({ success: false, val: 0 });
    } else {
        res.status(500).json({ success: false, val: -1 });
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
        res.json({ success: true, serverName: isAdmin[1]});
    } else {
        res.status(500).json({ success: false, serverName: isAdmin[1]});
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


module.exports = router;