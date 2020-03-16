const Event = require('../models/event');
const Game = require('../models/games');
const User = require('../models/user');

// Retrieve lat and lng from google api
const googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_API_KEY
});

// Function: createEvent()
// Purpose: Creates a new event in the database.
//          Requires that the request body contains
//          a streetAddress, city, state, zipCode, gameId, date
//          eventDetails
exports.createEvent = (req, res, next) => {
  const fullAddress = req.body.streetAddress + "," +
                      req.body.city + "," +
                      req.body.state + "," +
                      req.body.zipCode;

   // Retrieve lat/lng information based on address provided
  googleMapsClient.geocode({
    address: fullAddress
  }, function(googleError, response) {
    // Create a new event and attempt to save it to the database
    if(!googleError) {
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
            response.json.results[0].geometry.location.lat]}
      });

      newEvent.save()
        .then(createdEvent => {
          // Add the new event to the game it belongs to
          Game.findByIdAndUpdate(req.body.gameId,
            {
              $push: {currentEvents: createdEvent._id},
              $inc: {eventCount: 1}
            })
            .then(gameEventUpdate => {
              console.log('General:event-controller-createEvent():Updated Game Event - ' + req.body.gameId);
              // Update the user that created the event
              User.updateOne({_id: req.userData._id},
                {
                  $push: { events: createdEvent._id }
                })
                .then(userResponse => {
                  console.log('General:event-controller-createEvent():Updated User Event - ' + req.userData._id);
                  })
                })
                .catch(userUpdateError => {
                  console.log('Error:event-controller-createEvent():Updated User Error - ' + userUpdateError);
                })
              .catch(gameEventError => {
                console.log('Error:event-controller-createEvent():Updated Event Error - ' + gameEventError);
              });
          res.status(200).json(createdEvent);
        })
        .catch(eventCreationError => {
          console.log('Error:event-controller-createEvent():Event Creation - ' + eventCreationError);
          res.status(500).json({
            error: 'Event creation failed',
          });
        });
    } else {
      // There was an error from geolocation
      console.log('Error:event-controller-createEvent():Event Creation Google - ' + googleError);
      res.status(500).json({
        message: "Geolocation error",
      });
    }
  });
};

// Function: getEvent()
// Purpose: Retrieves an event based on the id passed in as a parameter
//          Requires a url parameter of id to be passed in
exports.getEvent = (req, res, next) => {
  Event.findById(req.params.id)
    .populate('hostId', ['_id', 'username'])
    .populate('gameId')
    .populate('attendees', ['_id', 'username'])
    .then(foundEvent => {
      if (foundEvent) {
        res.status(200).json(foundEvent);
      } else {
        res.status(404).json({
          message: 'Event not found'
        });
      }
    })
    .catch( error => {
      console.log('Error:event-controller-getEvent():Event Retrieval - ' + error);
      res.status(500).json({
        error: 'Fetching event failed!',
      });
    });
};

// Function: updateEvent()
// Purpose: Retrieves an event based on the id passed in as a parameter
//          Requires a url parameter of id to be passed in and the user to
//          authenticated and owns the event
exports.updateEvent = (req, res, next) => {
  const fullAddress = req.body.streetAddress + "," +
                      req.body.city + "," +
                      req.body.state + "," +
                      req.body.zipCode;

   // Retrieve lat/lng information based on address provided
  googleMapsClient.geocode({
    address: fullAddress
  }, function(googleError, response) {
    if(!googleError) {
      // Create an object to update the event with new data
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
            response.json.results[0].geometry.location.lat]}
      };

      Event.find({_id: req.params.id, hostId: req.userData._id}, newEvent)
        .then(updatedEvent => {
          // Event creation was sucessful
          res.status(201).json(updatedEvent);
        })
        .catch(updateFailed => {
          console.log('Error:event-controller-updateEvent():Event Update - ' + updateFailed);
          res.status(500).json({
            error: 'Event update failed',
          });
        });
    } else {
      console.log('Error:event-controller-updateEvent():Event Update Google - ' + googleError);
      res.status(500).json({
        error: 'Event update failed',
      });
    }
  });
};

// Function: deleteEvent()
// Purpose: Deletes an event based on the id passed in as a parameter
//          Requires the user to be authenticated and the host of the event
exports.deleteEvent = (req, res, next) => {
  Event.findOneAndDelete({_id: req.params.id, hostId: req.userData._id})
    .then(deletedEvent => {
      // Update all the users were attending the event
      User.updateMany({_id: {$in: [req.userData._id, ...(deletedEvent.attendees)]}},
        {$pull: {events: req.params.id}})
        .then(updatedUsers => {
          console.log('General:event-controller-deleteEvent():Updated Event Users - ' + updatedUsers);
        })
        .catch(updatedUsersError => {
          console.log('Error:event-controller-deleteEvent():Updated Event Users - ' + updatedUsersError);
        });

      // Update the game that had the event
      Game.findByIdAndUpdate(deletedEvent.gameId, {
        $pull: {currentEvents: req.params.id},
        $inc: {eventCount: -1}})
        .then(updatedGame => {
          console.log('General:event-controller-deleteEvent():Updated Event Game - ' + updatedGame);
        })
        .catch(updateGameError => {
          console.log('Error:event-controller-deleteEvent():Updated Event Game - ' + updateGameError);
        });

      return res.status(200).json(deletedEvent);
    })
    .catch(deleteError => {
      console.log('Error:event-controller-deleteEvent():Event Delete - ' + deleteError);
      return res.status(500).json({
        error: 'Error deleting event.'
      });
    });
};

