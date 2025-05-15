import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { createCustomer, updateCustomer } from '@/services/customerService';
import { fetchPlans } from '@/services/planService';

const CustomerForm = ({ onClose, initialValues = {}, isEdit = false }) => {
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    companyName: '',
    logo: null,
    contactPerson: '',
    email: '',
    phone: '',
    address: { street: '', city: '', state: '', zip: '', country: '' },
    currentPlan: '',
    nextRenewalDate: '',
    vehiclesRegistered: 0,
  });

  useEffect(() => {
    if (isEdit && initialValues) {
      setForm({
        ...initialValues,
        currentPlan: initialValues?.currentPlan?._id || initialValues.currentPlan || '',
        address: {
          street: initialValues?.address?.street || '',
          city: initialValues?.address?.city || '',
          state: initialValues?.address?.state || '',
          zip: initialValues?.address?.zip || '',
          country: initialValues?.address?.country || '',
        },
        nextRenewalDate: initialValues.nextRenewalDate ? initialValues.nextRenewalDate.split('T')[0] : ''
      });
    }
  }, [initialValues, isEdit]);

  useEffect(() => {
    fetchPlans()
      .then(res => {
        const plansData = Array.isArray(res.data) ? res.data : res.data?.plans || [];
        const activePlans = plansData.filter(plan => plan.active); // ✅ filter only active
        setPlans(activePlans);
      })
      .catch(() => setPlans([]));
  }, []);

  const getSelectedPlanLimit = () => {
    const selectedPlan = plans.find(p => String(p._id) === String(form.currentPlan));
    return selectedPlan?.fleetAmount || 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'logo') {
      setForm(prev => ({ ...prev, logo: files[0] }));
    } else if (name.startsWith('address.')) {
      const key = name.split('.')[1];
      setForm(prev => ({
        ...prev,
        address: { ...prev.address, [key]: value }
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const fleetLimit = getSelectedPlanLimit();
    const vehicleCount = parseInt(form.vehiclesRegistered, 10);

    if (vehicleCount > fleetLimit) {
      setError(`❌ Vehicle count exceeds plan limit (${fleetLimit}).`);
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'address') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          formData.append(`address[${subKey}]`, subValue);
        });
      } else if (key === 'nextRenewalDate' && (!value || value === 'null')) {
        // skip
      } else {
        formData.append(key, value);
      }
    });

    try {
      if (isEdit) {
        await updateCustomer(formData, initialValues._id);
      } else {
        await createCustomer(formData);
      }
      onClose();
    } catch (err) {
      setError(err?.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {error && (
        <div className="col-span-2">
          <ErrorMessage message={error} />
        </div>
      )}

      <div className="col-span-2">
        <label className="block text-sm font-medium mb-1">Company Logo</label>
        <input
          name="logo"
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
            file:rounded file:border-0 file:text-sm file:font-semibold
            file:bg-blue-600 file:text-white hover:file:bg-blue-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Company Name</label>
        <input name="companyName" value={form.companyName} onChange={handleChange} required className="input-style" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Contact Person</label>
        <input name="contactPerson" value={form.contactPerson} onChange={handleChange} required className="input-style" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required className="input-style" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Phone</label>
        <input name="phone" value={form.phone} onChange={handleChange} required className="input-style" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Street</label>
        <input name="address.street" value={form.address.street} onChange={handleChange} className="input-style" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">City</label>
        <input name="address.city" value={form.address.city} onChange={handleChange} className="input-style" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">State</label>
        <input name="address.state" value={form.address.state} onChange={handleChange} className="input-style" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Zip Code</label>
        <input name="address.zip" value={form.address.zip} onChange={handleChange} className="input-style" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Country</label>
        <input name="address.country" value={form.address.country} onChange={handleChange} className="input-style" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Current Plan</label>
        <select name="currentPlan" value={form.currentPlan} onChange={handleChange} required className="input-style">
          <option value="">Select Plan</option>
          {plans.map(plan => (
            <option key={plan._id} value={plan._id}>{plan.name_en}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Next Renewal Date</label>
        <input name="nextRenewalDate" type="date" value={form.nextRenewalDate} onChange={handleChange} className="input-style" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Vehicles Registered</label>
        <input name="vehiclesRegistered" type="number" min="0" value={form.vehiclesRegistered} onChange={handleChange} className="input-style" />
        <p className="text-xs text-gray-500 mt-1">Max allowed: {getSelectedPlanLimit()}</p>
      </div>

      <div className="col-span-2 flex justify-end mt-4">
        <Button
          type="submit"
          disabled={parseInt(form.vehiclesRegistered) > getSelectedPlanLimit()}
        >
          {isEdit ? 'Update Customer' : 'Save Customer'}
        </Button>
      </div>
    </form>
  );
};

export default CustomerForm;
