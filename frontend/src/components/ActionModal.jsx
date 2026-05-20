import { useState } from 'react';
import { createAction } from '../services/api';

export default function ActionModal({ planId, goalId, onClose, onCreated }) {
  const [form, setForm] = useState({ title: '', deadline: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await createAction({ ...form, plan: planId, goal: goalId });
      onCreated(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create action');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">New Action</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Action Title</label>
            <input
              className="input"
              name="title"
              placeholder="e.g. Build a weather app"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Deadline</label>
            <input
              className="input"
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              required
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Action'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
