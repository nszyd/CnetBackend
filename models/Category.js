//Category.js
const mongoose = require('../database');

const categorySchema = new mongoose.Schema({
  categoryName: String,
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
