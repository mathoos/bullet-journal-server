const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');

router.post('/login', userCtrl.loginUser);
router.get('/me', auth, userCtrl.getUserInfo);
router.put('/me', auth, userCtrl.updateUserInfo);

module.exports = router;