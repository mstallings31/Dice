const express = require('express');
const router = express.Router();
const GameController = require("../controllers/games");

router.get("", GameController.getGames);

module.exports = router;
