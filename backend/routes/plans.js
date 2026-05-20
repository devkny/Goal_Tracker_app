const express = require('express');
const Plan = require('../models/Plan');
const Action = require('../models/Action');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

// GET /api/plans?goalId=xxx
router.get('/', async (req, res) => {
  try {
    const filter = { user: req.user._id };
    if (req.query.goalId) filter.goal = req.query.goalId;
    const plans = await Plan.find(filter).populate('goal', 'title').sort({ createdAt: -1 });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/plans
router.post('/', async (req, res) => {
  try {
    const plan = await Plan.create({ ...req.body, user: req.user._id });
    res.status(201).json(plan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/plans/:id
router.get('/:id', async (req, res) => {
  try {
    const plan = await Plan.findOne({ _id: req.params.id, user: req.user._id }).populate('goal', 'title');
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    const actions = await Action.find({ plan: plan._id }).sort({ createdAt: -1 });
    res.json({ ...plan.toObject(), actions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/plans/:id
router.patch('/:id', async (req, res) => {
  try {
    const plan = await Plan.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.json(plan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/plans/:id
router.delete('/:id', async (req, res) => {
  try {
    const plan = await Plan.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    await Action.deleteMany({ plan: plan._id });
    res.json({ message: 'Plan deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
