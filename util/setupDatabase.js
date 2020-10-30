// This code is unfinished
const mysql = require('mysql');
const fs = require('fs');
const slogger = require('node-slogger');
require('./envLoader');

const createDatabase = `${__dirname}/createDatabase.sql`;
const migrateDatabase = `${__dirname}/migrateDatabase.sql`;
const populateDatabase = `${__dirname}/populateDatabase.sql`;

const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    multipleStatements: true
});

const query = (sql) => {
    return new Promise((resolve, reject) => {
        con.query(sql, (err, results) => {
            if (err){
                slogger.info(sql);
                slogger.error(err.message);
                throw new Error(err);
            }
            resolve(results);
        });
    });
}

const getReduceAffectedModifiedRows = async (query, objProperty) => {
    return query.reduce((accumulator, currentValue) => {
                return {[objProperty]: accumulator[objProperty]+currentValue[objProperty]}
    })[objProperty];
};

const showAffectedModifiedRows = async (query) => {
    const loggerInfoLength = 33;
    if(query.length > 1){
        return (' '.repeat(loggerInfoLength)+'Affected Rows: '+
                (await getReduceAffectedModifiedRows(query, 'affectedRows')).toString()+
            '\n'+' '.repeat(loggerInfoLength)+'Changed Rows: ' +
                (await getReduceAffectedModifiedRows(query, 'changedRows')).toString()).toString();
    } else {
        return (query['changedRows']+query['affectedRows']).toString;
    }
}

(async () => {
    try {
        const resultCreate = await query((fs.readFileSync(createDatabase)).toString().replace('\n', ''));
        slogger.info(`On tried Delete/Create: \n${await showAffectedModifiedRows(resultCreate)}`);

        const resultMigrate = await query((fs.readFileSync(migrateDatabase)).toString().replace('\n', ''));
        slogger.info(`Database Migrated`);
        
        const resultPopulate = await query((fs.readFileSync(populateDatabase)).toString().replace('\n', ''));
        slogger.info(`On tried populate:\n${await showAffectedModifiedRows(resultPopulate)}`);
        return;
    } finally {
        con.end();
    }
})();