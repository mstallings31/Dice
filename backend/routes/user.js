const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/userfile');

router.post("/signup", UserController.createUser);
router.post("/login", UserController.userLogin);

router.get("", checkAuth, UserController.userInfo);
router.get("/:userId", UserController.userInfo);
router.put("", checkAuth, extractFile, UserController.updateUser);

module.exports = router;
