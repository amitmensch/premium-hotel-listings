const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const { hotelId, checkInDate, checkOutDate } = req.body;

  const hotel = await Hotel.findById(hotelId);
  if (!hotel) {
    return next(new AppError('No hotel found with that ID', 404));
  }

  // Compute the total price server-side. Do NOT trust the client-supplied
  // price to prevent underpayment.
  const start = new Date(checkInDate);
  const end = new Date(checkOutDate);
  if (isNaN(start) || isNaN(end) || start >= end) {
    return next(new AppError('Invalid check-in/check-out dates', 400));
  }
  const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  const totalPrice = nights * hotel.pricePerNight;

  // Create Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL}/success?hotelId=${hotelId}&checkIn=${checkInDate}&checkOut=${checkOutDate}&price=${totalPrice}`,
    cancel_url: `${process.env.FRONTEND_URL}/hotels/${hotelId}`,
    customer_email: req.user.email,
    client_reference_id: hotelId,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: totalPrice * 100, // Stripe expects price in cents
          product_data: {
            name: `${hotel.name} Reservation`,
            description: `${checkInDate} to ${checkOutDate}`,
            images: hotel.images && hotel.images.length > 0 ? [hotel.images[0]] : [],
          },
        },
        quantity: 1,
      },
    ],
  });

  res.status(200).json({
    status: 'success',
    sessionUrl: session.url
  });
});