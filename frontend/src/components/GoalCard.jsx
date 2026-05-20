import { useNavigate } from 'react-router-dom';
import { deleteGoal, updateGoal } from '../services/api';
import { formatDistanceToNow, isPast } from 'date-fns';
import './GoalCard.css';

const CATEGORY_COLORS = {
  development: 'var(--green)',
  content: 'var(--blue)',
  trading: 'var(--amber)',
  learning: '#c084fc',
  health: '#fb7185',
  other: 'var(--text-3)',
};

export default function GoalCard({ goal, onUpdate }) {
  const navigate = useNavigate();
  const progress = goal.totalActions > 0
    ? Math.round((goal.completedActions / goal.totalActions) * 100)
    : 0;

  const deadlineDate = new Date(goal.deadline);
  const isOverdue = isPast(deadlineDate) && goal.status === 'active';
  const deadlineLabel = formatDistanceToNow(deadlineDate, { addSuffix: true });

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!confirm('Delete this goal and all its plans and actions?')) return;
    try {
      await deleteGoal(goal._id);
      onUpdate();
    } catch (err) {
      alert('Failed to delete goal');
    }
  };

  const handleStatusToggle = async (e) => {
    e.stopPropagation();
    const nextStatus = goal.status === 'active' ? 'abandoned' : 'active';
    try {
      await updateGoal(goal._id, { status: nextStatus });
      onUpdate();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const color = CATEGORY_COLORS[goal.category] || 'var(--text-3)';

  return (
    <div className="goal-card card" onClick={() => navigate(`/goals/${goal._id}`)}>
      <div className="goal-card-accent" style={{ background: color }} />

      <div className="goal-card-top">
        <div className="goal-meta">
          <span className="goal-category" style={{ color }}>{goal.category}</span>
          <span className="goal-timeframe">{goal.timeframe}</span>
        </div>
        <span className={`badge badge-${goal.status}`}>{goal.status}</span>
      </div>

      <h3 className="goal-title">{goal.title}</h3>
      {goal.description && <p className="goal-desc">{goal.description}</p>}

      <div className="goal-stats">
        <div className="goal-stat">
          <span className="goal-stat-num">{goal.planCount}</span>
          <span className="goal-stat-label">plans</span>
        </div>
        <div className="goal-stat">
          <span className="goal-stat-num">{goal.completedActions}</span>
          <span className="goal-stat-label">done</span>
        </div>
        <div className="goal-stat">
          <span className="goal-stat-num">{goal.totalActions - goal.completedActions}</span>
          <span className="goal-stat-label">pending</span>
        </div>
      </div>

      {goal.totalActions > 0 && (
        <div className="goal-progress">
          <div className="goal-progress-label">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      <div className="goal-footer">
        <span className={`goal-deadline ${isOverdue ? 'overdue' : ''}`}>
          {isOverdue ? '⚠ ' : '⏱ '}
          {deadlineLabel}
        </span>
        <div className="goal-actions" onClick={(e) => e.stopPropagation()}>
          <button className="btn btn-ghost btn-sm" onClick={handleStatusToggle}>
            {goal.status === 'active' ? 'Abandon' : 'Reactivate'}
          </button>
          <button className="btn btn-danger btn-sm" onClick={handleDelete}>✕</button>
        </div>
      </div>
    </div>
  );
}
