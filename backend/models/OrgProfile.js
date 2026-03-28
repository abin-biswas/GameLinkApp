const mongoose = require('mongoose');

const orgProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  teamName: { type: String, required: true, trim: true },
  game: { type: String, required: true, trim: true },
  requiredRoles: [{ type: String, trim: true }],
  minRank: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('OrgProfile', orgProfileSchema);
