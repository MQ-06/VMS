import axios from 'axios';

export const fetchMaintenanceRepairs = () =>
  axios.get('/api/maintenance-repairs');

export const addMaintenanceRepair = (data) =>
  axios.post('/api/maintenance-repairs', data);

export const updateMaintenanceRepair = (id, data) =>
  axios.put(`/api/maintenance-repairs/${id}`, data);

// Optional: delete
export const deleteMaintenanceRepair = (id) =>
  axios.delete(`/api/maintenance-repairs/${id}`);
