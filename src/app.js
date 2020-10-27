const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const slogger = require('node-slogger');
const router = require('./routes/routes');
require('../util/envLoader');

const protocol = process.env.PROTOCOL || 'http';
const server = process.env.SERVER || 'localhost';
const port = process.env.PORT || 3000;

const app = express();

// Middlewares Section
app.use(bodyParser.json());
app.use(cors());
app.use('/api', router);

app.listen(port, server, () => {
  slogger.info(`Server is listening at ${protocol}://${server}:${port}`);
});
