import { useEffect, useState } from 'react';
import { fetchCustomers } from '@/services/customerService';
import ErrorMessage from '@/components/ui/ErrorMessage';

const PartServiceForm = ({ onSubmit, initialValues = {}, isEdit = false }) => {
  const [form, setForm] = useState({
    customer: '',
    nameEn: '',
    nameEs: '',
    averageCost: '',
    type: '',
    active: true,
  });

  const [customers, setCustomers] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCustomers()
      .then(res => setCustomers(res.data.filter(c => c.active)))
      .catch(() => setCustomers([]));
  }, []);

  useEffect(() => {
    if (initialValues && isEdit) {
      setForm({
        customer: initialValues.customer?._id || '',
        nameEn: initialValues.nameEn || '',
        nameEs: initialValues.nameEs || '',
        averageCost: initialValues.averageCost || '',
        type: initialValues.type || '',
        active: typeof initialValues.active === 'boolean' ? initialValues.active : true
      });
    }
  }, [initialValues, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setForm({ ...form, [name]: val });
    setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!form.customer) errs.customer = 'Customer is required';
    if (!form.nameEn) errs.nameEn = 'English name is required';
    if (!form.nameEs) errs.nameEs = 'Spanish name is required';
    if (!form.averageCost) errs.averageCost = 'Average cost is required';
    if (!form.type) errs.type = 'Type is required';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
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
          {customers.map((c) => (
            <option key={c._id} value={c._id}>{c.companyName}</option>
          ))}
        </select>
        <ErrorMessage message={errors.customer} />
      </div>

      <div>
        <label>Part/Service Name (English)</label>
        <input name="nameEn" value={form.nameEn} onChange={handleChange} className="input-style" />
        <ErrorMessage message={errors.nameEn} />
      </div>

      <div>
        <label>Part/Service Name (Spanish)</label>
        <input name="nameEs" value={form.nameEs} onChange={handleChange} className="input-style" />
        <ErrorMessage message={errors.nameEs} />
      </div>

      <div>
        <label>Average Cost (USD)</label>
        <input type="number" name="averageCost" value={form.averageCost} onChange={handleChange} className="input-style" />
        <ErrorMessage message={errors.averageCost} />
      </div>

      <div>
        <label>Type</label>
        <select name="type" value={form.type} onChange={handleChange} className="input-style">
          <option value="">Select Type</option>
          <option value="part">Part</option>
          <option value="service">Service</option>
        </select>
        <ErrorMessage message={errors.type} />
      </div>

      

      <div className="md:col-span-2 flex justify-end gap-4">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow">
          {isEdit ? 'Update' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default PartServiceForm;
