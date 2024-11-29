const oracledb = require('oracledb');
const path = require('path')
const fs = require('fs')
const connection = require("oracledb/lib/connection");
require('dotenv').config();


// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASS,
    connectString: `${process.env.ORACLE_HOST}:${process.env.ORACLE_PORT}/${process.env.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};

var currentUser;

// initialize connection pool
async function initializeConnectionPool() {
    try {
        oracledb.initOracleClient({ libDir: process.env.ORACLE_DIR })
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

initializeConnectionPool();

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);


// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(); // Gets a connection from the default pool 
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}


// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

/////////////////////// GLOBAL INITIALIZE TABLE AND FETCH //////////////////////////////////////////

/*Initializing All Tables*/
async function initiateAllTables() {

    const scriptPath = path.resolve(__dirname, './304_InitializeTablesDelete.sql');
    return await withOracleDB(async (connection) => {
        try {
            // Get the SQL Script
            const sqlScript = fs.readFileSync(scriptPath, 'utf-8')
            console.log('SQL script loaded from file successfully')

            // Add ach SQL script into an array
            const sqlStatements = sqlScript.split(';').map(statement => statement.trim());

            // Execute each SQL statement
            for (const statement of sqlStatements) {
                if (statement.length > 0) {
                    console.log(`Executing statement: ${statement}`);
                    if (statement.includes('INSERT')) {
                        await connection.execute(statement, [] ,{autoCommit: true})
                    } else {
                        await connection.execute(statement)
                    }

                }
            }

            console.log('All SQL statements executed successfully')
            return true;
        } catch (err) {
            console.log('Error reading SQl script', err)
            return false;
        }
    })
}

/*GET methods for Tables*/
// async function fetchPaymentTableFromDb() {
//     return await withOracleDB(async (connection) => {
//         const result = await connection.execute('SELECT * FROM PAYMENT');
//         return result.rows;
//     }).catch(() => {
//         return [];
//     });
// }
//
// async function fetchTierTableFromDb() {
//     return await withOracleDB(async (connection) => {
//         const result = await connection.execute('SELECT * FROM TIER');
//         return result.rows;
//     }).catch(() => {
//         return [];
//     });
// }

// async function fetchPremiumPlanTableFromDb() {
//     return await withOracleDB(async (connection) => {
//         const result = await connection.execute('SELECT * FROM PREMIUMPLAN');
//         return result.rows;
//     }).catch(() => {
//         return [];
//     });
// }

// async function fetchLocationTableFromDb() {
//     return await withOracleDB(async (connection) => {
//         const result = await connection.execute('SELECT * FROM LOCATION');
//         return result.rows;
//     }).catch(() => {
//         return [];
//     });
// }
//
// async function fetchAvatarTableFromDb() {
//     return await withOracleDB(async (connection) => {
//         const result = await connection.execute('SELECT * FROM AVATAR');
//         return result.rows;
//     }).catch(() => {
//         return [];
//     });
// }

// async function fetchUserAccountTableFromDb() {
//     return await withOracleDB(async (connection) => {
//         const result = await connection.execute('SELECT * FROM USERACCOUNT');
//         return result.rows;
//     }).catch(() => {
//         return [];
//     });
// }
//
// async function fetchCalendarTableFromDb() {
//     return await withOracleDB(async (connection) => {
//         const result = await connection.execute('SELECT * FROM CALENDAR');
//         return result.rows;
//     }).catch(() => {
//         return [];
//     });
// }
//
// async function fetchEventTableFromDb() {
//     return await withOracleDB(async (connection) => {
//         const result = await connection.execute('SELECT * FROM EVENT');
//         return result.rows;
//     }).catch(() => {
//         return [];
//     });
// }
//
// async function fetchServerTableFromDb() {
//     return await withOracleDB(async (connection) => {
//         const result = await connection.execute('SELECT * FROM SERVER');
//         return result.rows;
//     }).catch(() => {
//         return [];
//     });
// }
//
// async function fetchChannelTableFromDb() {
//     return await withOracleDB(async (connection) => {
//         const result = await connection.execute('SELECT * FROM CHANNEL');
//         return result.rows;
//     }).catch(() => {
//         return [];
//     });
// }
//
// async function fetchGeneralMemberTableFromDb() {
//     return await withOracleDB(async (connection) => {
//         const result = await connection.execute('SELECT * FROM GENERALMEMBER');
//         return result.rows;
//     }).catch(() => {
//         return [];
//     });
// }
//
// async function fetchAdministratorTableFromDb() {
//     return await withOracleDB(async (connection) => {
//         const result = await connection.execute('SELECT * FROM ADMINISTRATOR');
//         return result.rows;
//     }).catch(() => {
//         return [];
//     });
// }
//
// async function fetchMessageTableFromDb()
// {
//     return await withOracleDB(async (connection) => {
//         const result = await connection.execute('SELECT * FROM MESSAGE');
//         return result.rows;
//     }).catch(() => {
//         return [];
//     });
// }
//
// async function fetchPostedToTableFromDb() {
//     return await withOracleDB(async (connection) => {
//         const result = await connection.execute('SELECT * FROM POSTEDTO');
//         return result.rows;
//     }).catch(() => {
//         return [];
//     });
// }
//
// async function fetchJoinsTableFromDb() {
//     return await withOracleDB(async (connection) => {
//         const result = await connection.execute('SELECT * FROM JOINS');
//         return result.rows;
//     }).catch(() => {
//         return [];
//     });
// }

async function fetchUsernames(){
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Username FROM UserAccount');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

////////////////////////////////////////// ALLISON  //////////////////////////////////////////
/***CREATE SERVER***/
async function insertServerTable(serverId, serverName, premiumPlanId, calendarId, avatarId) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO SERVER (ServerID, ServerName, PlanID, CalendarID, AvatarID) VALUES (:serverId, :serverName, :premiumPlanId, :calendarId, :avatarId)`,
            [serverId, serverName, premiumPlanId, calendarId, avatarId],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}
