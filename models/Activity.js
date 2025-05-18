const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['focus', 'memory', 'reading', 'pattern'],
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  duration: {
    type: Number, // in seconds
    required: true
  },
  metrics: {
    accuracy: Number,
    responseTime: Number,
    focusLevel: Number,
    memoryScore: Number
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy'
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Activity', activitySchema); 