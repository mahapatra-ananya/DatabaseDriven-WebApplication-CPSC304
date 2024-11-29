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

//
// router.get('/allTiers', async (req, res) => {
//     const tableContent = await appService.fetchTiersFromDb();
//     res.json({data: tableContent});
// });
// router.get('/allMembLims', async (req, res) => {
//     const tableContent = await appService.fetchMembLimsFromDb();
//     res.json({data: tableContent});
// });
// router.get('/allPaymInts', async (req, res) => {
//     const tableContent = await appService.fetchPaymIntsFromDb();
//     res.json({data: tableContent});
// });
//
// router.get('/allThemes', async (req, res) => {
//     const tableContent = await appService.fetchThemesFromDb();
//     res.json({data: tableContent});
// });
//
// router.get('/allbps', async (req, res) => {
//     const tableContent = await appService.fetchbpsFromDb();
//     res.json({data: tableContent});
// });
//
// router.get('/allSubsPays', async (req, res) => {
//     const tableContent = await appService.fetchSubsPaysFromDb();
//     res.json({data: tableContent});
// });

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
    if (insertResult === 1) {
        res.json({ success: true, val: 1 });
    } else if (insertResult === 0) {
        res.status(500).json({ success: false, val: 0 });
    } else {
        res.status(500).json({ success: false, val: -1 });
    }
});
//
// router.get("/user-avatar", async (req, res) => {
//     const av = await userAv();
//     res.send(av);
// });

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

router.post('/server', async (req, res) => {
    const { ServerID } = req.body;
    res.redirect(`/server.html?serverid=${encodeURIComponent(ServerID)}`)
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