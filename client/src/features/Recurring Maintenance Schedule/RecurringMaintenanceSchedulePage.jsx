// src/features/recurring_maintenance_schedule/RecurringMaintenanceSchedulePage.jsx
import { useEffect, useState } from 'react';
import BackButton from '@/components/ui/BackButton';
import EditButton from '@/components/ui/EditButton';
import EditModal from '@/components/ui/EditModal';
import { fetchSchedules, createSchedule, updateSchedule, toggleScheduleStatus } from '@/services/recurringScheduleService';
import ScheduleForm from './components/ScheduleForm';

const RecurringMaintenanceSchedulePage = () => {
  const [schedules, setSchedules] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadSchedules = async () => {
    try {
      const res = await fetchSchedules();
      setSchedules(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch schedules:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (formData) => {
    await createSchedule(formData);
    setShowForm(false);
    loadSchedules();
  };

  const handleUpdate = async (formData) => {
    await updateSchedule(editingSchedule._id, formData);
    setEditingSchedule(null);
    loadSchedules();
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleScheduleStatus(id);
      loadSchedules();
    } catch (err) {
      console.error('Failed to toggle schedule status:', err);
    }
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow">
        <BackButton className="mb-4" />

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-800">Recurring Maintenance Schedule</h2>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Schedule
          </button>
        </div>

        <div className="overflow-x-auto rounded border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Fleet</th>
                <th className="p-3 text-left">Vehicle</th>
                <th className="p-3 text-left">Maintenance</th>
                <th className="p-3 text-left">Last Date</th>
                <th className="p-3 text-left">Next Date</th>
                <th className="p-3 text-left">Last Mileage</th>
                <th className="p-3 text-left">Next Mileage</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="p-4 text-center text-gray-500">Loading...</td>
                </tr>
              ) : schedules.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-4 text-center text-gray-400">No schedules found.</td>
                </tr>
              ) : (
                schedules.map((item) => (
                  <tr key={item._id} className="border-t hover:bg-gray-50 transition">
                    <td className="p-3">{item.customer?.companyName}</td>
                    <td className="p-3">{item.fleet?.name}</td>
                    <td className="p-3">{item.vehicle?.name || item.vehicle?.identifier}</td>
                    <td className="p-3">{item.recurringMaintenance?.name}</td>
                    <td className="p-3">{new Date(item.lastDate).toLocaleDateString()}</td>
                    <td className="p-3">{new Date(item.nextDate).toLocaleDateString()}</td>
                    <td className="p-3">{item.lastMileage}</td>
                    <td className="p-3">{item.nextMileage}</td>
                    <td className="p-3 flex gap-2">
                      <EditButton onClick={() => setEditingSchedule(item)} />
                      <button
                        onClick={() => handleToggleStatus(item._id)}
                        className={`px-3 py-1 rounded text-white text-sm font-medium shadow ${
                          item.active ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                        }`}
                      >
                        {item.active ? 'Deactivate' : 'Activate'}
                      </button>
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
            <h2 className="text-xl font-bold text-blue-700 mb-4">Add New Schedule</h2>
            <ScheduleForm onSubmit={handleAdd} />
          </div>
        </div>
      )}

      {editingSchedule && (
        <EditModal
          isOpen={!!editingSchedule}
          onClose={() => setEditingSchedule(null)}
          title="Edit Schedule"
        >
          <ScheduleForm
            initialValues={editingSchedule}
            isEdit
            onSubmit={handleUpdate}
            onClose={() => setEditingSchedule(null)}
          />
        </EditModal>
      )}
    </div>
  );
};

export default RecurringMaintenanceSchedulePage;
