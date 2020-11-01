// This code is unfinished
const mysql = require('mysql');
const fs = require('fs');
const log = require('../../src/helpers/lib/log/log');
require('../envLoader');

const createDatabase = `${__dirname}/createDatabase.sql`;
const migrateDatabase = `${__dirname}/migrateDatabase.sql`;
const populateDatabase = `${__dirname}/populateDatabase.sql`;

const con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  multipleStatements: true,
});

const query = (sql) => new Promise((resolve) => {
  con.query(sql, (err, results) => {
    if (err) {
      log.error(err.message, null);
      throw new Error(err);
    }
    resolve(results);
  });
});

const getReduceAffectedModifiedRows = async (rows, objProperty) => rows
  .reduce((accumulator, currentValue) => ({
    [objProperty]: accumulator[objProperty] + currentValue[objProperty],
  }))[objProperty];

const showAffectedModifiedRows = async (rows) => {
  const loggerInfoLength = 33;
  if (rows.length > 1) {
    return (`${' '.repeat(loggerInfoLength)}Affected Rows: ${
      (await getReduceAffectedModifiedRows(rows, 'affectedRows')).toString()
    }\n${' '.repeat(loggerInfoLength)}Changed Rows: ${
      (await getReduceAffectedModifiedRows(rows, 'changedRows')).toString()}`).toString();
  }
  return (rows.changedRows + rows.affectedRows).toString;
};

(async () => {
  try {
    const resultCreate = await query((fs.readFileSync(createDatabase)).toString().replace('\n', ''));
    log.debug(`On tried Delete/Create: \n${await showAffectedModifiedRows(resultCreate)}`, null);

    await query((fs.readFileSync(migrateDatabase)).toString().replace('\n', ''));
    log.debug('Database Migrated', null);

    const resultPopulate = await query((fs.readFileSync(populateDatabase)).toString().replace('\n', ''));
    log.debug(`On tried populate:\n${await showAffectedModifiedRows(resultPopulate)}`, null);
    return;
  } finally {
    con.end();
  }
})();
