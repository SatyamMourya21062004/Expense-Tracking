const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../middleware/validation');
const authController = require('../controllers/authController');

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/refresh', authController.refreshToken);
router.get('/me', protect, authController.getMe);
router.put('/update-profile', protect, authController.updateProfile);
router.put('/change-password', protect, authController.changePassword);
router.post('/logout', protect, authController.logout);

module.exports = router;