async function generateServerId() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT MAX(SERVERID) FROM SERVER`
        );
        return Number(result.rows[0][0]) + 1;
        // return Number(result.rows[0][0]);
    }).catch(() => {
        return false;
    });
}

async function generateCalendarId() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT MAX(CALENDARID) FROM CALENDAR`
        );

        return Number(result.rows[0][0]) + 1;
        // return Number(result.rows[0][0]);
    }).catch(() => {
        return false;
    });
}

async function getAdminPlanID(currentUsername) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT PlanID FROM USERACCOUNT WHERE username=:currentUsername`, [currentUsername]
        );

        return result.rows[0][0];
    }).catch(() => {
        return false;
    });
}

///////**********INSERT ADMINISTRATOR TABLE**********//
async function insertAdministratorTable(Username, Tag, Signature, ServerID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO ADMINISTRATOR (Username, Tag, Signature, ServerID) VALUES (:Username, :Tag, :Signature, :ServerID)`,
            [Username, Tag, Signature, ServerID],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

///////**********INSERT CHANNEL TABLE**********//
async function insertChannelTable(ChannelID, ChannelTitle, ServerID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO CHANNEL (ChannelID, ChannelTitle, ServerID) VALUES (:ChannelID, :ChannelTitle, :ServerID)`,
            [ChannelID, ChannelTitle, ServerID],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

///////**********INSERT CALENDAR TABLE**********//
async function insertCalendarTable(CalendarID, CalendarName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO CALENDAR (CalendarID, CalendarName, Username) VALUES (:CalendarID, :CalendarName, null)`,
            [CalendarID, CalendarName],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

/////////////////***************JOIN SERVER QUERIES*********************************////////
async function fetchFilteredUserServers(Username){
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT DISTINCT s.ServerID, s.ServerName, s.AvatarID, s.PlanID
FROM Server s, PremiumPlan p, Joins j
WHERE (s.PlanID = p.PlanID OR s.PlanID IS NULL)
  AND s.ServerID NOT IN (SELECT j1.ServerID FROM Joins j1 WHERE j1.MemberUsername =:Username) 
  AND s.ServerID NOT IN (SELECT a.ServerID FROM Administrator a WHERE a.Username =:Username)
  AND (s.ServerID IN (SELECT DISTINCT s1.ServerID
                      FROM Server s1, PremiumPlan p1
                      WHERE s1.PlanID = p1.PlanID
                        AND p1.MemberLimit > (SELECT Count(DISTINCT j2.ServerID) FROM Joins j2 WHERE j2.ServerID = s1.ServerID)) 
      OR s.ServerID IN (SELECT DISTINCT s2.ServerID
                        FROM Server s2
                        WHERE s2.PlanID IS NULL
                          and s2.ServerID IN (SELECT j3.ServerID FROM Joins j3 GROUP BY j3.ServerID HAVING Count(j3.ServerID) < 5)))
                          ORDER BY s.ServerID`,
            [Username])
        return result.rows;
    }).catch(() => {
        return false;
    });
}

/*Insert Joins Table*/
async function insertJoinsTable(Username, ServerID){
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO JOINS (MemberUsername, ServerID, JoinDate) VALUES (:Username, :ServerID, CURRENT_DATE)`,
            [Username, ServerID],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

/*Insert GeneralMember Table*/
async function insertGeneralMemberTable(Username){
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO GENERALMEMBER (Username, Signature) VALUES (:Username, null)`,
            [Username],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function isUserGeneralMember(Username) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT Username FROM GENERALMEMBER WHERE username=:Username`, [Username]
        );

        return result.rows.length !==0;
    }).catch(() => {
        return false;
    });
}

