require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const authRoutes = require('./routes/auth');
const activityRoutes = require('./routes/activities');
const progressRoutes = require('./routes/progress');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Set mongoose options
mongoose.set('strictQuery', false);

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('activityUpdate', (data) => {
    io.to(data.userId).emit('activityProgress', data);
  });

  socket.on('progressUpdate', (data) => {
    io.to(data.userId).emit('progressUpdate', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/progress', progressRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 