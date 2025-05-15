import api from './api';

export const fetchSubscribers = () => api.get('/subscribers');
export const createSubscriber = (data) => api.post('/subscribers', data);
export const updateSubscriber = (id, data) => api.put(`/subscribers/${id}`, data);
