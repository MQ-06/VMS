import { useEffect, useState } from 'react';
import { fetchPartsServices, addPartService, updatePartService } from '@/services/partService';
import PartServiceForm from './components/PartServiceForm';
import BackButton from '@/components/ui/BackButton';
import EditModal from '@/components/ui/EditModal';
import EditButton from '@/components/ui/EditButton';
import ToggleButton from '@/components/ui/ToggleButton';

const PartsServicesPage = () => {
  const [records, setRecords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingRecord, setEditingRecord] = useState(null);

  const loadRecords = async () => {
    try {
      const res = await fetchPartsServices();
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
      await addPartService(data);
      setShowModal(false);
      loadRecords();
    } catch (err) {
      console.error('Failed to add:', err);
    }
  };

  const handleUpdate = async (data) => {
    try {
      await updatePartService(editingRecord._id, data);
      setEditingRecord(null);
      loadRecords();
    } catch (err) {
      console.error('Failed to update:', err);
    }
  };

  const handleToggle = async (record) => {
    try {
      const updated = {
        ...record,
        active: !record.active,
        customer: record.customer?._id || record.customer
      };
      await updatePartService(record._id, updated);
      loadRecords();
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow">
        <BackButton />
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-800">Manage Parts or Services</h2>
          <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
            Add Item
          </button>
        </div>

        <table className="w-full border rounded">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="p-2 text-left">English Name</th>
              <th className="p-2 text-left">Spanish Name</th>
              <th className="p-2 text-left">Customer</th>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Avg. Cost</th>
              <th className="p-2 text-left">Actions</th>
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
                  <td className="p-2">{r.nameEn}</td>
                  <td className="p-2">{r.nameEs}</td>
                  <td className="p-2">{r.customer?.companyName}</td>
                  <td className="p-2 capitalize">{r.type}</td>
                  <td className="p-2">${r.averageCost}</td>
                  <td className="p-2 flex gap-2">
                    <EditButton onClick={() => setEditingRecord(r)} />
                    <ToggleButton
                      isActive={r.active}
                      onToggle={() => handleToggle(r)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-3xl relative">
            <button onClick={() => setShowModal(false)} className="absolute top-3 right-4 text-xl">&times;</button>
            <h3 className="text-xl font-semibold mb-4 text-blue-700">Add New Item</h3>
            <PartServiceForm onSubmit={handleAdd} />
          </div>
        </div>
      )}

      {editingRecord && (
        <EditModal isOpen={!!editingRecord} onClose={() => setEditingRecord(null)} title="Edit Item">
          <PartServiceForm
            initialValues={editingRecord}
            isEdit
            onSubmit={handleUpdate}
          />
        </EditModal>
      )}
    </div>
  );
};

export default PartsServicesPage;
