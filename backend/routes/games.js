const express = require('express');
const router = express.Router();
const GameController = require("../controllers/games");
const extractFile = require('../middleware/file');

router.get("", GameController.getGames);
router.post("", extractFile, GameController.createGame);

router
  .route("/:id")
  .get(GameController.getGame);

module.exports = router;
