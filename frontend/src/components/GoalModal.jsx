import { useState } from 'react';
import { createGoal, updateGoal } from '../services/api';

export default function GoalModal({ onClose, onCreated, existing }) {
  const [form, setForm] = useState({
    title: existing?.title || '',
    description: existing?.description || '',
    category: existing?.category || 'development',
    timeframe: existing?.timeframe || 'monthly',
    deadline: existing?.deadline ? existing.deadline.slice(0, 10) : '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let result;
      if (existing) {
        const { data } = await updateGoal(existing._id, form);
        result = data;
      } else {
        const { data } = await createGoal(form);
        result = data;
      }
      onCreated(result);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save goal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{existing ? 'Edit Goal' : 'New Goal'}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Goal Title</label>
            <input className="input" name="title" placeholder="e.g. Become a proficient developer" value={form.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Description (optional)</label>
            <textarea className="textarea" name="description" placeholder="What does achieving this mean to you?" value={form.description} onChange={handleChange} style={{ minHeight: 70 }} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select className="select" name="category" value={form.category} onChange={handleChange}>
                <option value="development">Development</option>
                <option value="content">Content</option>
                <option value="trading">Trading</option>
                <option value="learning">Learning</option>
                <option value="health">Health</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Timeframe</label>
              <select className="select" name="timeframe" value={form.timeframe} onChange={handleChange}>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Target Deadline</label>
            <input className="input" type="date" name="deadline" value={form.deadline} onChange={handleChange} required />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : existing ? 'Save Changes' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
