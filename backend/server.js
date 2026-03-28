const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const profileRoutes = require('./routes/profileRoutes');
const matchRoutes = require('./routes/matchRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Health test route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.use('/', profileRoutes);
app.use('/', matchRoutes);
app.use('/api', uploadRoutes);

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gamelinkapp';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH'],
  },
});

io.on('connection', (socket) => {
  console.log('New socket connected:', socket.id);

  socket.on('joinRoom', ({ room, user }) => {
    if (!room) return;
    socket.join(room);
    socket.to(room).emit('systemMessage', { user: 'system', text: `${user || 'A user'} joined the room.` });
  });

  socket.on('chatMessage', ({ room, user, text }) => {
    if (!room || !text) return;
    const msg = { user, text, createdAt: new Date() };
    io.to(room).emit('newMessage', msg);
  });

  socket.on('leaveRoom', ({ room, user }) => {
    if (!room) return;
    socket.leave(room);
    socket.to(room).emit('systemMessage', { user: 'system', text: `${user || 'A user'} left the room.` });
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
