const Event = require('../models/event');
const Game = require('../models/games');
const User = require('../models/user');

const mongoose = require('mongoose');
const googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_API_KEY
});

exports.getEvents = (req, res, next) => {
  if (!req.query.lng || !req.query.lat) {
    return res.status(500).json({
      "message": "lng and lat query parameters are required"
    });
  }
  const lng = parseFloat(req.query.lng);
  const lat = parseFloat(req.query.lat);
  // If distance is not provided as a query paramter then use 20km
  const distance = parseFloat(req.query.distance) || 20000;

  Event.find({
    coords: {
      $nearSphere: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        $maxDistance: distance
  }}})
  .populate('gameId')
  .then(response => {
    res.status(200).json(response);
  })
  .catch(error => {
    res.status(500).json(error);
  });

};

exports.getEvent = (req, res, next) => {
  Event.findById(req.params.id)
    .populate('hostId', ['_id', 'username'])
    .populate('gameId')
    .populate('attendees', ['_id', 'username'])
    .then(event => {
      if (event) {
        res.status(200).json(event);
      } else {
        res.status(404).json({ message: 'Event not found' });
      }
    })
    .catch( error => {
      res.status(500).json({
        message: 'Fetching event failed!',
        error: error
      });
    })
};

exports.updateEvent = (req, res, next) => {
  const fullAddress = req.body.streetAddress + "," +
                      req.body.city + "," +
                      req.body.state + "," +
                      req.body.zipCode;
  googleMapsClient.geocode({
    address: fullAddress
  },
  function(gError, response) {
    if(!gError) {
      const newEvent = {
        _id: req.body.eventId,
        hostId: req.userData._id,
        hostUsername: req.userData.username,
        gameId: req.body.gameId,
        date: new Date(req.body.date),
        streetAddress: req.body.streetAddress,
        city: req.body.city,
        state: req.body.state,
        zipCode: req.body.zipCode,
        eventDetails: req.body.eventDetails,
        coords: {
          type: "Point",
          coordinates: [
            response.json.results[0].geometry.location.lng,
            response.json.results[0].geometry.location.lat]
        }
      };

      Event.updateOne({_id: req.params.id }, newEvent)
        .then(updatedEvent => {
          // Event creation was sucessful
          res.status(201).json(updatedEvent);
        })
        .catch(error => {
          // Error message when saving event to mongoDB
          res.status(500).json({
            message: 'Event update failed',
            error: error
          })
        })
    } else {
      // There was an error from geolocation
      res.status(500).json({
        message: "Geolocation error",
        error: gError
      })
    }
  });
};

exports.createEvent = (req, res, next) => {
  const fullAddress = req.body.streetAddress + "," +
                      req.body.city + "," +
                      req.body.state + "," +
                      req.body.zipCode;
  googleMapsClient.geocode({
    address: fullAddress
  },
  function(gError, response) {
    if(!gError) {
      const newEvent = new Event({
        hostId: req.userData._id,
        hostUsername: req.userData.username,
        gameId: req.body.gameId,
        date: new Date(req.body.date),
        streetAddress: req.body.streetAddress,
        city: req.body.city,
        state: req.body.state,
        zipCode: req.body.zipCode,
        eventDetails: req.body.eventDetails,
        coords: {
          type: "Point",
          coordinates: [
            response.json.results[0].geometry.location.lng,
            response.json.results[0].geometry.location.lat]
        }
      });

      newEvent.save()
        .then(createdEvent => {
          // Add the new event to the game it belongs too
            Game.findOneAndUpdate({_id: req.body.gameId }, {
              $push: {currentEvents: createdEvent._id},
              $inc: {eventCount: 1}})
              .then(gameEventUpdate => {
                // Logging for adding new event to a game
                User.updateOne({_id: req.userData._id},
                  {$push: { events: createdEvent._id }})
                  .then(userResponse => {
                    // Logging for user getting new event
                  })
                })
              .catch(gameEventError => {
                // Logging for errors for adding a new event to a game
              });
          res.status(200).json(createdEvent);
        })
        .catch(error => {
          // Error message when saving event to mongoDB
          res.status(500).json({
            message: 'Event creation failed',
            error: error
          })
        });
    } else {
      // There was an error from geolocation
      res.status(500).json({
        message: "Geolocation error",
        error: gError
      })
    }
  });
};

exports.joinEvent = (req, res, next) => {
  Event.updateOne({ _id: req.params.id, hostId: {$ne: req.userData._id }}, {$push: {attendees: req.userData._id}})
  .then(response => {
    if (response.n !== 0) {
      User.updateOne({_id: req.userData._id}, {$push: {events: req.params.id }})
      .then(userResponse => {
        res.status(200).json(userResponse);
      })
      .catch(userError => {
        res.status(500).json(userError);
      })
    } else {
      res.status(200).json(response);
    }
  })
  .catch(error => {
    res.status(500).json(error);
  });
};

exports.leaveEvent = (req, res, next) => {
  Event.updateOne({_id: req.params.id, hostId: {$ne: req.userData._id }}, {$pull: {attendees: req.userData._id}})
  .then(eventReponse => {
    if (eventReponse.n !== 0) {
      User.updateOne({_id: req.userData._id}, {$pull: {events: req.params.id}})
        .then(userResponse => {
        res.status(200).json(userResponse);
    })
  } else {
    res.status(200).json(eventResponse);
  }
  })
  .catch(error => {
    res.status(500).json(error);
  });
};


