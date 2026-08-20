const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'Review text cannot be empty']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Please give a rating between 1 and 5']
  },
  hotel: {
    type: mongoose.Schema.ObjectId,
    ref: 'Hotel',
    required: [true, 'A review must belong to a hotel']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A review must belong to a user']
  }
}, { timestamps: true });

reviewSchema.index({ hotel: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);