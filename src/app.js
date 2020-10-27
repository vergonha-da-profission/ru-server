const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('../util/envLoader');

const protocol = process.env.PROTOCOL || 'http';
const server = process.env.SERVER || 'localhost';
const port = process.env.PORT || 3000;

// Routes import section
// exampleRoutes = require('./routes/exampleRoutes');

// Const App
const app = express();

// Middlewares Section
app.use(bodyParser.json());
app.use(cors());

// Routes use
// app.use('/api/', exampleRoutes);

app.listen(port, server, () => {
  console.log(`Server is listening at ${protocol}://${server}:${port}`);
});