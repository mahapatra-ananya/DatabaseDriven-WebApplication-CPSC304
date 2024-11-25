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
}