import axios from 'axios';

export const fetchVehicles = () => axios.get('/api/vehicles');

export const addVehicle = (formData) =>
  axios.post('/api/vehicles', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateVehicle = (id, formData) =>
  axios.put(`/api/vehicles/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const toggleVehicleStatus = (id, active) =>
  axios.patch(`/api/vehicles/${id}/active`, { active });

