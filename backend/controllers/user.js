const User = require('../models/user');

exports.createUser = (req, res, next) => {
  const user = new User();
  user.email = req.body.email;
  user.username = req.body.username;
  user.setPassword(req.body.password);
  user.save()
    .then(result => {
      res.status(200).json({
        message: 'User created',
        result: result
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Invalid authentication credentials'
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
      res.status(200).json(token);
    })
    .catch(error => {
      return res.status(401).json({
        message: "Invalid authentication credentials!",
        error: error.message
      })
    });
};
