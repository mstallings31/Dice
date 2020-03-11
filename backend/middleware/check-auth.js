const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    // verify will throw an error which is also caught by the try
    // block
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = { username: decodedToken.username, _id: decodedToken._id };
    next();
  } catch (error) {
    res.status(401).json({ message: "You are not authenticated"});
  }
};
