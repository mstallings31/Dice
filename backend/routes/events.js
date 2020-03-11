const express = require('express');
const router = express.Router();
const EventsController = require("../controllers/events");
const checkAuth = require('../middleware/check-auth');

router.get("", EventsController.getEvents);

module.exports = router;
