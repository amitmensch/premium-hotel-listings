const express = require('express');
const hotelController = require('../controllers/hotelController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

// Public routes
router.get('/', hotelController.getAllHotels);
router.get('/:id', hotelController.getHotel);

// Protected routes (require login)
router.use(authMiddleware.protect);

// Add upload.array('images', 5) to handle up to 5 images
router.post(
  '/',
  authMiddleware.restrictTo('host', 'admin'),
  upload.array('images', 5),
  hotelController.createHotel
);
router.patch('/:id', hotelController.updateHotel);
router.delete('/:id', hotelController.deleteHotel);

module.exports = router;
