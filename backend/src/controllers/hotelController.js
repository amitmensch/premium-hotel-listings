const Hotel = require('../models/Hotel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.getAllHotels = catchAsync(async (req, res, next) => {
  const { destination, minPrice, maxPrice } = req.query;
  
  let query = {};

  if (destination) {
    query = {
      $or: [
        { 'location.city': { $regex: destination, $options: 'i' } },
        { 'location.state': { $regex: destination, $options: 'i' } },
        { 'location.country': { $regex: destination, $options: 'i' } }
      ]
    };
  }

  if (minPrice || maxPrice) {
    query.pricePerNight = {};
    if (minPrice) query.pricePerNight.$gte = Number(minPrice);
    if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
  }

  const hotels = await Hotel.find(query).populate('host', 'name email');

  res.status(200).json({
    status: 'success',
    results: hotels.length,
    data: { hotels }
  });
});

exports.getHotel = catchAsync(async (req, res, next) => {
  const hotel = await Hotel.findById(req.params.id).populate('host', 'name email');

  if (!hotel) {
    return next(new AppError('No hotel found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { hotel }
  });
});

exports.createHotel = catchAsync(async (req, res, next) => {
  // 1. Get image URLs from multer/cloudinary
  const imageUrls = req.files ? req.files.map(file => file.path) : [];

  // NEW: Enforce min 3 and max 5 images
  if (imageUrls.length < 3 || imageUrls.length > 5) {
    return next(new AppError('Please upload between 3 and 5 images for your property listing.', 400));
  }

  // 2. Format nested location object (since FormData sends flat strings)
  const location = {
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    country: req.body.country,
  };

  // 3. Format amenities array
  const amenities = req.body.amenities
    ? req.body.amenities.split(',').map(item => item.trim())
    : [];

  // 4. Combine everything
  const hotelData = {
    name: req.body.name,
    description: req.body.description,
    pricePerNight: Number(req.body.pricePerNight),
    location,
    amenities,
    images: imageUrls,
    host: req.user.id
  };

  const newHotel = await Hotel.create(hotelData);

  res.status(201).json({
    status: 'success',
    data: { hotel: newHotel }
  });
});

exports.updateHotel = catchAsync(async (req, res, next) => {
  let hotel = await Hotel.findById(req.params.id);

  if (!hotel) {
    return next(new AppError('No hotel found with that ID', 404));
  }

  // Ensure only the host who created it (or an admin) can update it
  if (hotel.host.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('You do not have permission to edit this listing', 403));
  }

  hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: { hotel }
  });
});

exports.deleteHotel = catchAsync(async (req, res, next) => {
  const hotel = await Hotel.findById(req.params.id);

  if (!hotel) {
    return next(new AppError('No hotel found with that ID', 404));
  }

  if (hotel.host.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('You do not have permission to delete this listing', 403));
  }

  await hotel.deleteOne();

  res.status(204).json({
    status: 'success',
    data: null
  });
});
