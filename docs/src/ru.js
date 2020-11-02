const express = require('express');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const fs = require('fs');
const yamljs = require('js-yaml');
const opn = require('opn');
const log = require('../../src/helpers/lib/log/log');

const swaggerYAMLFile = (`${__dirname}/ru.yml`.replace('/src', ''));
const swaggerJSFile = (`${__dirname}/ru.json`.replace('/src', ''));
fs.writeFileSync(swaggerJSFile, JSON.stringify(yamljs.load(fs.readFileSync(swaggerYAMLFile, { encoding: 'utf-8' })), null, 2));
const swaggerDocument = require('../ru.json');

require('../../util/envLoader');

const protocol = process.env.DOCPROTOCOL || 'http';
const server = process.env.DOCSERVER || 'localhost';
const port = process.env.DOCPORT || 3001;

const app = express();
app.use(cors());

// Middlewares Section

app.use('/', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.listen(port, server, () => {
  log.info((`Swagger documentation is listening at ${protocol}://${server}:${port}`), null);
  opn(`${protocol}://${server}:${port}`); // Open this URL in default Browser
});
