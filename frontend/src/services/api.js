import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gf_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('gf_token');
      localStorage.removeItem('gf_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────────
export const signup = (data) => api.post('/auth/signup', data);
export const login = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');

// ── Goals ─────────────────────────────────────────────
export const getGoals = (params) => api.get('/goals', { params });
export const getGoal = (id) => api.get(`/goals/${id}`);
export const createGoal = (data) => api.post('/goals', data);
export const updateGoal = (id, data) => api.patch(`/goals/${id}`, data);
export const deleteGoal = (id) => api.delete(`/goals/${id}`);

// ── Plans ─────────────────────────────────────────────
export const getPlans = (params) => api.get('/plans', { params });
export const getPlan = (id) => api.get(`/plans/${id}`);
export const createPlan = (data) => api.post('/plans', data);
export const updatePlan = (id, data) => api.patch(`/plans/${id}`, data);
export const deletePlan = (id) => api.delete(`/plans/${id}`);

// ── Actions ───────────────────────────────────────────
export const getActions = (params) => api.get('/actions', { params });
export const getAction = (id) => api.get(`/actions/${id}`);
export const createAction = (data) => api.post('/actions', data);
export const updateAction = (id, data) => api.patch(`/actions/${id}`, data);
export const deleteAction = (id) => api.delete(`/actions/${id}`);
export const getStats = () => api.get('/actions/stats/overview');

export default api;
