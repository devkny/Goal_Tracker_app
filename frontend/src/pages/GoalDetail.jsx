import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGoal, deletePlan, deleteAction } from '../services/api';
import { formatDistanceToNow, isPast, format } from 'date-fns';
import PlanModal from '../components/PlanModal';
import ActionModal from '../components/ActionModal';
import ReportModal from '../components/ReportModal';
import GoalModal from '../components/GoalModal';
import './GoalDetail.css';
import '../components/ReportModal.css';

export default function GoalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showGoalEdit, setShowGoalEdit] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(null); // planId
  const [showReportModal, setShowReportModal] = useState(null); // action object
  const [editPlan, setEditPlan] = useState(null);

  const fetchGoal = useCallback(async () => {
    try {
      const { data } = await getGoal(id);
      setGoal(data);
    } catch (err) {
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => { fetchGoal(); }, [fetchGoal]);

  const handleDeletePlan = async (planId) => {
    if (!confirm('Delete this plan and all its actions?')) return;
    try { await deletePlan(planId); fetchGoal(); } catch {}
  };

  const handleDeleteAction = async (actionId) => {
    if (!confirm('Delete this action?')) return;
    try { await deleteAction(actionId); fetchGoal(); } catch {}
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!goal) return null;

  const totalActions = goal.plans?.reduce((s, p) => s + p.actions.length, 0) || 0;
  const doneActions = goal.plans?.reduce((s, p) => s + p.actions.filter(a => a.status === 'completed').length, 0) || 0;
  const progress = totalActions > 0 ? Math.round((doneActions / totalActions) * 100) : 0;

  return (
    <div className="page-container">
      {/* Back */}
      <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back to goals</button>

      {/* Goal header */}
      <div className="goal-detail-header">
        <div className="goal-detail-meta">
          <span className="goal-category-big">{goal.category} · {goal.timeframe}</span>
          <span className={`badge badge-${goal.status}`}>{goal.status}</span>
        </div>
        <div className="goal-detail-title-row">
          <h1 className="page-title">{goal.title}</h1>
          <button className="btn btn-ghost btn-sm" onClick={() => setShowGoalEdit(true)}>Edit</button>
        </div>
        {goal.description && <p className="goal-detail-desc">{goal.description}</p>}

        <div className="goal-detail-stats">
          <div className="gd-stat">
            <span className="gd-stat-num">{goal.plans?.length || 0}</span>
            <span className="gd-stat-label">Plans</span>
          </div>
          <div className="gd-stat">
            <span className="gd-stat-num">{doneActions}</span>
            <span className="gd-stat-label">Done</span>
          </div>
          <div className="gd-stat">
            <span className="gd-stat-num">{progress}%</span>
            <span className="gd-stat-label">Progress</span>
          </div>
          <div className="gd-stat">
            <span className="gd-stat-num">{format(new Date(goal.deadline), 'MMM d')}</span>
            <span className="gd-stat-label">Deadline</span>
          </div>
        </div>

        {totalActions > 0 && (
          <div className="gd-progress">
            <div className="progress-bar" style={{ height: 6 }}>
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Plans section */}
      <div className="plans-header">
        <h2 className="section-title" style={{ marginBottom: 0 }}>Action Plans</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowPlanModal(true)}>+ Add Plan</button>
      </div>

      {(!goal.plans || goal.plans.length === 0) ? (
        <div className="empty-state">
          <div className="empty-icon">⊟</div>
          <h3>No plans yet</h3>
          <p>Break your goal down into concrete action plans</p>
          <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => setShowPlanModal(true)}>
            + Add first plan
          </button>
        </div>
      ) : (
        <div className="plans-list">
          {goal.plans.map((plan) => {
            const planDone = plan.actions.filter(a => a.status === 'completed').length;
            const planProgress = plan.actions.length > 0 ? Math.round((planDone / plan.targetCount) * 100) : 0;
            const isOverdue = isPast(new Date(plan.deadline)) && plan.status === 'active';

            return (
              <div key={plan._id} className="plan-block card">
                <div className="plan-block-header">
                  <div className="plan-block-left">
                    <h3 className="plan-title">{plan.title}</h3>
                    {plan.description && <p className="plan-desc">{plan.description}</p>}
                    <div className="plan-meta">
                      <span className={`plan-deadline ${isOverdue ? 'overdue' : ''}`}>
                        {isOverdue ? '⚠ ' : '⏱ '}
                        {formatDistanceToNow(new Date(plan.deadline), { addSuffix: true })}
                      </span>
                      <span className="plan-count">
                        {planDone} / {plan.targetCount} target
                      </span>
                    </div>
                  </div>
                  <div className="plan-block-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => setEditPlan(plan)}>Edit</button>
                    <button className="btn btn-primary btn-sm" onClick={() => setShowActionModal(plan._id)}>+ Action</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeletePlan(plan._id)}>✕</button>
                  </div>
                </div>

                {plan.actions.length > 0 && (
                  <div className="plan-progress-row">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${Math.min(planProgress, 100)}%` }} />
                    </div>
                  </div>
                )}

                {/* Actions list */}
                <div className="actions-list">
                  {plan.actions.length === 0 ? (
                    <p className="no-actions">No actions yet — add the first one</p>
                  ) : (
                    plan.actions.map((action) => (
                      <div key={action._id} className={`action-item ${action.status}`}>
                        <div className="action-item-left">
                          <span className={`action-dot ${action.status}`} />
                          <div>
                            <p className="action-name">{action.title}</p>
                            <p className="action-meta">
                              {action.status === 'pending'
                                ? `Due ${formatDistanceToNow(new Date(action.deadline), { addSuffix: true })}`
                                : action.report?.submittedAt
                                  ? `Submitted ${format(new Date(action.report.submittedAt), 'MMM d, yyyy')}`
                                  : action.status}
                            </p>
                            {/* Show tech stack chips if reported */}
                            {action.report?.techStack?.length > 0 && (
                              <div className="action-tags">
                                {action.report.techStack.map(t => <span key={t} className="tag">{t}</span>)}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="action-item-right">
                          {action.status === 'pending' ? (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => setShowReportModal(action)}
                            >
                              Submit report
                            </button>
                          ) : (
                            <button
                              className="btn btn-ghost btn-sm"
                              onClick={() => setShowReportModal(action)}
                            >
                              {action.report?.description ? 'Edit report' : 'Add report'}
                            </button>
                          )}
                          <button className="btn btn-danger btn-sm" onClick={() => handleDeleteAction(action._id)}>✕</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {showGoalEdit && (
        <GoalModal existing={goal} onClose={() => setShowGoalEdit(false)} onCreated={() => { setShowGoalEdit(false); fetchGoal(); }} />
      )}
      {showPlanModal && (
        <PlanModal goalId={goal._id} onClose={() => setShowPlanModal(false)} onCreated={() => { setShowPlanModal(false); fetchGoal(); }} />
      )}
      {editPlan && (
        <PlanModal existing={editPlan} goalId={goal._id} onClose={() => setEditPlan(null)} onCreated={() => { setEditPlan(null); fetchGoal(); }} />
      )}
      {showActionModal && (
        <ActionModal planId={showActionModal} goalId={goal._id} onClose={() => setShowActionModal(null)} onCreated={() => { setShowActionModal(null); fetchGoal(); }} />
      )}
      {showReportModal && (
        <ReportModal action={showReportModal} onClose={() => setShowReportModal(null)} onSubmitted={() => { setShowReportModal(null); fetchGoal(); }} />
      )}
    </div>
  );
}
