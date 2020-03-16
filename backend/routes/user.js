const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/userfile');

router.post("/signup", UserController.createNewUser);
router.post("/login", UserController.logUserIn);

router.get("", checkAuth, UserController.getUserInfo);
router.get("/:userId", UserController.getUserInfo);
router.put("", checkAuth, extractFile, UserController.updateUser);

module.exports = router;
