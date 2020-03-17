const Game = require('../models/games');

// Function: createGame()
// Purpose: Create a new game in mongodb
//          Requries that the request body contain a title
//          introText, description, minPlayers, maxPlayers, genre
//          minAge, minPlaytime, maxPlaytime, and an image file
//          simple verification so that only admin can create games
exports.createGame = (req, res, next) => {
  // Check if the user is me
  if (req.userData.username !== 'Shinjiaru') {
    return res.status(401).json({
      error: 'Not authorized to create new games'
    });
  }

  // Create the new game to save
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
      // Send back a response with the new game
      return res.status(201).json({
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
      console.log('Error:game-controller-createGame():' + error);
      res.status(500).json({
        error: 'Game creation failed',
      });
    });
};

// Function: getGame()
// Purpose: Retrieve a game by a an id passed in as
//          a url parameter.  An optional query parameter
//          for details can be submitted  to populate currentEvents
exports.getGame = (req, res, next) => {
  // Determine if the details query parameter was provided and set to true
  let query = Game.findById(req.params.id);
  if (req.query.details === 'true') {
    query = query.populate('currentEvents');
  }

  query
    .then(game => {
      if(game) {
        return res.status(200).json(game);
      } else {
        return res.status(404).json({ message: 'Game not found!' });
      }
    })
    .catch( error => {
      console.log('Error:game-controller-getGame():Game Retrieval-' + error);
      res.status(500).json({
        error: 'Fetching game failed!',
      })
    });
};

// Function: updateGame()
// Purpose: Update the game passed in as a url paramter id
//          Requires that the user be authenticated (and me)
//          and that body contains _id, title, introText, description,
//          minPlayers, maxPlayers, genre, minAge, minPlaytime, maxPlaytime,
//          and an imagePath if you aren't upating the image, otherwises a new
//          imagePath is created from the provided image file
exports.updateGame = (req, res, next) => {

  if(req.userData.username !== 'Shinjiaru')
  {
    return res.status(401).json({
      error: 'Not authorized to update.'
    });
  }

  // Determine if we are updating the image, otherwise use exisitng string
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }

  // Create a new object to hold the update data
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
      // If there were
      if(result.n > 0) {
        return res.status(200).json({message: 'Update sucessful!'});
      } else {
        return res.status(404).json({message: 'Unable to find game to update.'});
      }
    })
    .catch(error => {
      console.log('Error:game-controller-updateOne():Game Update-' + error);
      res.status(500).json({
        error: "Couldn't update post",
      });
    });
};


// Function: getGames()
// Purpose:  Returns the top 9 games with the most events
exports.getGames = (req,res, next) => {
  Game.find()
    .sort('-eventCount')
    .limit(9)
    .then(fetchedGames => {
      return res.status(200).json(fetchedGames);
    })
    .catch(error => {
      console.log('Error:game-controller-getGames():Games Read-' + error);
      return res.status(500).json({
        error: 'Fetching games failed',
    });
  })
};

// Function: getGameTitle()
// Purpose:  Get only the games title and _id to populate
//           searching features
exports.getGameTitles = (req, res, next) => {
  const _GameTitleProjection = 'title';
  Game.find({}, _GameTitleProjection)
    .then(games => {
      return res.status(200).json(games);
    })
    .catch(error => {
      console.log('Error:game-controller-getGameTitles():Games Titles-' + error);
      return res.status(500).json({
        error: 'Error retrieving game titles.'
      })
    });
}





