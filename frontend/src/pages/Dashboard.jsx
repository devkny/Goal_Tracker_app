import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getGoals } from '../services/api';
import GoalCard from '../components/GoalCard';
import GoalModal from '../components/GoalModal';
import './Dashboard.css';

const FILTERS = ['all', 'active', 'completed', 'abandoned'];
const SORTS = [
  { value: 'createdAt', label: 'Newest' },
  { value: 'deadline', label: 'Deadline' },
  { value: 'name', label: 'Name' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active');
  const [sort, setSort] = useState('createdAt');
  const [showModal, setShowModal] = useState(false);

  const fetchGoals = useCallback(async () => {
    try {
      const params = { sort };
      if (filter !== 'all') params.status = filter;
      const { data } = await getGoals(params);
      setGoals(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filter, sort]);

  useEffect(() => { fetchGoals(); }, [fetchGoals]);

  const handleGoalCreated = (newGoal) => {
    setShowModal(false);
    fetchGoals();
  };

  const activeCount = goals.filter((g) => g.status === 'active').length;
  const completedCount = goals.filter((g) => g.status === 'completed').length;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="dash-header">
        <div>
          <p className="dash-greeting">// {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          <h1 className="page-title">Hey, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="dash-subtitle">
            <span className="stat-pill active">{activeCount} active</span>
            <span className="stat-pill completed">{completedCount} completed</span>
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + New Goal
        </button>
      </div>

      {/* Controls */}
      <div className="dash-controls">
        <div className="filter-tabs">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <select className="select sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Goals grid */}
      {loading ? (
        <div className="loading">Loading goals...</div>
      ) : goals.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">◎</div>
          <h3>No goals yet</h3>
          <p>Create your first goal to get started</p>
          <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => setShowModal(true)}>
            + Create a goal
          </button>
        </div>
      ) : (
        <div className="goals-grid">
          {goals.map((goal) => (
            <GoalCard key={goal._id} goal={goal} onUpdate={fetchGoals} />
          ))}
        </div>
      )}

      {showModal && (
        <GoalModal onClose={() => setShowModal(false)} onCreated={handleGoalCreated} />
      )}
    </div>
  );
}
