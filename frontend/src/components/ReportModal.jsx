import { useState } from 'react';
import { updateAction } from '../services/api';

function ChipInput({ value, onChange }) {
  const [input, setInput] = useState('');

  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput('');
  };

  const remove = (chip) => onChange(value.filter((c) => c !== chip));

  return (
    <div className="chip-input-container">
      {value.map((chip) => (
        <span key={chip} className="chip">
          {chip}
          <button type="button" onClick={() => remove(chip)}>✕</button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        placeholder="e.g. React, Node.js — press Enter"
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') { e.preventDefault(); add(); }
          if (e.key === ',' && input.trim()) { e.preventDefault(); add(); }
        }}
      />
    </div>
  );
}

export default function ReportModal({ action, onClose, onSubmitted }) {
  const [form, setForm] = useState({
    description: action.report?.description || '',
    techStack: action.report?.techStack || [],
    lessonsLearned: action.report?.lessonsLearned || '',
  });
  const [outcome, setOutcome] = useState(action.report?.outcome || 'completed');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.description.trim()) return setError('Please write a description');
    setError('');
    setLoading(true);
    try {
      const { data } = await updateAction(action._id, {
        status: outcome,
        report: form,
      });
      onSubmitted(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 560 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <p className="section-title" style={{ marginBottom: 4 }}>Submitting report for</p>
            <h2 className="modal-title">{action.title}</h2>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Outcome toggle */}
          <div className="form-group">
            <label>Outcome</label>
            <div className="outcome-toggle">
              <button
                type="button"
                className={`outcome-btn ${outcome === 'completed' ? 'success' : ''}`}
                onClick={() => setOutcome('completed')}
              >
                ✅ Completed
              </button>
              <button
                type="button"
                className={`outcome-btn ${outcome === 'incomplete' ? 'fail' : ''}`}
                onClick={() => setOutcome('incomplete')}
              >
                ❌ Incomplete
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>What did you do? *</label>
            <textarea
              className="textarea"
              placeholder="Describe what you built or achieved. Be specific — this is your personal log."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              style={{ minHeight: 120 }}
            />
          </div>

          <div className="form-group">
            <label>Tech / Tools used</label>
            <ChipInput
              value={form.techStack}
              onChange={(chips) => setForm({ ...form, techStack: chips })}
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: 6 }}>
              Press Enter or comma to add each item
            </p>
          </div>

          <div className="form-group">
            <label>What did you learn?</label>
            <textarea
              className="textarea"
              placeholder="Key takeaways, what you'd do differently, what surprised you..."
              value={form.lessonsLearned}
              onChange={(e) => setForm({ ...form, lessonsLearned: e.target.value })}
              style={{ minHeight: 80 }}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
