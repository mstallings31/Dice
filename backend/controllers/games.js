const Game = require('../models/games');

// GET all games
exports.getGames = (req,res, next) => {
  let query =  Game.find();
  if (req.query.detail === 'true') {
    query = query.populate('currentEvents');
  }
  query.then(fetchedGames => {
    res.status(200).json(fetchedGames);
  })
  .catch(error => {
    res.status(500).json({
      message: 'Fetching games failed',
      error: error
    })
  })
};


exports.getGamesDetail = (req,res, next) => {
  let query =  Game.find();
  if (req.params.detail === 'true') {
    query = query.populate('currentEvents');
  }
  query.then(fetchedGames => {
    res.status(200).json(fetchedGames);
  })
  .catch(error => {
    res.status(500).json({
      message: 'Fetching games failed',
      error: error
    })
  })
};


// GET a single game
exports.getGame = (req, res, next) => {
  Game.findById(req.params.id)
    .then(game => {
      if(game) {
        res.status(200).json(game);
      } else {
        res.status(404).json({ message: 'Game not found!' });
      }
    })
    .catch( error => {
      res.status(500).json({
        message: 'Fetching game failed!',
        error: error
      })
    });
};

// POST (create) a new game
exports.createGame = (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  const newGame = new Game({
    title: req.body.title,
    introText: req.body.introText,
    description: req.body.description,
    minPlayers: req.body.minPlayers,
    maxPlayers: req.body.maxPlayers,
    genre: req.body.genre,
    minAge: req.body.minAge,
    minPlaytime: req.body.minPlaytime,
    maxPlaytime:req.body.maxPlaytime,
    imagePath: url + "/images/" + req.file.filename
  });

  newGame.save()
    .then(createdGame => {
      res.status(201).json({
        _id: createdGame._id,
        title: createdGame.title,
        introText: createdGame.introText,
        description: createdGame.description,
        minPlayers: +createdGame.minPlayers,
        maxPlayers: +createdGame.maxPlayers,
        genre: createdGame.genre,
        minAge: +createdGame.minAge,
        minPlaytime: +createdGame.minPlaytime,
        maxPlaytime: +createdGame.maxPlaytime,
        imagePath: createdGame.imagePath
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Game creation failed',
        error: error
      });
    });
};

// PUT (update) an existing game
exports.updateGame = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const game = {
    _id: req.body._id,
    title: req.body.title,
    introText: req.body.introText,
    description: req.body.description,
    minPlayers: req.body.minPlayers,
    maxPlayers: req.body.maxPlayers,
    genre: req.body.genre,
    minAge: req.body.minAge,
    minPlaytime: req.body.minPlaytime,
    maxPlaytime:req.body.maxPlaytime,
    imagePath: imagePath
  };

  Game.updateOne({_id: req.params.id}, game)
    .then(result => {
      if(result.n > 0) {
        res.status(200).json({message: 'Update sucessful!'});
      } else {
        res.status(401).json({message: 'Not authorized!'});
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "Couldn't update post", error: error });
    })
};
