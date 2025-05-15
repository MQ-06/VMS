import axios from 'axios';

const BASE = '/api/recurring-maintenance';

export const fetchRecurringMaintenance = () => axios.get(BASE);
export const createRecurringMaintenance = (data) => axios.post(BASE, data);
export const updateRecurringMaintenance = (id, data) => axios.put(`${BASE}/${id}`, data);
export const toggleRecurringMaintenanceStatus = (id, isActive) => axios.patch(`${BASE}/${id}/status`, { active: isActive });
