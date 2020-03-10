require('dotenv').config();
require('./models/db');
const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');

const app = express();

// Routes
const gameRoutes = require('./routes/games');
const userRoutes = require('./routes/user');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use('/api/games', gameRoutes);
app.use('/api/user', userRoutes);

module.exports = app;
