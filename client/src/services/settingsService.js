import axios from 'axios';

export const getSettings = () => axios.get('/api/settings');
export const updateSettings = (data) => axios.post('/api/settings', data);