async function fetchServerPageInfo(ServerID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT s.ServerName, s.AvatarID, s.PlanID, s.CalendarID, p.Tier, p.MemberLimit, p.Theme
       FROM Server s, PremiumPlan p 
       WHERE s.ServerID=:ServerID
       AND s.PlanID=p.PlanID`,
            [ServerID]
        );

        return result.rows;
    }).catch(() => {
        return false;
    });
}

async function fetchServerPageChannels(ServerID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT ChannelID, ChannelTitle
            FROM Channel
       WHERE ServerID=:ServerID`,
            [ServerID]
        );

        return result.rows;
    }).catch(() => {
        return false;
    });
}

async function fetchFilteredEvents(QueryString) {
    console.log(QueryString)
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(QueryString);

        return result.rows;
    }).catch(() => {
        return false;
    });
}

async function fetchEventDetails(EventID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT EventName, EventDateTime, Duration, Details, Username
            FROM Event
       WHERE EventID=:EventID`,
            [EventID]
        );

        return result.rows;
    }).catch(() => {
        return false;
    });
}

async function updateEventDetails(EventID, EventName, Duration, Details, Username ) {
    console.log("appService", EventID, EventName, Duration, Details, Username )
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE EVENT
              SET EventName = :EventName, Duration = :Duration, Details = :Details, Username = :Username
       WHERE EventID=:EventID`,
            [EventID, EventName, Duration, Details, Username ],
        );

        const result2 = await connection.execute('commit');
        return true;
    }).catch(() => {
        return false;
    });
}

