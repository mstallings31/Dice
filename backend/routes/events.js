const express = require('express');
const router = express.Router();
const EventsController = require('../controllers/events');
const checkAuth = require('../middleware/check-auth');

// CRUD routes for events
router.post('', checkAuth, EventsController.createEvent);
router.get('/:id', EventsController.getEvent);
router.put('/:id', checkAuth, EventsController.updateEvent);
router.delete('/:id', checkAuth, EventsController.deleteEvent);

// Retrieve all events based on latitude and longitude
router.get('', EventsController.getEvents);

// Allow users to join or leave events
router.get('/:id/join', checkAuth, EventsController.joinEvent);
router.get('/:id/leave', checkAuth, EventsController.leaveEvent);

// Allows event owner to remove users
router.delete('/:id/:userId', checkAuth, EventsController.removeUserFromEvent);

module.exports = router;
