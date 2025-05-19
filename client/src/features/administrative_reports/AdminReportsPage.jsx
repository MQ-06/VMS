// src/features/administrative_reports/AdminReportsPage.jsx
import React, { useEffect, useState } from 'react';
import BackButton from '@/components/ui/BackButton';
import ReportTable from './components/ReportTable';
import {  fetchSubscriptions } from '@/services/adminReportsService';

const AdminReportsPage = () => {
//  const [payments, setPayments] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
 // const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
useEffect(() => {
  const fetchOnlySubscriptions = async () => {
    setLoading(true);
    try {
      const res = await fetchSubscriptions();
      setSubscriptions(res.data || []);
    } catch (error) {
      console.error('Failed to fetch subscriptions report:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchOnlySubscriptions();
}, []);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <BackButton />
      <h1 className="text-2xl font-bold text-blue-800">Administrative Reports</h1>

      <div className="space-y-8">
        {/* <ReportTable title="Payments Report" data={payments} loading={loading} /> */}
        <ReportTable title="Subscriptions Report" data={subscriptions} loading={loading} />
        {/* <ReportTable title="Alerts Report" data={alerts} loading={loading} /> */}
      </div>
    </div>
  );
};

export default AdminReportsPage;
