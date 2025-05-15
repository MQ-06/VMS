import { useEffect, useState } from 'react';
import { fetchMaintenanceRepairs, addMaintenanceRepair, updateMaintenanceRepair } from '@/services/maintenanceRepairService';
import MaintenanceRepairForm from './components/MaintenanceRepairForm';
import BackButton from '@/components/ui/BackButton';
import EditModal from '@/components/ui/EditModal';
import EditButton from '@/components/ui/EditButton';

const MaintenanceRepairsPage = () => {
  const [records, setRecords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingRecord, setEditingRecord] = useState(null);

  const loadRecords = async () => {
    try {
      const res = await fetchMaintenanceRepairs();
      setRecords(res.data);
    } catch (err) {
      console.error(err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleAdd = async (data) => {
    try {
      await addMaintenanceRepair(data);
      setShowModal(false);
      loadRecords();
    } catch (err) {
      console.error('Failed to add repair:', err);
    }
  };

  const handleUpdate = async (data) => {
    try {
      await updateMaintenanceRepair(editingRecord._id, data);
      setEditingRecord(null);
      loadRecords();
    } catch (err) {
      console.error('Failed to update repair:', err);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow">
        <BackButton />
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-800">Manage Maintenance & Repairs</h2>
          <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
            Add Record
          </button>
        </div>

        <table className="w-full border rounded">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="p-2">Date</th>
              <th className="p-2">Customer</th>
              <th className="p-2">Vehicle</th>
              <th className="p-2">Supplier</th>
              <th className="p-2">Cost</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="text-center py-4">Loading...</td></tr>
            ) : records.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-4">No records found.</td></tr>
            ) : (
              records.map((r) => (
                <tr key={r._id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{r.date?.split('T')[0]}</td>
                  <td className="p-2">{r.customer?.companyName}</td>
                  <td className="p-2">{r.vehicle?.vehicleIdentifier}</td>
                  <td className="p-2">{r.supplier?.name}</td>
                  <td className="p-2">${r.cost}</td>
                  <td className="p-2">
                    <EditButton onClick={() => setEditingRecord(r)} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <EditModal isOpen={true} onClose={() => setShowModal(false)} title="Add Repair Record">
          <MaintenanceRepairForm onSubmit={handleAdd} />
        </EditModal>
      )}

      {editingRecord && (
        <EditModal isOpen={!!editingRecord} onClose={() => setEditingRecord(null)} title="Edit Repair Record">
          <MaintenanceRepairForm
            initialValues={editingRecord}
            isEdit
            onSubmit={handleUpdate}
          />
        </EditModal>
      )}
    </div>
  );
};

export default MaintenanceRepairsPage;
