const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const Progress = require('../models/Progress');
const { auth } = require('../middleware/auth');

// Get all activities for a user
router.get('/', auth, function(req, res) {
  Activity.find({ userId: req.user.id })
    .sort({ completedAt: -1 })
    .then(activities => res.json(activities))
    .catch(err => res.status(500).json({ message: err.message }));
});

// Record a new activity
router.post('/', auth, function(req, res) {
  const activity = new Activity({
    userId: req.user.id,
    type: req.body.type,
    score: req.body.score,
    duration: req.body.duration,
    metrics: req.body.metrics,
    difficulty: req.body.difficulty
  });

  activity.save()
    .then(savedActivity => {
      return Progress.findOne({ userId: req.user.id })
        .then(progress => {
          if (progress) {
            progress.activities.push({
              type: activity.type,
              score: activity.score,
              duration: activity.duration,
              completedAt: activity.completedAt
            });
            return progress.save();
          }
          return savedActivity;
        })
        .then(() => res.status(201).json(savedActivity));
    })
    .catch(err => res.status(400).json({ message: err.message }));
});

// Get activity statistics
router.get('/stats', auth, function(req, res) {
  Activity.aggregate([
    { $match: { userId: req.user.id } },
    { $group: {
      _id: '$type',
      averageScore: { $avg: '$score' },
      totalDuration: { $sum: '$duration' },
      count: { $sum: 1 }
    }}
  ])
    .then(stats => res.json(stats))
    .catch(err => res.status(500).json({ message: err.message }));
});

module.exports = router; 