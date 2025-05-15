import axios from 'axios';

export const fetchPartsServices = (customerId) =>
  axios.get(`/api/part-services${customerId ? `?customer=${customerId}` : ''}`);

export const addPartService = (data) =>
  axios.post('/api/part-services', data);

export const updatePartService = (id, data) =>
  axios.put(`/api/part-services/${id}`, data);

export const deletePartService = (id) =>
  axios.delete(`/api/part-services/${id}`);
