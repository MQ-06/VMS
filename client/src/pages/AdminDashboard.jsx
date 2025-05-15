import {
  FaGlobe, FaCreditCard, FaBuilding, FaCogs, FaPercentage,
  FaUsers, FaTools, FaTruck, FaCar, FaWrench, FaBoxes,
  FaFileInvoiceDollar, FaRedo, FaChartBar
} from 'react-icons/fa';
import { FaHammer, FaClipboardCheck } from 'react-icons/fa';
import { MdBuild, MdManageAccounts } from 'react-icons/md';

import DashboardCard from '@/components/ui/DashboardCard';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6 text-black flex flex-col items-center">
      <div className="w-full max-w-5xl bg-white p-6 rounded-xl shadow">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-blue-800">Fleet Management System</h1>
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-600">👤</span>
          </div>
        </div>
        <p className="text-gray-500 mb-6">Super Admin Dashboard</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard to="/admin/translations" icon={FaGlobe} label="Manage Translations" />
          <DashboardCard to="/admin/plans" icon={FaCreditCard} label="Manage Subscription Plans" />
          <DashboardCard to="/admin/customers" icon={FaBuilding} label="Manage Customers" />
          <DashboardCard to="/admin/settings" icon={FaCogs} label="Manage Settings" />
          <DashboardCard to="/admin/taxes" icon={FaPercentage} label="Manage Taxes" />
          <DashboardCard to="/admin/subscribers" icon={FaUsers} label="Manage Subscribers" />
          <DashboardCard to="/admin/users" icon={MdManageAccounts} label="Manage Users" />
          <DashboardCard to="/admin/suppliers" icon={FaTools} label="Manage Suppliers" />
          <DashboardCard to="/admin/fleets" icon={FaTruck} label="Manage Fleets" />
          <DashboardCard to="/admin/vehicles" icon={FaCar} label="Manage Vehicles" />
          <DashboardCard to="/admin/repair-categories" icon={FaWrench} label="Manage Repair Categories" />
          <DashboardCard to="/admin/parts-services" icon={FaBoxes} label="Manage Parts/Services" />
          <DashboardCard to="/admin/maintenance-repairs" icon={FaHammer} label="Manage Maintenance & Repairs" />
          <DashboardCard to="/admin/section-costs" icon={FaFileInvoiceDollar} label="Section Costs Report" />
          <DashboardCard to="/admin/recurring-maintenance" icon={FaRedo} label="Recurring Maintenance" />
          <DashboardCard to="/admin/admin-reports" icon={FaChartBar} label="Administrative Reports" />
          <DashboardCard
            to="/admin/recurring-maintenance-schedule"
            icon={FaClipboardCheck}
            label="Recurring Maintenance Schedule"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
