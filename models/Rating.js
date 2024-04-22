//Rating.js
const mongoose = require('../database');

const ratingSchema = new mongoose.Schema({
  rating: Number,
  articleID: mongoose.Schema.Types.ObjectId,
  userID: mongoose.Schema.Types.ObjectId,
}, { collection: 'Ratings' });

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
