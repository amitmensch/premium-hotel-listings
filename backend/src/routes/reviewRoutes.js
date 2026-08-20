const express = require('express');
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(reviewController.getHotelReviews)
  .post(authMiddleware.protect, reviewController.createReview);

router.delete('/:id', authMiddleware.protect, reviewController.deleteReview);

module.exports = router;