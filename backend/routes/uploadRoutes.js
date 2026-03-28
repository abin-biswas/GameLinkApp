const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const PlayerProfile = require('../models/PlayerProfile');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Multer config for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware to verify JWT
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret');
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Upload video route
router.post('/upload-video', authenticate, upload.single('video'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No video file provided' });

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: 'video', folder: 'gamelink-videos' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    // Save URL to PlayerProfile
    const profile = await PlayerProfile.findOne({ userId: req.userId });
    if (!profile) return res.status(404).json({ message: 'Player profile not found' });

    profile.clips.push(result.secure_url);
    await profile.save();

    res.json({ message: 'Video uploaded successfully', url: result.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

module.exports = router;