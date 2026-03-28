const jwt = require('jsonwebtoken');
const User = require('../models/User');

const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'supersecret', { expiresIn: '1d' });
};

exports.register = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const user = await User.create({ email, password, role });
    const token = createToken(user._id);
    res.status(201).json({ user: { id: user._id, email: user.email, role: user.role }, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = createToken(user._id);
    res.json({ user: { id: user._id, email: user.email, role: user.role }, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
