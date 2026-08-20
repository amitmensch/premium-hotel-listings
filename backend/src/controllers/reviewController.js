const Review = require('../models/Review');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.getHotelReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ hotel: req.params.hotelId }).populate('user', 'name');

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: { reviews }
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const hotelId = req.params.hotelId || req.body.hotelId;
  
  const newReview = await Review.create({
    review: req.body.review,
    rating: req.body.rating,
    hotel: hotelId,
    user: req.user.id
  });

  res.status(201).json({
    status: 'success',
    data: { review: newReview }
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }

  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('You can only delete your own reviews', 403));
  }

  await review.deleteOne();

  res.status(204).json({
    status: 'success',
    data: null
  });
});