// Function: getEvents()
// Purpose: Retrieves events that have not expired
//          Requires a lat and lng query parameters and
//          allows for an optional distance to be specified
//          which will default to 20km otherwise
exports.getEvents = (req, res, next) => {
  // Check that user provided valid lat/lng values
  if (!req.query.lng || !req.query.lat) {
    return res.status(400).json({
      "error": "lng and lat query parameters are required"
    });
  }
  const lng = parseFloat(req.query.lng);
  const lat = parseFloat(req.query.lat);
  // If distance is not provided as a query paramter then use 20km
  const distance = parseFloat(req.query.distance) || 20000;

  Event.find({
    date: { $gte: new Date() },
    coords: {
      $nearSphere: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        $maxDistance: distance
    }}})
    .populate('gameId')
    .then(retrievedEvents => {
      res.status(200).json(retrievedEvents);
    })
    .catch(error => {
      console.log('Error:event-controller-getEvents():Events Retrieval - ' + error);
      res.status(500).json({
        error: 'Unable to retrieve events'
      });
    });
};

// Function: joinEvent()
// Purpose: Allows users to join an event which is specified by a url parameter
//          Requires a the user user to be authenticated and not be the host of the event
exports.joinEvent = (req, res, next) => {
  Event.updateOne({ _id: req.params.id, hostId: { $ne: req.userData._id }},
    { $push: {attendees: req.userData._id}})
    .then(updateResponse => {
      if (updateResponse.n !== 0) {
        // Update the user's document with the new event
        User.findByIdAndUpdate(req.userData._id, {$push: {events: req.params.id }})
          .then(userResponse => {
            console.log('General:event-controller-joinEvent():Updated Event Users - ' + userResponse);
          })
          .catch(userError => {
            console.log('Error:event-controller-joinEvent():User Update - ' + userError);
            return res.status(500).json({
              error: 'Error joining event.'
            });
          });
      } else {
        console.log('Error:event-controller-joinEvent():No Found Users');
      }
      return res.status(200).json({updateResponse});
    })
    .catch(error => {
      console.log('Error:event-controller-joinEvent():Join Retrieval - ' + error);
      return res.status(500).json({
        error: 'Error joining event.'
      });
    });
};

// Function: leaveEvent()
// Purpose: Allows users to leave an event which is specified by a url parameter
//          Requires a the user user to be authenticated and not be the host of the event
exports.leaveEvent = (req, res, next) => {
  Event.updateOne({_id: req.params.id, hostId: {$ne: req.userData._id }},
    {$pull: {attendees: req.userData._id}})
      .then(updateResponse => {
      if (updateResponse.n !== 0) {
        // Update the user's document to remove the event
        User.updateOne({_id: req.userData._id}, {$pull: {events: req.params.id}})
          .then(userResponse => {
            console.log('General:event-controller-leaveEvent():Updated Event Users - ' + userResponse);
          })
          .catch(userError => {
            console.log('Error:event-controller-leaveEvent():User Update - ' + userError);
            return res.status(500).json({
              error: 'Error leaving event.'
            });
          });
      } else {
        console.log('Error:event-controller-leaveEvent():No Found Users');
      }

    return res.status(200).json({updateResponse});
  })
  .catch(error => {
    console.log('Error:event-controller-leaveEvent():Join Retrieval - ' + error);
    return res.status(500).json({
      error: 'Error joining event.'
    });
  });
};


// Function: removeUserFromEvent()
// Purpose: Allows event owners to remove users from their events
//          Requires the user id and event id to be submited as url parameters
exports.removeUserFromEvent = (req, res, next) => {
  Event.updateOne({
      _id: req.params.id,
      hostId: req.userData._id,
      attendees: req.params.userId
    },
    { $pull: { attendees: req.params.userId}})
      .then(updateResponse => {
        if(updateResponse.n !== 0){
          // Update the user's account
          User.updateOne({_id: req.params.userId}, {$pull: {events: req.params.id}})
            .then(userUpdateResponse => {
              console.log('General:event-controller-removeUserFromEvent():Updated Event Users - ' + userUpdateResponse);
            })
            .catch(updateUserError => {
              console.log('Error:event-controller-removeUserFromEvent():Update User - ' + updateUserError);
              return res.status(500).json({
                error: 'Error removeing event from user'
              });
            });
        }

        return res.status(200).json(updateResponse);
      })
      .catch(error => {
        console.log('Error:event-controller-removeUserFromEvent():Leave Retrieval - ' + error);
        return res.status(500).json(error);
      });
};




