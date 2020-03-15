const express = require('express');
const router = express.Router();
const EventsController = require("../controllers/events");
const checkAuth = require('../middleware/check-auth');

router.get("", EventsController.getEvents);
router.post("", checkAuth, EventsController.createEvent);

router.get("/:id", EventsController.getEvent);
router.put("/:id", checkAuth, EventsController.updateEvent);

router.get("/:id/join", checkAuth, EventsController.joinEvent);
router.get("/:id/leave", checkAuth, EventsController.leaveEvent);
router.delete("/:id", checkAuth, EventsController.deleteEvent);
router.delete("/:id/:userId", checkAuth, EventsController.removeUserFromEvent);
module.exports = router;
