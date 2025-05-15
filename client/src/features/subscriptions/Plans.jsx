import { useEffect, useState } from 'react';
import {
  fetchPlans,
  addPlan,
  updatePlan,
  togglePlanStatus
} from '@/services/planService';
import BackButton from '@/components/ui/BackButton';
import PlanForm from './components/PlanForm';
import EditModal from '@/components/ui/EditModal';
import EditButton from '@/components/ui/EditButton';
import ToggleButton from '@/components/ui/ToggleButton';

const PlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadPlans = async () => {
    try {
      const res = await fetchPlans();
      setPlans(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (formData) => {
    try {
      await addPlan(formData);
      setShowForm(false);
      loadPlans();
    } catch (error) {
      console.error('Error adding plan:', error);
    }
  };

  const handleEdit = async (formData) => {
    try {
      await updatePlan(editingPlan._id, formData);
      setEditingPlan(null);
      loadPlans();
    } catch (error) {
      console.error('Error updating plan:', error);
    }
  };

  const handleToggle = async (plan) => {
    try {
      await togglePlanStatus(plan._id, !plan.active);
      loadPlans();
    } catch (err) {
      console.error('Failed to toggle plan status:', err);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow">
        <BackButton className="mb-4" />

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-800">Manage Subscription Plans</h2>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Plan
          </button>
        </div>

        <div className="overflow-x-auto rounded border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="p-3 text-left">Name (EN)</th>
                <th className="p-3 text-left">Name (ES)</th>
                <th className="p-3 text-left">Recurrence</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Fleet Limit</th>
                <th className="p-3 text-left">Taxes</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-gray-500">Loading...</td>
                </tr>
              ) : plans.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-gray-400">No plans found.</td>
                </tr>
              ) : (
                plans.map((plan) => (
                  <tr key={plan._id} className="border-t hover:bg-gray-50 transition">
                    <td className="p-3">{plan.name_en}</td>
                    <td className="p-3">{plan.name_es}</td>
                    <td className="p-3 capitalize">{plan.recurrence}</td>
                    <td className="p-3">${plan.amount}</td>
                    <td className="p-3">{plan.fleetAmount}</td>
                    <td className="p-3">
                      {Array.isArray(plan.applicableTaxes) && plan.applicableTaxes.length > 0
                        ? plan.applicableTaxes.map((t) => t.name).join(', ')
                        : '—'}
                    </td>
                    <td className="p-3 flex gap-2">
                      <EditButton onClick={() => setEditingPlan(plan)} />
                      <ToggleButton isActive={plan.active} onToggle={() => handleToggle(plan)} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Plan Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-3xl relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-4 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-blue-700 mb-4">Add New Plan</h2>
            <PlanForm onSubmit={handleAdd} onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}

      {/* Edit Plan Modal */}
      {editingPlan && (
        <EditModal
          isOpen={!!editingPlan}
          onClose={() => setEditingPlan(null)}
          title="Edit Plan"
        >
          <PlanForm
            initialValues={editingPlan}
            isEdit
            onSubmit={handleEdit}
            onClose={() => setEditingPlan(null)}
          />
        </EditModal>
      )}
    </div>
  );
};

export default PlansPage;
