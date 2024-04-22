//User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  registrationDate: { type: Date, default: Date.now },
  lastLoginDate: { type: Date },
  role: { type: String, enum: ['Normal', 'Admin'], default: 'Normal' }
}, { collection: 'Users' });

const User = mongoose.model('User', userSchema);

module.exports = User;
