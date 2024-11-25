const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

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
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

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
            `INSERT INTO CALENDAR (CalendarID, CalendarName, UserName) VALUES (:CalendarID, :CalendarName, :UserName)`,
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



module.exports = {
    testOracleConnection,
    fetchCalendartableFromDb,
    initiateCalendartable,
    insertCalendartable,
    updateNameCalendartable,
    countCalendartable
};