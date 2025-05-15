import axios from 'axios';

// For general usage (returns all fleets or filtered by query param)
export const fetchFleets = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return axios.get(`/api/fleets${query ? `?${query}` : ''}`);
};

// For fetching fleets of a specific customer only
export const fetchFleetsByCustomer = (customerId) => {
  return axios.get(`/api/fleets?customer=${customerId}`);
};

export const addFleet = (data) => axios.post('/api/fleets', data);
export const updateFleet = (id, data) => axios.put(`/api/fleets/${id}`, data);
