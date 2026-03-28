const mongoose = require('mongoose');

const playerProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  game: { type: String, required: true, trim: true },
  rank: { type: String, required: true, trim: true },
  role: { type: String, trim: true },
  playstyle: { type: String, trim: true },
  availability: { type: String, trim: true },
  clips: [{ type: String, trim: true }],
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('PlayerProfile', playerProfileSchema);
