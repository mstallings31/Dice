const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  hostUsername: { type: String, required: true },
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true },
  date: { type: Date, required: true },
  streetAddress: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  eventDetails: { type: String },
  coords: {
    type: { type: String },
    coordinates: [Number]
  },
});

eventSchema.index({coords: '2dsphere'});
mongoose.model('Event', eventsSchema);
