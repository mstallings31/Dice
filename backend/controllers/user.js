const User = require('../models/user');

// Function: createNewUser()
// Purpose: Creates a new user in the database.
//          Requires that the request body contains
//          a unique email address, username, password.
exports.createNewUser = (req, res, next) => {
  // Create the new user
  const user = new User();
  user.email = req.body.email;
  user.username = req.body.username;
  user.setPassword(req.body.password);
  user.imagePath = 'http://dice-angular.s3-website.us-east-2.amazonaws.com/assets/images/users/blank-profile.png'

  // Save the user
  user.save()
    .then(newUser => {
      // Get the new user to log them in
      User.findById(newUser._id)
        .then(foundUser => {
          // Generate a token for thew new user to log them in
         generateToken(res, foundUser);
        })
        .catch(errorRetrivingUser => {
          return res.status(500).json({
            error: 'There was an issue creating a new account.'
          })
        });
    })
    .catch(errorSaving => {
      console.log('Error:user-controller-createNewUser():' + errorSaving);
      return res.status(500).json({
        error: 'There was an issue creating a new account.',
      });
    });
};

// Function: generateToken
// Input: res - http response to send back to user
//        user - a validated user from the database
// Purpose: Generate a JSON webtoken to send back as a response
generateToken = (res, user) => {
  const token = user.generateJwt();
  return res.status(200).json({
    token: token,
    expiresIn: 3600,
    userId: user._id,
    username: user.username
  });
};

// Function: logUserIn()
// Purpose: Check user credentials and log in validated users.
//          Requires that the request body contains an email, password
exports.logUserIn = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(userToValidate => {
      // If there is no user, return error message
      if(!userToValidate) {
        console.log('Error:user-controller-logUserIn():Invalid Login-' + req.body.email);
        return res.status(401).json({
          error: 'Invalid username or password.'
        })
      }
      fetchedUser = userToValidate;
      return userToValidate.validPassword(req.body.password)
    })
    .then(validatedUser => {
      // If passwords don't match, return error mesage
      if(!validatedUser) {
        console.log('Error:user-controller-logUserIn():Invalid Login-' + req.body.email);
        return res.status(401).json({
          error: "Invalid username or password."
        });
      }
      // At this point, authentication is valid
      // and we return the token
      generateToken(res, fetchedUser)
    })
    .catch(error => {
      console.log('Error:user-controller-logUserIn():Authentication Error-'+error);
      return res.status(500).json({
        error: 'An authentication error occured'
      });
    });
};

// Function: getUserInfo()
// Purpose: Returns basic user information.  If the user is authenticated
//          it uses the userId of their token, otherwise it uses the submited
//          userId in the parameters
//          Requires that the request paramters contain a userId or the user to be
//          authenticated
exports.getUserInfo = (req, res, next) => {
  // Determine if a userId parameter was provided, otherwise uses an authenticated
  // _id
  const userId = req.params.userId ? req.params.userId : req.userData._id;
  const userProjection = '-hash -salt';
  User.findById(userId, userProjection)
    .populate({
      path: 'events',
      populate: {path: 'gameId' }
    })
    .then(foundUser => {
      res.status(200).json(foundUser);
    })
    .catch(error => {
      console.log("Error:user-controller-getUserInfo():" + error);
      res.status(500).json({
        error: 'Error retrieving user'
      });
    });
};

// Function: updateUser()
// Purpose: Returns basic user information.  If the user is authenticated
//          it uses the userId of their token, otherwise it uses the submited
//          userId in the parameters
//          Requires that the request paramters contain a userId or the user to be
//          authenticated
exports.updateUser = (req, res, next) => {
  // Process a new image or update exisitng path
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + '/images/users/' + req.file.filename;
  }

  User.findByIdAndUpdate(req.userData._id, {imagePath: imagePath})
  .then(updatedUser => {
    // If there was an updatedUser then the update was successful
    if(updatedUser) {
      res.status(200).json({
        message: 'User updated.'
      });
    } else {
      console.log('Error:user-controller-updateUser():Unauthorized Update-' + req.userData._id);
      res.status(401).json({
        error: 'Not authorized!'
      });
    }
  })
  .catch(error => {
    console.log('Error:user-controller-updateUser():Unknown Error-' + error);
    res.status(500).json({
      error: 'An error occurred while updating user.'});
  })
};
