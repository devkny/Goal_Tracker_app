const express = require('express');
const Goal = require('../models/Goal');
const Plan = require('../models/Plan');
const Action = require('../models/Action');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

// GET /api/goals
router.get('/', async (req, res) => {
  try {
    const { status, category, sort } = req.query;
    const filter = { user: req.user._id };
    if (status) filter.status = status;
    if (category) filter.category = category;

    const sortObj = {};
    if (sort === 'name') sortObj.title = 1;
    else if (sort === 'deadline') sortObj.deadline = 1;
    else sortObj.createdAt = -1;

    const goals = await Goal.find(filter).sort(sortObj);

    // Attach plan/action counts
    const goalsWithCounts = await Promise.all(
      goals.map(async (goal) => {
        const plans = await Plan.find({ goal: goal._id });
        const totalActions = await Action.countDocuments({ goal: goal._id });
        const completedActions = await Action.countDocuments({ goal: goal._id, status: 'completed' });
        return {
          ...goal.toObject(),
          planCount: plans.length,
          totalActions,
          completedActions,
        };
      })
    );

    res.json(goalsWithCounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/goals
router.post('/', async (req, res) => {
  try {
    const goal = await Goal.create({ ...req.body, user: req.user._id });
    res.status(201).json(goal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/goals/:id
router.get('/:id', async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
    if (!goal) return res.status(404).json({ message: 'Goal not found' });

    const plans = await Plan.find({ goal: goal._id });
    const plansWithActions = await Promise.all(
      plans.map(async (plan) => {
        const actions = await Action.find({ plan: plan._id }).sort({ createdAt: -1 });
        return { ...plan.toObject(), actions };
      })
    );

    res.json({ ...goal.toObject(), plans: plansWithActions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/goals/:id
router.patch('/:id', async (req, res) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    res.json(goal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/goals/:id
router.delete('/:id', async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    // Cascade delete
    const plans = await Plan.find({ goal: goal._id });
    for (const plan of plans) {
      await Action.deleteMany({ plan: plan._id });
    }
    await Plan.deleteMany({ goal: goal._id });
    res.json({ message: 'Goal deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
