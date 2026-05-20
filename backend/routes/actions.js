const express = require('express');
const Action = require('../models/Action');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

// GET /api/actions?planId=xxx or ?goalId=xxx
router.get('/', async (req, res) => {
  try {
    const filter = { user: req.user._id };
    if (req.query.planId) filter.plan = req.query.planId;
    if (req.query.goalId) filter.goal = req.query.goalId;
    if (req.query.status) filter.status = req.query.status;

    const actions = await Action.find(filter)
      .populate('plan', 'title')
      .populate('goal', 'title')
      .sort({ createdAt: -1 });
    res.json(actions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/actions
router.post('/', async (req, res) => {
  try {
    const action = await Action.create({ ...req.body, user: req.user._id });
    res.status(201).json(action);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/actions/:id
router.get('/:id', async (req, res) => {
  try {
    const action = await Action.findOne({ _id: req.params.id, user: req.user._id })
      .populate('plan', 'title')
      .populate('goal', 'title');
    if (!action) return res.status(404).json({ message: 'Action not found' });
    res.json(action);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/actions/:id  (update + submit report)
router.patch('/:id', async (req, res) => {
  try {
    const { report, status, ...rest } = req.body;
    const update = { ...rest };

    if (status) update.status = status;
    if (report) {
      update.report = {
        ...report,
        submittedAt: new Date(),
        outcome: status === 'completed' ? 'completed' : 'incomplete',
      };
    }

    const action = await Action.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      update,
      { new: true, runValidators: true }
    );
    if (!action) return res.status(404).json({ message: 'Action not found' });
    res.json(action);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/actions/:id
router.delete('/:id', async (req, res) => {
  try {
    const action = await Action.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!action) return res.status(404).json({ message: 'Action not found' });
    res.json({ message: 'Action deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/actions/stats/overview
router.get('/stats/overview', async (req, res) => {
  try {
    const userId = req.user._id;
    const total = await Action.countDocuments({ user: userId });
    const completed = await Action.countDocuments({ user: userId, status: 'completed' });
    const incomplete = await Action.countDocuments({ user: userId, status: 'incomplete' });
    const pending = await Action.countDocuments({ user: userId, status: 'pending' });

    // Last 8 weeks stats
    const weeks = [];
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - i * 7);
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      const weekCompleted = await Action.countDocuments({
        user: userId,
        status: 'completed',
        'report.submittedAt': { $gte: weekStart, $lt: weekEnd },
      });
      const weekIncomplete = await Action.countDocuments({
        user: userId,
        status: 'incomplete',
        'report.submittedAt': { $gte: weekStart, $lt: weekEnd },
      });
      weeks.push({
        week: `W${8 - i}`,
        completed: weekCompleted,
        incomplete: weekIncomplete,
      });
    }

    // Tech stack frequency
    const techStackAgg = await Action.aggregate([
      { $match: { user: userId, status: 'completed' } },
      { $unwind: '$report.techStack' },
      { $group: { _id: '$report.techStack', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.json({ total, completed, incomplete, pending, weeks, techStack: techStackAgg });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
