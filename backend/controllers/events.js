const Event = require('../models/event');
const Game = require('../models/games');
const mongoose = require('mongoose');
const googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_API_KEY
});

exports.getEvents = (req, res, next) => {
  res.status(200).json({message: 'Events setup'});
};

exports.getEvent = (req, res, next) => {
  Event.findById(req.params.id)
    .populate('hostId', ['_id', 'username'])
    .populate('gameId')
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
      const newEvent = new Event({
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
      });

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
            Game.findOneAndUpdate({_id: req.body.gameId }, {$push: {currentEvents: createdEvent._id}})
              .then(gameEventUpdate => {
                console.log(gameEventUpdate);
              })
              .catch(gameEventError => {
                console.log("Error updating game from new event");
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


