import axios from 'axios';

export const fetchRepairCategories = () => axios.get('/api/repair-categories');
export const addRepairCategory = (data) => axios.post('/api/repair-categories', data);
export const updateRepairCategory = (id, data) => axios.put(`/api/repair-categories/${id}`, data);
export const toggleRepairCategoryStatus = (id, active) =>
  axios.patch(`/api/repair-categories/${id}/active`, { active });
