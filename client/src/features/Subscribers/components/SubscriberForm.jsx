import { useEffect, useState } from 'react';
import { fetchPlans } from '@/services/planService';
import { fetchCustomers } from '@/services/customerService';
import ErrorMessage from '@/components/ui/ErrorMessage';

const SubscriberForm = ({ onSubmit, initialValues = {}, isEdit = false, onClose }) => {
  const initialFormState = {
    customer: '',
    initialSubscriptionDate: '',
    initialPlan: '',
    currentPlan: '',
    currentPlanDate: '',
    currentFleetAmount: '',
    recurrence: 'monthly',
    price: '',
    nextRenewalDate: '',
    status: 'active',
  };

  const [form, setForm] = useState({ ...initialFormState, ...initialValues });
  const [customers, setCustomers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([fetchCustomers(), fetchPlans()])
      .then(([customerRes, planRes]) => {
        const activeCustomers = (customerRes.data || []).filter(c => c.active); // ✅
        const activePlans = (planRes.data || []).filter(p => p.active);         // ✅
        setCustomers(activeCustomers);
        setPlans(activePlans);
      })
      .catch((err) => console.error("Error loading data:", err));
  }, []);

  useEffect(() => {
    if (isEdit && initialValues) {
      setForm({ ...initialFormState, ...initialValues });
    }
  }, [initialValues, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedForm = { ...form, [name]: value };

    if (name === 'customer') {
      const selectedCustomer = customers.find((c) => c._id === value);

      if (selectedCustomer) {
        updatedForm = {
          ...updatedForm,
          currentPlan: selectedCustomer.currentPlan?._id || '',
          nextRenewalDate: selectedCustomer.nextRenewalDate
            ? new Date(selectedCustomer.nextRenewalDate).toISOString().split('T')[0]
            : '',
        };
      }
    }

    setForm(updatedForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const {
      customer,
      initialSubscriptionDate,
      initialPlan,
      currentPlan,
      currentPlanDate,
      currentFleetAmount,
      price,
      nextRenewalDate,
    } = form;

    if (
      !customer ||
      !initialSubscriptionDate ||
      !initialPlan ||
      !currentPlan ||
      !currentPlanDate ||
      !currentFleetAmount ||
      !price ||
      !nextRenewalDate
    ) {
      setError('❌ Please fill in all required fields.');
      return;
    }

    const selectedPlan = plans.find((p) => String(p._id) === String(currentPlan));
    const fleetLimit = selectedPlan?.fleetAmount || 0;
    const fleetCount = parseInt(currentFleetAmount, 10);

    if (selectedPlan && fleetCount > fleetLimit) {
      setError(`❌ Fleet limit exceeds allowed maximum for this plan (${fleetLimit}).`);
      return;
    }

    onSubmit(form);
    if (!isEdit) setForm(initialFormState);
  };

  const currentPlanName = (() => {
    if (!form.currentPlan || plans.length === 0) return '—';
    const plan = plans.find((p) => String(p._id) === String(form.currentPlan));
    return plan?.name_en || '—';
  })();

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {error && (
        <div className="md:col-span-2">
          <ErrorMessage message={error} />
        </div>
      )}

      <div>
        <label className="block mb-1 font-medium">Customer</label>
        <select
          name="customer"
          value={form.customer}
          onChange={handleChange}
          className="input-style"
        >
          <option value="">Select...</option>
          {customers.map((c) => (
            <option key={c._id} value={c._id}>
              {c.companyName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Initial Subscription Date</label>
        <input
          type="date"
          name="initialSubscriptionDate"
          value={form.initialSubscriptionDate}
          onChange={handleChange}
          className="input-style"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Initial Plan</label>
        <select
          name="initialPlan"
          value={form.initialPlan}
          onChange={handleChange}
          className="input-style"
        >
          <option value="">Select...</option>
          {plans.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name_en}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Current Plan</label>
        <input
          type="text"
          value={currentPlanName}
          disabled
          className="input-style bg-gray-100"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Current Plan Date</label>
        <input
          type="date"
          name="currentPlanDate"
          value={form.currentPlanDate}
          onChange={handleChange}
          className="input-style"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Fleet Limit</label>
        <input
          type="number"
          name="currentFleetAmount"
          value={form.currentFleetAmount}
          onChange={handleChange}
          className="input-style"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Recurrence</label>
        <select
          name="recurrence"
          value={form.recurrence}
          onChange={handleChange}
          className="input-style"
        >
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Price (USD)</label>
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          className="input-style"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Next Renewal Date</label>
        <input
          type="date"
          name="nextRenewalDate"
          value={form.nextRenewalDate}
          disabled
          className="input-style bg-gray-100"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="input-style"
        >
          <option value="active">Active</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      <div className="md:col-span-2 flex justify-end gap-4">
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-6 rounded shadow"
        >
          {isEdit ? 'Update Subscriber' : 'Save Subscriber'}
        </button>
      </div>
    </form>
  );
};

export default SubscriberForm;
