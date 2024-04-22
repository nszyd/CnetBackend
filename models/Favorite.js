//Favorite.js
const mongoose = require('../database');

const favoriteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    articleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true },
  }, { collection: 'Favorites' });

const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;
