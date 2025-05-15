
import API from './api';

export const fetchTranslations = () => API.get('/translations');
export const addTranslation = (data) => API.post('/translations', data);
