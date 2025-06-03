import axios from 'axios';

const BASE_URL = '/api/recurring-maintenance-schedule';

export const fetchSchedules = () => axios.get(BASE_URL);
export const createSchedule = (data) => axios.post(BASE_URL, data);
export const updateSchedule = (id, data) => axios.put(`${BASE_URL}/${id}`, data);
export const toggleScheduleStatus = (id) => axios.patch(`${BASE_URL}/${id}/status`);
export const fetchRecurringRules = (customerId) => axios.get(`${BASE_URL}/rules?customer_id=${customerId}`);