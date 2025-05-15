

// File: features/repair_and_maintenance/MyRecurringMaintenancePage.jsx
import { useEffect, useState } from 'react';
import BackButton from '@/components/ui/BackButton';
import EditButton from '@/components/ui/EditButton';
import ToggleButton from '@/components/ui/ToggleButton';
import EditModal from '@/components/ui/EditModal';
import { fetchRecurringMaintenance, createRecurringMaintenance, updateRecurringMaintenance, toggleRecurringMaintenanceStatus } from '@/services/recurringMaintenanceService';
import MyRecurringMaintenanceForm from './components/MyRecurringMaintenanceForm';

const MyRecurringMaintenancePage = () => {
  const [records, setRecords] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadRecords = async () => {
    try {
      const res = await fetchRecurringMaintenance();
      setRecords(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch recurring maintenance:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (formData) => {
    await createRecurringMaintenance(formData);
    setShowForm(false);
    loadRecords();
  };

  const handleUpdate = async (formData) => {
    await updateRecurringMaintenance(editingItem._id, formData);
    setEditingItem(null);
    loadRecords();
  };

  const handleToggle = async (record) => {
    try {
      await toggleRecurringMaintenanceStatus(record._id, !record.active);
      loadRecords();
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow">
        <BackButton className="mb-4" />

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-800">My Recurring Maintenance</h2>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Maintenance
          </button>
        </div>

        <div className="overflow-x-auto rounded border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Maintenance Name</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Days</th>
                <th className="p-3 text-left">Mileage</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">Loading...</td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-400">No records found.</td>
                </tr>
              ) : (
                records.map((rec) => (
                  <tr key={rec._id} className="border-t hover:bg-gray-50 transition">
                    <td className="p-3">{rec.customer?.companyName}</td>
                    <td className="p-3">{rec.name}</td>
                    <td className="p-3 capitalize">{rec.performEvery}</td>
                    <td className="p-3">{rec.daysRecurrence || '—'}</td>
                    <td className="p-3">{rec.mileageRecurrence || '—'}</td>
                    <td className="p-3 flex gap-2">
                      <EditButton onClick={() => setEditingItem(rec)} />
                      <ToggleButton isActive={rec.active} onToggle={() => handleToggle(rec)} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-3xl relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-4 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-blue-700 mb-4">Add New Recurring Maintenance</h2>
            <MyRecurringMaintenanceForm onSubmit={handleAdd} />
          </div>
        </div>
      )}

      {editingItem && (
        <EditModal
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          title="Edit Recurring Maintenance"
        >
          <MyRecurringMaintenanceForm
            initialValues={editingItem}
            isEdit
            onSubmit={handleUpdate}
            onClose={() => setEditingItem(null)}
          />
        </EditModal>
      )}
    </div>
  );
};

export default MyRecurringMaintenancePage;
