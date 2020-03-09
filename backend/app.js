require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
require('./models/db');

const app = express();

const gameRoutes = require('./routes/games');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use('/api/games', gameRoutes);

module.exports = app;
