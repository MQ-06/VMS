import api from './api'; // Assumes Axios base is configured

export const fetchPlans = () => api.get('/plans');
export const addPlan = (data) => api.post('/plans', data);
export const updatePlan = (id, data) => api.put(`/plans/${id}`, data);
export const togglePlanStatus = (id, active) =>
  api.patch(`/plans/${id}/active`, { active }); // ✅ added
