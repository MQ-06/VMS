import axios from 'axios';

export const fetchTaxes = () => axios.get('/api/taxes');
export const addTax = (data) => axios.post('/api/taxes', data);
export const updateTax = (id, data) => axios.put(`/api/taxes/${id}`, data);
export const deleteTax = (id) => axios.delete(`/api/taxes/${id}`);
export const toggleTaxStatus = (id, active) =>
  axios.patch(`/api/taxes/${id}/active`, { active });
