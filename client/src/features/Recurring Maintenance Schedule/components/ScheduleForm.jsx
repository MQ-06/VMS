// src/features/recurring_maintenance_schedule/components/ScheduleForm.jsx
import { useEffect, useState } from 'react';
import { fetchCustomers } from '@/services/customerService';
import { fetchFleets } from '@/services/fleetService';
import { fetchVehicles } from '@/services/vehicleService';
import { fetchRecurringRules } from '@/services/recurringScheduleService';
import ErrorMessage from '@/components/ui/ErrorMessage';

const ScheduleForm = ({ onSubmit, initialValues = {}, isEdit = false, onClose }) => {
  const [form, setForm] = useState({
    customer: '',
    fleet: '',
    vehicle: '',
    recurringRule: '',
    lastDate: '',
    lastMileage: '',
    ...initialValues
  });

  const [customers, setCustomers] = useState([]);
  const [fleets, setFleets] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [rules, setRules] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCustomers()
      .then(res => {
        setCustomers(res.data.filter(c => c.active));
      })
      .catch(() => setCustomers([]));
  }, []);

  useEffect(() => {
    const customerId = form.customer?._id || form.customer;
    if (!customerId) return;

    fetchFleets(customerId)
      .then(res => {
        const filteredFleets = res.data.filter(f => f.customer === customerId || f.customer?._id === customerId);
        setFleets(filteredFleets);
      })
      .catch(() => setFleets([]));

    fetchRecurringRules(customerId)
      .then(res => {
        setRules(res.data);
      })
      .catch(() => setRules([]));

    setVehicles([]);
    setForm(prev => ({ ...prev, fleet: '', vehicle: '', recurringRule: '' }));
  }, [form.customer]);

  useEffect(() => {
    const customerId = form.customer?._id || form.customer;
    const fleetId = form.fleet?._id || form.fleet;
    if (!customerId || !fleetId) return;

    fetchVehicles(customerId)
      .then(res => {
        const filtered = res.data.filter(v => v.fleet === fleetId || v.fleet?._id === fleetId);
        setVehicles(filtered);
      })
      .catch(() => setVehicles([]));
  }, [form.fleet]);

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setForm(prev => ({ ...prev, ...initialValues }));
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    if (isEdit) return {}; // No validation on edit
    const errs = {};
    if (!form.customer) errs.customer = 'Customer is required';
    if (!form.fleet) errs.fleet = 'Fleet is required';
    if (!form.vehicle) errs.vehicle = 'Vehicle is required';
    if (!form.recurringRule) errs.recurringRule = 'Recurring maintenance rule is required';
    if (!form.lastDate) errs.lastDate = 'Last performed date is required';
    if (!form.lastMileage) errs.lastMileage = 'Last mileage is required';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit({
      ...form,
      customer: form.customer?._id || form.customer,
      fleet: form.fleet?._id || form.fleet,
      vehicle: form.vehicle?._id || form.vehicle,
      recurringRule: form.recurringRule?._id || form.recurringRule
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label>Customer</label>
        <select name="customer" value={form.customer._id || form.customer} onChange={handleChange} className="input-style">
          <option value="">Select Customer</option>
          {customers.map(c => (
            <option key={c._id} value={c._id}>{c.companyName}</option>
          ))}
        </select>
        <ErrorMessage message={errors.customer} />
      </div>

      <div>
        <label>Fleet</label>
        <select name="fleet" value={form.fleet._id || form.fleet} onChange={handleChange} className="input-style">
          <option value="">Select Fleet</option>
          {fleets.map(f => (
            <option key={f._id} value={f._id}>{f.name}</option>
          ))}
        </select>
        <ErrorMessage message={errors.fleet} />
      </div>

      <div>
        <label>Vehicle</label>
        <select name="vehicle" value={form.vehicle._id || form.vehicle} onChange={handleChange} className="input-style">
          <option value="">Select Vehicle</option>
          {vehicles.map(v => (
            <option key={v._id} value={v._id}>{v.name || v.identifier}</option>
          ))}
        </select>
        <ErrorMessage message={errors.vehicle} />
      </div>

      <div>
        <label>Recurring Maintenance</label>
        <select name="recurringRule" value={form.recurringRule._id || form.recurringRule} onChange={handleChange} className="input-style">
          <option value="">Select Rule</option>
          {rules.map(r => (
            <option key={r._id} value={r._id}>{r.name}</option>
          ))}
        </select>
        <ErrorMessage message={errors.recurringRule} />
      </div>

      <div>
        <label>Last Date Performed</label>
        <input name="lastDate" type="date" value={form.lastDate} onChange={handleChange} className="input-style" />
        <ErrorMessage message={errors.lastDate} />
      </div>

      <div>
        <label>Last Mileage Performed</label>
        <input name="lastMileage" type="number" value={form.lastMileage} onChange={handleChange} className="input-style" />
        <ErrorMessage message={errors.lastMileage} />
      </div>

      <div className="md:col-span-2 flex justify-end gap-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded shadow" type="submit">
          {isEdit ? 'Update Schedule' : 'Save Schedule'}
        </button>
        
      </div>
    </form>
  );
};

export default ScheduleForm;
