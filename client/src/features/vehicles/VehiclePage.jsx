import { useEffect, useState } from 'react';
import {
  fetchVehicles,
  addVehicle,
  updateVehicle,
  toggleVehicleStatus
} from '@/services/vehicleService';
import VehicleForm from './components/VehicleForm';
import { FaCar } from 'react-icons/fa';
import BackButton from '@/components/ui/BackButton';
import EditButton from '@/components/ui/EditButton';
import ToggleButton from '@/components/ui/ToggleButton';

const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const loadVehicles = async () => {
    try {
      const res = await fetchVehicles();
      setVehicles(res.data);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleAdd = async (formData) => {
    try {
      await addVehicle(formData);
      setShowModal(false);
      loadVehicles();
    } catch (err) {
      console.error('Failed to add vehicle:', err);
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await updateVehicle(editingVehicle._id, formData);
      setEditingVehicle(null);
      loadVehicles();
    } catch (err) {
      console.error('Failed to update vehicle:', err);
    }
  };

  const handleToggle = async (vehicle) => {
    try {
      await toggleVehicleStatus(vehicle._id, !vehicle.active);
      loadVehicles();
    } catch (err) {
      console.error('Failed to toggle vehicle status:', err);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-4">
      {(showModal || editingVehicle) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-10 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl relative">
            <button
              onClick={() => {
                setShowModal(false);
                setEditingVehicle(null);
              }}
              className="absolute top-2 right-4 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>
            <VehicleForm
              onSubmit={editingVehicle ? handleUpdate : handleAdd}
              initialValues={editingVehicle || {}}
              isEdit={!!editingVehicle}
              onClose={() => {
                setShowModal(false);
                setEditingVehicle(null);
              }}
            />
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto bg-white p-10 rounded-2xl shadow-xl border border-blue-100">
        <BackButton className="mb-4" />

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
            Manage Vehicles
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary text-white px-4 py-2 rounded shadow hover:brightness-105"
          >
            Add Vehicle
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading vehicles...</p>
        ) : (
          <div className="overflow-x-auto rounded shadow-md">
            <table className="w-full bg-white text-sm rounded border border-gray-200">
              <thead className="bg-blue-900 text-white text-lg">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">VIN</th>
                  <th className="p-3 text-left">License Plate</th>
                  
                  <th className="p-3 text-left">Fleet</th>
                  <th className="p-3 text-left">Brand</th>
                  <th className="p-3 text-left">Year</th>
                  <th className="p-3 text-left">Mileage</th>
                  <th className="p-3 text-left">Ownership</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.length > 0 ? (
                  vehicles.map((v) => (
                    <tr
                      key={v._id}
                      className="border-t border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="p-3">{v.name}</td>
                      <td className="p-3">{v.vin}</td>
                      <td className="p-3">{v.licensePlate}</td>
                      <td className="p-3">{v.fleet?.name}</td>
                      <td className="p-3">{v.brand || '-'}</td>
                      <td className="p-3">{v.year || '-'}</td>
                      <td className="p-3">{v.mileage?.toLocaleString() || '0'}</td>
                      <td className="p-3 capitalize">{v.ownership?.replace('_', ' ') || '-'}</td>
                      <td className="p-3 flex gap-2">
                        <EditButton onClick={() => setEditingVehicle(v)} />
                        <ToggleButton isActive={v.active} onToggle={() => handleToggle(v)} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="p-4 text-center text-gray-400">
                      No vehicles found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehiclesPage;
