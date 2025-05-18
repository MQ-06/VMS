import axios from 'axios';

export const fetchMaintenanceRepairs = () =>
  axios.get('/api/maintenance-repairs');

export const addMaintenanceRepair = (data) =>
  axios.post('/api/maintenance-repairs', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const updateMaintenanceRepair = (id, data) =>
  axios.patch(`/api/maintenance-repairs/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const deleteMaintenanceRepair = (id) =>
  axios.delete(`/api/maintenance-repairs/${id}`);

export const toggleMaintenanceRepairStatus = (id, isActive) =>
  axios.patch(`/api/maintenance-repairs/${id}/status`);
