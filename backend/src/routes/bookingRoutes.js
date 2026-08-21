const express = require('express');
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware.protect);

router.post('/checkout-session', bookingController.getCheckoutSession);
router.post('/', bookingController.createBooking);
router.get('/my-bookings', bookingController.getMyBookings);

module.exports = router;