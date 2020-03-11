const express = require('express');
const router = express.Router();
const EventsController = require("../controllers/events");
const checkAuth = require('../middleware/check-auth');

router.get("", EventsController.getEvents);
router.post("", checkAuth, EventsController.createEvent);

router.get("/:id", EventsController.getEvent);
router.put("/:id", checkAuth, EventsController.updateEvent);

module.exports = router;
