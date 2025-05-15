import { useEffect, useState } from 'react';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { fetchCustomers } from '@/services/customerService';

const MyRecurringMaintenanceForm = ({ onSubmit, initialValues = {}, isEdit = false }) => {
  const initialFormState = {
    customer: '',
    name: '',
    performEvery: 'days',
    mileageRecurrence: '',
    daysRecurrence: '',
  };

  const [form, setForm] = useState({ ...initialFormState, ...initialValues });
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCustomers().then(res => {
      const activeCustomers = res.data?.filter(c => c.active);
      setCustomers(activeCustomers || []);
    });
  }, []);

  useEffect(() => {
    if (isEdit && initialValues) {
      setForm({ ...initialFormState, ...initialValues });
    }
  }, [initialValues, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const { customer, name, performEvery, mileageRecurrence, daysRecurrence } = form;

    if (!customer || !name || !performEvery || (performEvery === 'mileage' && !mileageRecurrence) || (performEvery === 'days' && !daysRecurrence) || (performEvery === 'both' && (!mileageRecurrence || !daysRecurrence))) {
      setError('❌ Please fill all required fields based on selection.');
      return;
    }

    onSubmit(form);
    if (!isEdit) setForm(initialFormState);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {error && (
        <div className="md:col-span-2">
          <ErrorMessage message={error} />
        </div>
      )}

      <div>
        <label className="block mb-1 font-medium">Customer</label>
        <select name="customer" value={form.customer} onChange={handleChange} className="input-style">
          <option value="">Select...</option>
          {customers.map((c) => (
            <option key={c._id} value={c._id}>{c.companyName}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Name of Maintenance</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} className="input-style" />
      </div>

      <div>
        <label className="block mb-1 font-medium">Perform Every</label>
        <select name="performEvery" value={form.performEvery} onChange={handleChange} className="input-style">
          <option value="days">Days</option>
          <option value="mileage">Mileage</option>
          <option value="both">Both</option>
        </select>
      </div>

      {(form.performEvery === 'days' || form.performEvery === 'both') && (
        <div>
          <label className="block mb-1 font-medium">Days Recurrence</label>
          <input type="number" name="daysRecurrence" value={form.daysRecurrence} onChange={handleChange} className="input-style" />
        </div>
      )}

      {(form.performEvery === 'mileage' || form.performEvery === 'both') && (
        <div>
          <label className="block mb-1 font-medium">Mileage Recurrence</label>
          <input type="number" name="mileageRecurrence" value={form.mileageRecurrence} onChange={handleChange} className="input-style" />
        </div>
      )}

      <div className="md:col-span-2 flex justify-end gap-4">
        <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded shadow">
          {isEdit ? 'Update' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default MyRecurringMaintenanceForm;