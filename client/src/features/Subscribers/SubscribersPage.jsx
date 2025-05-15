import { useEffect, useState } from 'react';
import BackButton from '@/components/ui/BackButton';
import EditButton from '@/components/ui/EditButton';
import EditModal from '@/components/ui/EditModal';
import { fetchSubscribers, createSubscriber, updateSubscriber } from '@/services/subscriberService';
import SubscriberForm from './components/SubscriberForm';

const SubscribersPage = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSubscriber, setEditingSubscriber] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadSubscribers = async () => {
    try {
      const res = await fetchSubscribers();
      setSubscribers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch subscribers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (formData) => {
    await createSubscriber(formData);
    setShowForm(false);
    loadSubscribers();
  };

  const handleUpdate = async (formData) => {
    await updateSubscriber(editingSubscriber._id, formData);
    setEditingSubscriber(null);
    loadSubscribers();
  };

  useEffect(() => {
    loadSubscribers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow">
        <BackButton className="mb-4" />

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-800">Manage Subscribers</h2>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Subscriber
          </button>
        </div>

        <div className="overflow-x-auto rounded border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Initial Plan</th>
                <th className="p-3 text-left">Initial Date</th>
                <th className="p-3 text-left">Current Plan</th>
                <th className="p-3 text-left">Plan Date</th>
                <th className="p-3 text-left">Fleet Limit</th>
                <th className="p-3 text-left">Recurrence</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Renewal Date</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="11" className="p-4 text-center text-gray-500">Loading...</td>
                </tr>
              ) : subscribers.length === 0 ? (
                <tr>
                  <td colSpan="11" className="p-4 text-center text-gray-400">No subscribers found.</td>
                </tr>
              ) : (
                subscribers.map((sub) => (
                  <tr key={sub._id} className="border-t hover:bg-gray-50 transition">
                    <td className="p-3">{sub.customer?.companyName}</td>
                    <td className="p-3">{sub.initialPlan?.name_en}</td>
                    <td className="p-3">{new Date(sub.initialSubscriptionDate).toLocaleDateString()}</td>
                    <td className="p-3">{sub.currentPlan?.name_en}</td>
                    <td className="p-3">{new Date(sub.currentPlanDate).toLocaleDateString()}</td>
                    <td className="p-3">{sub.currentFleetAmount}</td>
                    <td className="p-3">{sub.recurrence}</td>
                    <td className="p-3">${sub.price}</td>
                    <td className="p-3">{new Date(sub.nextRenewalDate).toLocaleDateString()}</td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                          sub.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <EditButton onClick={() => setEditingSubscriber(sub)} />
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
            <h2 className="text-xl font-bold text-blue-700 mb-4">Add New Subscriber</h2>
            <SubscriberForm onSubmit={handleAdd} />
          </div>
        </div>
      )}

      {editingSubscriber && (
        <EditModal
          isOpen={!!editingSubscriber}
          onClose={() => setEditingSubscriber(null)}
          title="Edit Subscriber"
        >
          <SubscriberForm
            initialValues={editingSubscriber}
            isEdit
            onSubmit={handleUpdate}
            onClose={() => setEditingSubscriber(null)}
          />
        </EditModal>
      )}
    </div>
  );
};

export default SubscribersPage;
