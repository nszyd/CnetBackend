//Comment.js
const mongoose = require('../database');

const commentSchema = new mongoose.Schema({
  commentText: String,
  commentDate: Date,
  articleID: mongoose.Schema.Types.ObjectId,
  userID: mongoose.Schema.Types.ObjectId,
}, { collection: 'Comments' });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
