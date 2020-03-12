const mongoose = require('mongoose');
require("./event");

const gameSchema = mongoose.Schema({
  title: { type: String, required: true },
  introText: { type: String, required: true },
  description: { type: String, required: true },
  minPlayers: { type: Number, required: true },
  maxPlayers: { type: Number, required: true },
  genre: { type: String, required: true },
  minAge: { type: Number, required: true },
  minPlaytime: { type: Number, required: true },
  maxPlaytime: { type: Number },
  imagePath: { type: String, required: true},
  currentEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event"}]
});

module.exports = mongoose.model('Game', gameSchema);
