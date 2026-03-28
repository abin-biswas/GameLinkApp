const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  playerLiked: { type: Boolean, default: false },
  orgLiked: { type: Boolean, default: false },
  status: { type: String, enum: ['pending', 'matched'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema);
