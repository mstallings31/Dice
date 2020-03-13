const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const checkAuth = require('../middleware/check-auth');

router.post("/signup", UserController.createUser);
router.post("/login", UserController.userLogin);

router.get("", checkAuth, UserController.userInfo);

module.exports = router;
