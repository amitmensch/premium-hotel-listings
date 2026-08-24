const User = require('../models/User');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Hotel = require('../models/Hotel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.updateProfile = catchAsync(async (req, res, next) => {
  // Filter out unwanted field updates (like passwords or roles)
  const filteredBody = {
    name: req.body.name,
    email: req.body.email
  };

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    returnDocument: 'after',
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteAccount = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  // 1. Delete all bookings made by this user
  await Booking.deleteMany({ user: userId });

  // 2. Delete all reviews left by this user
  await Review.deleteMany({ user: userId });

  // 3. If the user is a host, delete all hotels they created
  await Hotel.deleteMany({ host: userId });

  // 4. Finally, delete the user document
  await User.findByIdAndDelete(userId);

  // 5. Clear the JWT cookie to log them out
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: true,
    sameSite: 'none'
  });

  res.status(204).json({
    status: 'success',
    data: null
  });
});
