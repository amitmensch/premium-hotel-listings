const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  hotel: {
    type: mongoose.Schema.ObjectId,
    ref: 'Hotel',
    required: [true, 'A booking must belong to a hotel']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A booking must belong to a user']
  },
  checkIn: {
    type: Date,
    required: [true, 'Please provide a check-in date']
  },
  checkOut: {
    type: Date,
    required: [true, 'Please provide a check-out date']
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed'
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);