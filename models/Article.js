const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  publicationDate: { type: Date, default: Date.now },
  authorName: { type: String, required: true },
  categoryName: { type: String, required: true },
  tags: [String],
  excerpt: { type: String, required: true },
  imageUrl: { type: String, required: true }
}, { collection: 'Articles' });

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
