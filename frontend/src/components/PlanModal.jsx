import { useState } from 'react';
import { createPlan, updatePlan } from '../services/api';

export default function PlanModal({ goalId, onClose, onCreated, existing }) {
  const [form, setForm] = useState({
    title: existing?.title || '',
    description: existing?.description || '',
    targetCount: existing?.targetCount || 1,
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
        const { data } = await updatePlan(existing._id, form);
        result = data;
      } else {
        const { data } = await createPlan({ ...form, goal: goalId });
        result = data;
      }
      onCreated(result);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{existing ? 'Edit Plan' : 'New Plan'}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Plan Title</label>
            <input className="input" name="title" placeholder="e.g. Build 2 apps" value={form.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Description (optional)</label>
            <textarea className="textarea" name="description" placeholder="What does this plan involve?" value={form.description} onChange={handleChange} style={{ minHeight: 70 }} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Target count</label>
              <input className="input" type="number" name="targetCount" min="1" value={form.targetCount} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Deadline</label>
              <input className="input" type="date" name="deadline" value={form.deadline} onChange={handleChange} required />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : existing ? 'Save Changes' : 'Create Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
