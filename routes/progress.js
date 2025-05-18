const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const auth = require('../middleware/auth');

// Get progress for a user
router.get('/', auth, async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.user.id })
      .sort({ date: -1 })
      .limit(30); // Last 30 days
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update progress
router.post('/', auth, async (req, res) => {
  try {
    const progress = new Progress({
      userId: req.user.id,
      metrics: req.body.metrics,
      adhdSymptoms: req.body.adhdSymptoms,
      dyslexiaSymptoms: req.body.dyslexiaSymptoms
    });

    const savedProgress = await progress.save();
    res.status(201).json(savedProgress);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get progress statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const stats = await Progress.aggregate([
      { $match: { userId: req.user.id } },
      { $sort: { date: -1 } },
      { $limit: 30 },
      { $group: {
        _id: null,
        avgFocusTime: { $avg: '$metrics.focusTime' },
        avgAccuracy: { $avg: '$metrics.accuracy' },
        avgEngagement: { $avg: '$metrics.engagement' },
        avgAdhdSymptoms: {
          inattention: { $avg: '$adhdSymptoms.inattention' },
          hyperactivity: { $avg: '$adhdSymptoms.hyperactivity' },
          impulsivity: { $avg: '$adhdSymptoms.impulsivity' },
          focus: { $avg: '$adhdSymptoms.focus' }
        },
        avgDyslexiaSymptoms: {
          readingSpeed: { $avg: '$dyslexiaSymptoms.readingSpeed' },
          spelling: { $avg: '$dyslexiaSymptoms.spelling' },
          comprehension: { $avg: '$dyslexiaSymptoms.comprehension' },
          memory: { $avg: '$dyslexiaSymptoms.memory' }
        }
      }}
    ]);
    res.json(stats[0] || {});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get progress by date range
router.get('/range', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const progress = await Progress.find({
      userId: req.user.id,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort({ date: 1 });
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 