const express = require('express');
const router = express.Router();
const GameController = require("../controllers/games");
const extractFile = require('../middleware/file');
const checkAuth = require('../middleware/check-auth');

router.get("/titles", GameController.getGameTitles);

// CRUD routes for Games
router.post("", checkAuth, extractFile, GameController.createGame);
router.get("/:id", GameController.getGame);
router.put("/:id", checkAuth, extractFile, GameController.updateGame);


router.get("", GameController.getGames);


module.exports = router;
