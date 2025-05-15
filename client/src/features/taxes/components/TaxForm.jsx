import { useEffect, useState } from 'react';
import Select from 'react-select';
import { getCountries, getStatesByCountry, getCitiesByCountry } from '@/services/locationService';
import ErrorMessage from '@/components/ui/ErrorMessage';

const TaxForm = ({ onSubmit, initialValues = {}, isEdit = false, onClose }) => {
  const [form, setForm] = useState({
    name: '',
    nameSpanish: '',
    type: 'fixed',
    amount: '',
    country: '',
    states: [],
    cities: []
  });

  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    if (initialValues) {
      setForm((prev) => ({
        ...prev,
        ...initialValues,
      }));
    }
  }, [initialValues]);

  useEffect(() => {
    getCountries().then(setCountries).catch(() => setCountries([]));
  }, []);

  useEffect(() => {
    if (form.country) {
      getStatesByCountry(form.country).then(setStates).catch(() => setStates([]));
      getCitiesByCountry(form.country).then(setCities).catch(() => setCities([]));
    } else {
      setStates([]);
      setCities([]);
    }
  }, [form.country]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Tax name is required';
    if (!form.nameSpanish.trim()) newErrors.nameSpanish = 'Spanish name is required';
    if (!form.amount || Number(form.amount) <= 0) newErrors.amount = 'Amount must be greater than 0';
    if (!form.country.trim()) newErrors.country = 'Country is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(form);
  };

  const inputClass = (field) =>
    `input-style ${errors[field] ? 'border-red-500 focus:ring-red-500' : ''}`;

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex flex-col">
        <label className="text-sm text-gray-700 mb-1">Tax Name</label>
        <input
          className={inputClass('name')}
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Tax Name"
        />
        <ErrorMessage message={errors.name} />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-700 mb-1">Nombre Español</label>
        <input
          className={inputClass('nameSpanish')}
          name="nameSpanish"
          value={form.nameSpanish}
          onChange={handleChange}
          placeholder="Nombre Español"
        />
        <ErrorMessage message={errors.nameSpanish} />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-700 mb-1">Type</label>
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="input-style"
        >
          <option value="fixed">Fixed</option>
          <option value="percentage">Percentage</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-700 mb-1">Amount</label>
        <input
          className={inputClass('amount')}
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="Amount"
          type="number"
        />
        <ErrorMessage message={errors.amount} />
      </div>

      <div className="flex flex-col md:col-span-2">
        <label className="text-sm text-gray-700 mb-1">Country</label>
        <select
          name="country"
          value={form.country}
          onChange={handleChange}
          className={inputClass('country')}
        >
          <option value="">Select Country</option>
          {countries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <ErrorMessage message={errors.country} />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-700 mb-1">States</label>
        <Select
          isMulti
          options={[{ label: 'All States', value: '__ALL__' }, ...states.map((s) => ({ label: s, value: s }))]}
          value={
            form.states.includes('__ALL__')
              ? [{ label: 'All States', value: '__ALL__' }]
              : form.states.map((s) => ({ label: s, value: s }))
          }
          onChange={(selected) => {
            const values = selected.map((opt) => opt.value);
            if (values.includes('__ALL__')) {
              setForm({ ...form, states: ['__ALL__'] });
            } else {
              setForm({ ...form, states: values });
            }
          }}
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-700 mb-1">Cities</label>
        <Select
          isMulti
          options={[{ label: 'All Cities', value: '__ALL__' }, ...cities.map((c) => ({ label: c, value: c }))]}
          value={
            form.cities.includes('__ALL__')
              ? [{ label: 'All Cities', value: '__ALL__' }]
              : form.cities.map((c) => ({ label: c, value: c }))
          }
          onChange={(selected) => {
            const values = selected.map((opt) => opt.value);
            if (values.includes('__ALL__')) {
              setForm({ ...form, cities: ['__ALL__'] });
            } else {
              setForm({ ...form, cities: values });
            }
          }}
        />
      </div>

      <div className="md:col-span-2 flex justify-end gap-4">
       
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded shadow"
        >
          {isEdit ? 'Update Tax' : 'Save Tax'}
        </button>
      </div>
    </form>
  );
};

export default TaxForm;
