const User = require('../models/user');

exports.createUser = (req, res, next) => {
  const user = new User();
  user.email = req.body.email;
  user.username = req.body.username;
  user.setPassword(req.body.password);
  user.imagePath = "http://localhost:3000/images/users/blank-profile.png"
  user.save()
    .then(result => {
      User.findOne({email: req.body.email, username: req.body.username})
      .then(foundUser => {
        const token = foundUser.generateJwt();
        res.status(200).json({
          token: token,
          expiresIn: 3600,
          userId: foundUser._id,
          username: foundUser.username
      })
      .catch(userError => {
        res.status(500).json(userError);
      });
    });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Invalid authentication credentials',
        error: error
      });
    });
};

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      // If there is no user, return error message
      if(!user) {
        return res.status(401).json({
          message: "Auth failed."
        })
      }
      fetchedUser = user;
      return user.validPassword(req.body.password)
    })
    .then(result => {
      // If passwords don't match, return error mesage
      if(!result) {
        return res.status(401).json({
          message: "Auth failed."
        });
      }
      // At this point, authentication is valid
      // and we return the token
      const token = fetchedUser.generateJwt();
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id,
        username: fetchedUser.username
      });
    })
    .catch(error => {
      // res.status(401).json({
      //   message: "Invalid authentication credentials!",
      //   error: error.message
      // })
    });
};

exports.userInfo = (req, res, next) => {
  const userId = req.params.userId ? req.params.userId : req.userData._id;
  User.findOne({_id: userId}, ['-hash', '-salt'])
  .populate({
    path: 'events',
    populate: {path: 'gameId' }
  })
  .then(response => {
    res.status(200).json(response);
  })
  .catch(error => {
    res.status(500).json(error);
  })
};

exports.updateUser = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/images/users/" + req.file.filename;
  }
  User.updateOne({_id: req.userData._id}, {imagePath: imagePath})
  .then(result => {
    if(result.n > 0) {
      res.status(200).json({message: 'Update sucessful!'});
    } else {
      res.status(401).json({message: 'Not authorized!'});
    }
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ message: "Couldn't update user", error: error });
  })
};
