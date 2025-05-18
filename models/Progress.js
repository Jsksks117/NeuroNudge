const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  metrics: {
    focusTime: Number,
    completedTasks: Number,
    accuracy: Number,
    engagement: Number
  },
  adhdSymptoms: {
    inattention: Number,
    hyperactivity: Number,
    impulsivity: Number,
    focus: Number
  },
  dyslexiaSymptoms: {
    readingSpeed: Number,
    spelling: Number,
    comprehension: Number,
    memory: Number
  },
  activities: [{
    type: {
      type: String,
      enum: ['focus', 'memory', 'reading', 'pattern']
    },
    score: Number,
    duration: Number,
    completedAt: Date
  }]
});

module.exports = mongoose.model('Progress', progressSchema); 