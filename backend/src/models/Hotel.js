const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A hotel listing must have a name'],
    trim: true,
    maxlength: [100, 'Hotel name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description of the property']
  },
  pricePerNight: {
    type: Number,
    required: [true, 'A hotel must have a price per night']
  },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true }
  },
  amenities: {
    type: [String],
    default: ['Free WiFi'] // Default baseline
  },
  images: [String], // Will store image URLs later
  host: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A hotel must belong to a host']
  }
}, { timestamps: true });

module.exports = mongoose.model('Hotel', hotelSchema);
