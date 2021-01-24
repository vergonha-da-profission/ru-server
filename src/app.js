const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
// const opn = require('opn');
const path = require('path');
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
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  (err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      return res.status(400).json({
        message: 'Bad Request',
      });
    }
    return next(err);
  },
);
app.use('/public', express.static(path.join(__dirname, '../', 'public')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan(':method :url :response-time'));
  log.info((`Swagger documentation is listening at ${protocol}://${server}:${port}/api/doc`), null);
  // Open this URL in default Browser
  // opn(`${protocol}://${server}:${port}/api/doc`);
}
app.use('/api', router);

app.listen(port, server, () => {
  log.info((`Server is listening at ${protocol}://${server}:${port}`), null);
});

require('./ws');
