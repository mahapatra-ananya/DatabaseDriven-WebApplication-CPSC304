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

async function fetchPremiumPlanTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM PREMIUMPLAN');
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
    fetchSharedEvents
};