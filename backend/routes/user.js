const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/userfile');

// Authentication related routes
router.post("/signup", UserController.createNewUser);
router.post("/login", UserController.logUserIn);

// Get basic information about users for display
router.get("", checkAuth, UserController.getUserInfo);
router.get("/:userId", UserController.getUserInfo);

// Update user accounts
router.put("", checkAuth, extractFile, UserController.updateUser);

module.exports = router;
