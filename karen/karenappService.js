const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');
const path = require('path')
const fs = require('fs')


const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};

// initialize connection pool
async function initializeConnectionPool() {
    try {
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

//TODO: CALENDAR
async function fetchCalendartableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM CALENDAR');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiateCalendartable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE CALENDAR`);
            await connection.execute(`DROP TABLE EVENT`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }
        //TODO: note to self, multiple await executes work
        //for (let query of dataArray) {
        //    if (query) {
        //        query += ");";
        //        await connection.execute(query);
        //    }
        //}
        await connection.execute(`
            CREATE TABLE EVENT (
                EventID NUMBER PRIMARY KEY,
                EventName VARCHAR2(20),
                EventDateTime TIMESTAMP,
                Duration NUMBER,
                Details VARCHAR2 (250),
                Username VARCHAR2(20)
            )
        `);

        const result = await connection.execute(`
            CREATE TABLE CALENDAR (
                CalendarID NUMBER PRIMARY KEY,
                CalendarName VARCHAR2(20),
                UserName VARCHAR2(20)
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

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

//TODO: EVENT
async function fetchEventtableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM EVENT');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiateEventtable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE EVENT`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        //const result = await connection.execute(`
        //    CREATE TABLE EVENT (
        //        EventID NUMBER PRIMARY KEY,
        //        EventName VARCHAR2(20),
        //        EventDateTime TIMESTAMP,
        //        Duration NUMBER,
        //        Details VARCHAR2 (250),
        //        Username VARCHAR2(20)
        //    )
        //`);
        return true;
    }).catch(() => {
        return false;
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

async function countEventtable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM EVENT');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}


///////////////////////////////// GLOBAL POPULATE SCRIPT //////////////////////////////////
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

module.exports = {
    testOracleConnection,

    fetchCalendartableFromDb,
    initiateCalendartable,
    insertCalendartable,
    updateNameCalendartable,
    countCalendartable,

    fetchEventtableFromDb,
    initiateEventtable,
    insertEventtable,
    countEventtable,

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
    fetchJoinsTableFromDb
};