const express = require('express');
const router = express.Router();
const GameController = require("../controllers/games");
const extractFile = require('../middleware/file');

router.get("", GameController.getGames);
router.post("", extractFile, GameController.createGame);

router.get("/:id", GameController.getGame);
router.put("/:id", extractFile, GameController.updateGame);

module.exports = router;
