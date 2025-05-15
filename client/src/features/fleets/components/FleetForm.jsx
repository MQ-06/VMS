import { useEffect, useState } from 'react';
import { fetchCustomers } from '@/services/customerService';
import ErrorMessage from '@/components/ui/ErrorMessage';

const FleetForm = ({ onSubmit, initialValues = {}, isEdit = false, onClose }) => {
  const [form, setForm] = useState({ customer: '', name: '', supervisor: '', ...initialValues });
  const [customers, setCustomers] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCustomers()
      .then(res => {
        const activeCustomers = res.data.filter(c => c.active); // ✅ Only active customers
        setCustomers(activeCustomers);
      })
      .catch(() => setCustomers([]));
  }, []);

  useEffect(() => {
    if (initialValues) {
      setForm({ customer: '', name: '', supervisor: '', ...initialValues });
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!form.customer) errs.customer = 'Customer is required';
    if (!form.name) errs.name = 'Fleet name is required';
    if (!form.supervisor) errs.supervisor = 'Supervisor name is required';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label>Customer</label>
        <select name="customer" value={form.customer} onChange={handleChange} className="input-style">
          <option value="">Select Customer</option>
          {customers.map(c => (
            <option key={c._id} value={c._id}>{c.companyName}</option>
          ))}
        </select>
        <ErrorMessage message={errors.customer} />
      </div>

      <div>
        <label>Fleet Name</label>
        <input name="name" value={form.name} onChange={handleChange} className="input-style" />
        <ErrorMessage message={errors.name} />
      </div>

      <div className="md:col-span-2">
        <label>Supervisor Name</label>
        <input name="supervisor" value={form.supervisor} onChange={handleChange} className="input-style" />
        <ErrorMessage message={errors.supervisor} />
      </div>

      <div className="md:col-span-2 flex justify-end gap-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded shadow" type="submit">
          {isEdit ? 'Update Fleet' : 'Save Fleet'}
        </button>
      </div>
    </form>
  );
};

export default FleetForm;
