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

async function fetchDemotableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM DEMOTABLE');
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
                                       name VARCHAR2(20),
                                        color VARCHAR2(20)
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function insertDemotable(id, name, color) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO DEMOTABLE (id, name, color) VALUES (:id, :name, :color)`,
            [id, name, color],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

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

////////////////////////////////////////////////////////////
/*Initializing All Tables*/
async function initiateAllTables() {

    const scriptPath = path.resolve(__dirname, '../304_InitializeTables.sql');
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
            `INSERT INTO ADMINISTRATOR (Username, Tag, Signature, ServerID) VALUES (:Username, :Tag, :premiumPlanId, :calenSignaturedarId, :ServerID)`,
            [Username, Tag, Signature, ServerID],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

///////**********INSERT CHANNEL TABLE**********//
async function insertChannelTable(channelID, channel, serverId) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO CHANNEL (channelId, channel, serverId) VALUES (:channelId, :channel, :serverId)`,
            [channelID, channel, serverId],
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


///////////////////////////////////////////////////////////////////////////////

module.exports = {
    testOracleConnection,
    fetchDemotableFromDb,
    initiateDemotable,
    insertDemotable,
    updateNameDemotable,
    countDemotable,
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
    insertServerTable,
    generateServerId,
    generateCalendarId,
    getAdminPlanID,
    insertAdministratorTable,
    insertChannelTable,
    insertCalendarTable
};