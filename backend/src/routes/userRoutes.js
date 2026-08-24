const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Protected profile route
router.patch('/profile', authMiddleware.protect, userController.updateProfile);

// Delete account (cascading delete of bookings, reviews, properties)
router.delete('/account', authMiddleware.protect, userController.deleteAccount);

module.exports = router;