////////////////////////////////////////////// KAREN //////////////////////////////////////////////////
async function insertCalendartable(CalendarID, CalendarName, UserName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO CALENDAR (CalendarID, CalendarName, UserName) 
            VALUES (:CalendarID, :CalendarName, :UserName)`,
            [CalendarID, CalendarName, UserName],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateNameCalendartable(oldName, newName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE CALENDAR SET CalendarName=:newName where CalendarName=:oldName`,
            [newName, oldName],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function countCalendartable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM CALENDAR');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}


async function fetchEventDates(selectedCalendar) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'SELECT e.EventDateTime FROM Event e, PostedTo p WHERE e.EventID = p.EventID AND p.CalendarID=:selectedCalendar', [selectedCalendar]
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchEventsOnDate(selectedCalendar, selectedYear, selectedMonth, selectedDate) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'SELECT e.EventID, e.EventName, e.EventDateTime, e.Duration, e.Details ' +
            'FROM Event e, PostedTo p WHERE e.EventID = p.EventID AND p.CalendarID=:selectedCalendar ' +
            'AND EXTRACT( YEAR FROM e.EventDateTime) =:selectedYear AND EXTRACT( MONTH FROM e.EventDateTime) =:selectedMonth ' +
            'AND EXTRACT( DAY FROM e.EventDateTime) =:selectedDate', [selectedCalendar, selectedYear, selectedMonth, selectedDate]
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function countEventtable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM EVENT');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

async function insertEventtable(EventID, EventName, EventDateTime, Duration, Details, EventUsername) {

    const testTime = new Date(EventDateTime);

    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO EVENT (EventID, EventName, EventDateTime, Duration, Details, Username) 
            VALUES (:EventID, :EventName, :testTime, :Duration, :Details, :EventUsername)`,
            [EventID, EventName, testTime, Duration, Details, EventUsername],
            { autoCommit: true }
        );
        console.log(testTime);
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        console.log(testTime);
        return false;
    });
}



//////DELETE EVENT//////

//////////////////////////////////DELETE EVENT//////////////////////////////////////

async function deleteEvent(eventID) {
    return await withOracleDB(async (connection) => {
        // console.log(region);

        const result = await connection.execute(
            'DELETE FROM Event where EventID=:eventID',
            [eventID],
            // { autoCommit: true }
        );
        const result2 = await connection.execute('commit');

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

/////////////////////////////////Karen's additions
async function fetchBusyUser() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'SELECT DISTINCT COUNT(e.EventID) as EventCount, e.Username as Users ' +
            'FROM Event e GROUP BY e.Username ORDER BY COUNT(e.EventID)');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchBusyMonth(userLimit) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'SELECT SUM(e.Duration) as TotalHours, EXTRACT(MONTH FROM e.EventDateTime) as Month, ' +
            'EXTRACT(YEAR FROM e.EventDateTime) as Year FROM Event e ' +
            'GROUP BY EXTRACT( MONTH FROM e.EventDateTime), EXTRACT(YEAR FROM e.EventDateTime) ' +
            'HAVING SUM(e.Duration) > :userLimit ORDER BY SUM(e.Duration) DESC', [userLimit]
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchSharedEvents(query) {
    console.log(query);
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(query);
        return result.rows;
    }).catch(() => {
        return [];
    });
}

///////////////////////////////////////////// ANANYA
async function fetchAccountsFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM UserAccount');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchUserServersFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT distinct s.ServerID, ServerName FROM Server s, Joins j WHERE j.MemberUsername=:currentUser', [currentUser]);
        console.log(result.rows);
        return result.rows;
    }).catch(() => {
        return [];
    });
}


async function initiateDemotable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE DEMOTABLE`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE DEMOTABLE (
                id NUMBER PRIMARY KEY,
                name VARCHAR2(20)
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function insertDemotable(id, name) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO DEMOTABLE (id, name) VALUES (:id, :name)`,
            [id, name],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}



async function insertUserAccount(username, displayName, password, bio, region, avatar) {
    return await withOracleDB(async (connection) => {
        // console.log(region);

        const retVal = await connection.execute(
            'SELECT Count(*) FROM UserAccount WHERE UserAccount.Username=:username', [username]
        );
        if (retVal.rows[0][0] > 0) {return 0;}

        const av = await getAvatarIDFromIcon(avatar);

        const result = await connection.execute(
            `INSERT INTO UserAccount(Username, DisplayName, UserPassword, Bio, Region, AvatarID, PlanID)
             VALUES (:username, :displayName, :password, :bio, :region, :av, NULL)`,
            [username, displayName, password, bio, region, av],
            { autoCommit: true }
        );
        currentUser = username;
        if (result.rowsAffected && result.rowsAffected > 0) {
            return 1;
        }
    }).catch(() => {
        return -1;
    });
}

async function getAvatarIDFromIcon(icon) {
    console.log(icon);
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'SELECT distinct AvatarID FROM Avatar WHERE Avatar.IconDescription=:icon', [icon]
        );
        console.log(result.rows);
        return result.rows[0][0];
    }).catch(() => {
        return 0;
    });
}

async function editPassword(password) {
    return await withOracleDB(async (connection) => {
        // console.log(region);

        const result = await connection.execute(
            'UPDATE UserAccount SET UserPassword=:password where Username=:currentUser',
            [password, currentUser],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function editDN(displayName) {
    return await withOracleDB(async (connection) => {
        // console.log(region);

        const result = await connection.execute(
            'UPDATE UserAccount SET DisplayName=:displayName where Username=:currentUser',
            [displayName, currentUser],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}
async function editBio(bio) {
    return await withOracleDB(async (connection) => {
        // console.log(region);

        const result = await connection.execute(
            'UPDATE UserAccount SET Bio=:bio where Username=:currentUser',
            [bio, currentUser],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}
async function editRegion(region) {
    return await withOracleDB(async (connection) => {
        // console.log(region);

        const result = await connection.execute(
            'UPDATE UserAccount SET Region=:region where Username=:currentUser',
            [region, currentUser],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function editAvatar(avatar) {
    return await withOracleDB(async (connection) => {
        // console.log(region);
        const av = await getAvatarIDFromIcon(avatar);

        const result = await connection.execute(
            'UPDATE UserAccount SET AvatarID=:av where Username=:currentUser',
            [av, currentUser],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function deleteAccount() {
    return await withOracleDB(async (connection) => {
        // console.log(region);

        const result = await connection.execute(
            'DELETE FROM UserAccount where Username=:currentUser',
            [currentUser],
            // { autoCommit: true }
        );
        const result2 = await connection.execute('commit');

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function purchasePlan(purchase) {
    // console.log(purchase);
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE UserAccount SET PlanID=:purchase where Username=:currentUser`,
            [purchase, currentUser],
            { autoCommit: true }
        );
        console.log(result);

        const isAdmin = await checkIfAdmin();
        if (isAdmin[0]) {
            const result2 = await connection.execute(
                `UPDATE Server SET PlanID=:purchase where ServerID=(Select Server.ServerID FROM Server, Administrator WHERE Server.ServerID = Administrator.ServerID AND Administrator.Username=:currentUser)`,
                [purchase, currentUser]
            );
            const result3 = await connection.execute(`commit`);
            console.log(result2)

            return (result.rowsAffected && result.rowsAffected > 0) && (result2.rowsAffected && result2.rowsAffected > 0);
        } else {
            return result.rowsAffected && result.rowsAffected > 0;
        }
    }).catch(() => {
        return false;
    });
}

