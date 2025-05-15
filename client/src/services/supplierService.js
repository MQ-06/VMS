import api from './api';

export const fetchSuppliers = () =>
  api.get('/suppliers');

export const addSupplier = (formData) =>
  api.post('/suppliers', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateSupplier = (id, formData) =>
  api.put(`/suppliers/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
