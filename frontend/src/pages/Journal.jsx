import { useState, useEffect } from 'react';
import { getActions } from '../services/api';
import { format } from 'date-fns';
import ReportModal from '../components/ReportModal';
import '../components/ReportModal.css';
import './Journal.css';

export default function Journal() {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const fetchActions = async () => {
    try {
      const params = {};
      if (filter !== 'all') params.status = filter;
      const { data } = await getActions(params);
      setActions(data.filter(a => a.status !== 'pending' || filter === 'all'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchActions(); }, [filter]);

  const grouped = actions.reduce((acc, action) => {
    const month = action.report?.submittedAt
      ? format(new Date(action.report.submittedAt), 'MMMM yyyy')
      : action.createdAt
        ? format(new Date(action.createdAt), 'MMMM yyyy')
        : 'Undated';
    if (!acc[month]) acc[month] = [];
    acc[month].push(action);
    return acc;
  }, {});

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Journal</h1>
          <p style={{ color: 'var(--text-3)', fontSize: '0.9rem', marginTop: 4 }}>
            Your proof of work — every action you've ever taken
          </p>
        </div>
        <div className="journal-filters">
          {['all', 'completed', 'incomplete', 'pending'].map((f) => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading journal...</div>
      ) : actions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">◈</div>
          <h3>Nothing here yet</h3>
          <p>Complete actions and submit reports to build your journal</p>
        </div>
      ) : (
        <div className="journal-groups">
          {Object.entries(grouped).map(([month, items]) => (
            <div key={month} className="journal-group">
              <h2 className="journal-month">{month}</h2>
              <div className="journal-entries">
                {items.map((action) => (
                  <div
                    key={action._id}
                    className={`journal-entry card ${action.status}`}
                    onClick={() => setSelected(action)}
                  >
                    <div className="je-top">
                      <div className="je-status-row">
                        <span className={`badge badge-${action.status}`}>{action.status}</span>
                        <span className="je-goal">{action.goal?.title}</span>
                      </div>
                      <span className="je-date">
                        {action.report?.submittedAt
                          ? format(new Date(action.report.submittedAt), 'MMM d')
                          : format(new Date(action.createdAt), 'MMM d')}
                      </span>
                    </div>

                    <h3 className="je-title">{action.title}</h3>

                    {action.report?.description && (
                      <p className="je-desc">{action.report.description}</p>
                    )}

                    {action.report?.techStack?.length > 0 && (
                      <div className="je-tags">
                        {action.report.techStack.map((t) => (
                          <span key={t} className="tag">{t}</span>
                        ))}
                      </div>
                    )}

                    {action.report?.lessonsLearned && (
                      <div className="je-lesson">
                        <span className="je-lesson-label">💡 Learned:</span>
                        <span>{action.report.lessonsLearned}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <ReportModal
          action={selected}
          onClose={() => setSelected(null)}
          onSubmitted={() => { setSelected(null); fetchActions(); }}
        />
      )}
    </div>
  );
}