async function loginUser(username, passwordInput) {
    return await withOracleDB(async (connection) => {

        const retVal = await connection.execute(
            'SELECT Count(*) FROM UserAccount WHERE UserAccount.Username=:username', [username]
        );
        if (retVal.rows[0][0] === 0) {return 0;} //username does not exist
        else {
            const passVal = await connection.execute(
                'SELECT UserPassword FROM UserAccount WHERE UserAccount.Username=:username', [username]
            );
            if (passwordInput === passVal.rows[0][0]) {
                currentUser = username;
                return 1;
            } else {
                return 2;
            }
        }
    }).catch(() => {
        return -1;
    });
}

async function projectPlans(pID, tier, pI, mL, theme, bP, sP) {
    let selectedColumns = [];

    // Add the corresponding columns to the selectedColumns array based on the flags
    if (pID) {
        selectedColumns.push('PlanID'); // Assuming pID is a column in PremiumPlan
    }
    if (tier) {
        selectedColumns.push('PremiumPlan.Tier'); // Assuming 'tier' is a column in Tier
    }
    if (pI) {
        selectedColumns.push('PremiumPlan.PaymentInterval'); // Assuming pI is a column in PaymentInterval
    }
    if (mL) {
        selectedColumns.push('MemberLimit'); // Assuming mL is a column in PremiumPlan
    }
    if (theme) {
        selectedColumns.push('Theme'); // Assuming theme is a column in PremiumPlan
    }
    if (bP) {
        selectedColumns.push('BasePrice'); // Assuming bP is a column in PremiumPlan
    }
    if (sP) {
        selectedColumns.push('SubscriptionPayment'); // Assuming sP is a column in PremiumPlan
    }

    if (selectedColumns.length === 0) {
        return [];
    }

    let columnsString = selectedColumns.join(', ');

    console.log(`Generated SQL Query: SELECT ${columnsString} FROM PremiumPlan INNER JOIN Tier ON PremiumPlan.Tier = Tier.Tier INNER JOIN Payment ON PremiumPlan.PaymentInterval = Payment.PaymentInterval`);

    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT ${columnsString}
             FROM PremiumPlan
                      INNER JOIN Tier ON PremiumPlan.Tier = Tier.Tier
                      INNER JOIN Payment ON PremiumPlan.PaymentInterval = Payment.PaymentInterval`
        );
        console.log(result.rows);
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function checkIfAdmin() {
    return await withOracleDB(async (connection) => {

        const retVal = await connection.execute(
            'SELECT Count(*) FROM Administrator WHERE Administrator.Username=:currentUser', [currentUser]
        );
        if (retVal.rows[0][0] !== 0) { // if user is an admin
            const serverName = await connection.execute(
                'SELECT distinct ServerName, Server.ServerID FROM Administrator, Server WHERE Administrator.Username=:currentUser AND Administrator.ServerID=Server.ServerID', [currentUser]
            );
            return [true, serverName.rows[0][0], serverName.rows[0][1]];
        } else {
            return [false, "", ""]

        }
    }).catch(() => {
        return false;
    });
}

async function checkIfHasPremium() {
    return await withOracleDB(async (connection) => {

        const retVal = await connection.execute(
            'SELECT PlanID FROM UserAccount WHERE UserAccount.Username=:currentUser', [currentUser]
        );
        const plan = retVal.rows[0][0];
        return [plan !== null, plan];
    }).catch(() => {
        return false;
    });
}

function currUser() {
    return currentUser;
}
// function currUserDisplayName() {
//     return currentUser;
// }

async function updateNameDemotable(oldName, newName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE DEMOTABLE SET name=:newName where name=:oldName`,
            [newName, oldName],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function countDemotable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM DEMOTABLE');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

/*GET methods for Tables*/
async function fetchPaymentTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM PAYMENT');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchTierTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM TIER');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchUserDetailsFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'SELECT distinct DisplayName, Username, Bio, UserAccount.Region, Country, IconDescription FROM UserAccount, Location, Avatar WHERE Username=:currentUser AND UserAccount.Region=Location.Region AND Avatar.AvatarID = UserAccount.AvatarID', [currentUser]
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchPremiumPlanTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT distinct PlanID, PREMIUMPLAN.Tier, PREMIUMPLAN.PaymentInterval, MemberLimit, Theme, BasePrice, SubscriptionPayment FROM PREMIUMPLAN, PAYMENT, TIER WHERE PREMIUMPLAN.Tier=Tier.Tier AND PREMIUMPLAN.PaymentInterval=Payment.PaymentInterval');
        // console.log(result.rows)
        return result.rows;

    }).catch(() => {
        return [];
    });
}

async function fetchPremiumPlanIDsFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT distinct PlanID FROM PREMIUMPLAN');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchAvatarIDsFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT distinct AvatarID FROM AVATAR');
        // console.log(result.rows);
        return result.rows;

    }).catch(() => {
        return [];
    });
}

async function fetchAvatarsFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT distinct IconDescription FROM AVATAR');
        // console.log(result.rows);
        return result.rows;
    }).catch(() => {
        return [];
    });
}


async function fetchRegionsFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT distinct Region FROM LOCATION');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchLocationTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM LOCATION');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchAvatarTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM AVATAR');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchUserAccountTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM USERACCOUNT');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchCalendarTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM CALENDAR');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchEventTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM EVENT');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchServerTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM SERVER');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchChannelTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM CHANNEL');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchGeneralMemberTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM GENERALMEMBER');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchAdministratorTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM ADMINISTRATOR');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchMessageTableFromDb()
{
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM MESSAGE');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchPostedToTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM POSTEDTO');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchJoinsTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM JOINS');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

/***CREATE SERVER***/


module.exports = {
    testOracleConnection,

    initiateAllTables,
    fetchPaymentTableFromDb,
    fetchTierTableFromDb,
    fetchPremiumPlanTableFromDb,
    fetchLocationTableFromDb,
    fetchAvatarTableFromDb,
    fetchUserAccountTableFromDb,
    fetchCalendarTableFromDb,
    fetchEventTableFromDb,
    fetchServerTableFromDb,
    fetchChannelTableFromDb,
    fetchGeneralMemberTableFromDb,
    fetchAdministratorTableFromDb,
    fetchMessageTableFromDb,
    fetchPostedToTableFromDb,
    fetchJoinsTableFromDb,
    fetchUsernames,
    updateEventDetails,
    deleteEvent,
    fetchFilteredEvents,
    insertServerTable,
    generateServerId,
    generateCalendarId,
    getAdminPlanID,
    insertAdministratorTable,
    insertChannelTable,
    insertCalendarTable,
    fetchFilteredUserServers,
    insertJoinsTable,
    insertGeneralMemberTable,
    isUserGeneralMember,
    fetchServerPageInfo,
    fetchServerPageChannels,
    fetchEventDetails,

    insertCalendartable,
    updateNameCalendartable,
    countCalendartable,
    insertEventtable,
    countEventtable,
    fetchEventDates,
    fetchEventsOnDate,
    fetchCalendarTableFromDb,
    fetchEventTableFromDb,

    fetchBusyUser,
    fetchBusyMonth,
    fetchSharedEvents,

    insertUserAccount,
    fetchAccountsFromDb,
    loginUser,
    currUser,
    checkIfAdmin,
    checkIfHasPremium,
    initiateDemotable,
    insertDemotable,
    updateNameDemotable,
    countDemotable,
    fetchUserServersFromDb,
    purchasePlan,
    fetchAvatarIDsFromDb,
    fetchRegionsFromDb,
    fetchUserDetailsFromDb,
    editAvatar,
    editRegion,
    editPassword,
    editBio,
    editDN,
    fetchPaymentTableFromDb,
    fetchTierTableFromDb,
    fetchPremiumPlanTableFromDb,
    fetchPremiumPlanIDsFromDb,
    deleteAccount,
    projectPlans,
    fetchAvatarsFromDb,
};