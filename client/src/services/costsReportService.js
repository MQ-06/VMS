import axios from 'axios';

export const fetchCostReports = async (filters) => {
  return axios.get('/api/costs-reports', { params: filters });
};
