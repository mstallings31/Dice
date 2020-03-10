const express = require('express');
const router = express.Router();
const GameController = require("../controllers/games");

router
  .route("")
  .get(GameController.getGames)
  .post(GameController.createGame);

router
  .route("/:id")
  .get(GameController.getGame);

module.exports = router;
