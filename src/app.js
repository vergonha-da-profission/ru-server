const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const log = require('./helpers/lib/log/log');

const router = require('./routes/routes');
require('../util/envLoader');

const protocol = process.env.PROTOCOL || 'http';
const server = process.env.SERVER || 'localhost';
const port = process.env.PORT || 3000;

const app = express();

// Middlewares Section
app.use(bodyParser.json());
app.use(cors());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan(':method :url :response-time'));
}

app.use('/app', router);

app.listen(port, server, () => {
  log.info((`Server is listening at ${protocol}://${server}:${port}`), null);
});
