const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Will be hashed using bcrypt
  skills: { type: [String], default: [] },
  rating: { type: Number, default: 0 },
  projectsCompleted: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
