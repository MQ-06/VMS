import axios from 'axios';

export const createCustomer = (data) =>
  axios.post('/api/customers', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const fetchCustomers = () => axios.get('/api/customers');

export const updateCustomer = (data, id) =>
  axios.post(`/api/customers/${id}/update`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateCustomerStatus = (id) =>
  axios.post(`/api/customers/${id}/toggle-status`);
