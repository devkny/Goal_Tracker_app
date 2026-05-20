const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema({
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    required: true,
  },
  goal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Action title is required'],
    trim: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'incomplete'],
    default: 'pending',
  },
  report: {
    description: { type: String, trim: true },
    techStack: [{ type: String, trim: true }],
    lessonsLearned: { type: String, trim: true },
    outcome: { type: String, enum: ['completed', 'incomplete'] },
    submittedAt: { type: Date },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Action', actionSchema);
