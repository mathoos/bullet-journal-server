const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');

router.post('/signup', userCtrl.signupUser);
router.post('/login', userCtrl.loginUser);
router.get('/me', auth, userCtrl.getUserInfo);

module.exports = router;