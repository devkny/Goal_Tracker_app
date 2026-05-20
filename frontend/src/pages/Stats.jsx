import { useState, useEffect } from 'react';
import { getStats, getGoals } from '../services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import './Stats.css';

const COLORS = {
  completed: '#00e5a0',
  incomplete: '#ff4d6d',
  pending: '#ffb347',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="tooltip-label">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export default function Stats() {
  const [stats, setStats] = useState(null);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getStats(), getGoals()])
      .then(([s, g]) => {
        setStats(s.data);
        setGoals(g.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading stats...</div>;
  if (!stats) return null;

  const completionRate = stats.total > 0
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  const pieData = [
    { name: 'Completed', value: stats.completed },
    { name: 'Incomplete', value: stats.incomplete },
    { name: 'Pending', value: stats.pending },
  ].filter(d => d.value > 0);

  const activeGoals = goals.filter(g => g.status === 'active').length;
  const completedGoals = goals.filter(g => g.status === 'completed').length;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Stats</h1>
          <p style={{ color: 'var(--text-3)', fontSize: '0.9rem', marginTop: 4 }}>
            Your productivity at a glance
          </p>
        </div>
      </div>

      {/* Top KPIs */}
      <div className="kpi-grid">
        <div className="kpi-card card">
          <span className="kpi-label">Total Actions</span>
          <span className="kpi-value">{stats.total}</span>
        </div>
        <div className="kpi-card card">
          <span className="kpi-label">Completed</span>
          <span className="kpi-value" style={{ color: 'var(--green)' }}>{stats.completed}</span>
        </div>
        <div className="kpi-card card">
          <span className="kpi-label">Completion Rate</span>
          <span className="kpi-value" style={{ color: completionRate >= 70 ? 'var(--green)' : completionRate >= 40 ? 'var(--amber)' : 'var(--red)' }}>
            {completionRate}%
          </span>
        </div>
        <div className="kpi-card card">
          <span className="kpi-label">Active Goals</span>
          <span className="kpi-value" style={{ color: 'var(--blue)' }}>{activeGoals}</span>
        </div>
        <div className="kpi-card card">
          <span className="kpi-label">Goals Achieved</span>
          <span className="kpi-value" style={{ color: 'var(--green)' }}>{completedGoals}</span>
        </div>
        <div className="kpi-card card">
          <span className="kpi-label">In Progress</span>
          <span className="kpi-value" style={{ color: 'var(--amber)' }}>{stats.pending}</span>
        </div>
      </div>

      {stats.total === 0 ? (
        <div className="empty-state" style={{ marginTop: 40 }}>
          <div className="empty-icon">◉</div>
          <h3>No data yet</h3>
          <p>Complete some actions and submit reports to see your stats</p>
        </div>
      ) : (
        <div className="charts-grid">
          {/* Weekly bar chart */}
          <div className="chart-card card">
            <h3 className="chart-title">Weekly Activity (last 8 weeks)</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={stats.weeks} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="week" tick={{ fill: 'var(--text-3)', fontSize: 11, fontFamily: 'Space Mono' }} />
                <YAxis tick={{ fill: 'var(--text-3)', fontSize: 11 }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'Space Mono', color: 'var(--text-2)' }} />
                <Bar dataKey="completed" name="Completed" fill={COLORS.completed} radius={[4,4,0,0]} />
                <Bar dataKey="incomplete" name="Incomplete" fill={COLORS.incomplete} radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart */}
          {pieData.length > 0 && (
            <div className="chart-card card">
              <h3 className="chart-title">Overall Breakdown</h3>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={65} outerRadius={95} paddingAngle={3} dataKey="value">
                    {pieData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={entry.name === 'Completed' ? COLORS.completed : entry.name === 'Incomplete' ? COLORS.incomplete : COLORS.pending}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'Space Mono', color: 'var(--text-2)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Tech stack */}
          {stats.techStack?.length > 0 && (
            <div className="chart-card card" style={{ gridColumn: '1 / -1' }}>
              <h3 className="chart-title">Top Technologies Used</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={stats.techStack.map(t => ({ name: t._id, count: t.count }))}
                  layout="vertical"
                  margin={{ top: 0, right: 20, left: 60, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis type="number" tick={{ fill: 'var(--text-3)', fontSize: 11 }} allowDecimals={false} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: 'var(--green)', fontSize: 11, fontFamily: 'Space Mono' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Times used" fill="var(--green)" radius={[0,4,4,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
