// src/services/adminReportsService.js
import axios from 'axios';

export const fetchPayments = () => axios.get('/api/reports/payments');
export const fetchSubscriptions = () => axios.get('/api/reports/subscriptions');
export const fetchAlerts = () => axios.get('/api/reports/alerts');
