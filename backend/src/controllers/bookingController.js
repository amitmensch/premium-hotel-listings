const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.createBooking = catchAsync(async (req, res, next) => {
  const { hotelId, checkIn, checkOut } = req.body;

  const start = new Date(checkIn);
  const end = new Date(checkOut);

  if (start >= end) {
    return next(new AppError('Check-out date must be after check-in date', 400));
  }

  const hotel = await Hotel.findById(hotelId);
  if (!hotel) {
    return next(new AppError('No hotel found with that ID', 404));
  }

  const existingBooking = await Booking.findOne({
    hotel: hotelId,
    status: 'confirmed',
    $or: [
      { checkIn: { $lt: end }, checkOut: { $gt: start } }
    ]
  });

  if (existingBooking) {
    return next(new AppError('This property is already reserved for the selected dates', 400));
  }

  const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  const totalPrice = nights * hotel.pricePerNight;

  const booking = await Booking.create({
    hotel: hotelId,
    user: req.user.id,
    checkIn: start,
    checkOut: end,
    totalPrice
  });

  res.status(201).json({
    status: 'success',
    data: { booking }
  });
});

exports.getMyBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id }).populate('hotel');

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: { bookings }
  });
});