import { useState } from 'react';

const SettingsForm = ({ form, setForm, onSave }) => {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    // Company Name
    if (!form.companyName?.trim()) newErrors.companyName = 'Company Name is required';
    else if (/^\d+$/.test(form.companyName)) newErrors.companyName = 'Company Name cannot be only numbers';

    // Email
    if (!form.email?.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Enter a valid email';

    // Phone
    if (!form.phone?.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\+?[0-9]{7,15}$/.test(form.phone)) newErrors.phone = 'Enter a valid phone number';

    // Address fields
    if (!form.street?.trim()) newErrors.street = 'Street is required';

    if (!form.city?.trim()) newErrors.city = 'City is required';
    else if (!/^[a-zA-Z\s]+$/.test(form.city)) newErrors.city = 'City must contain only letters';

    if (!form.state?.trim()) newErrors.state = 'State is required';
    else if (!/^[a-zA-Z\s]+$/.test(form.state)) newErrors.state = 'State must contain only letters';

    if (!form.zip?.trim()) newErrors.zip = 'ZIP Code is required';
    else if (!/^\d{4,10}$/.test(form.zip)) newErrors.zip = 'Enter a valid ZIP Code';

    if (!form.country?.trim()) newErrors.country = 'Country is required';
    else if (!/^[a-zA-Z\s]+$/.test(form.country)) newErrors.country = 'Country must contain only letters';

    // API Keys
    if (!form.stripeKey?.trim()) newErrors.stripeKey = 'Stripe API Key is required';
    else if (!/^pk_(test|live)_/.test(form.stripeKey)) newErrors.stripeKey = 'Must start with pk_test_ or pk_live_';

    if (!form.mapsKey?.trim()) newErrors.mapsKey = 'Google Maps API Key is required';
    else if (!/^AIza/.test(form.mapsKey)) newErrors.mapsKey = 'Must start with AIza';

    if (!form.socketKey?.trim()) newErrors.socketKey = 'Socket Labs API Key is required';
    else if (!/^[a-zA-Z0-9-]{8,}$/.test(form.socketKey)) newErrors.socketKey = 'Invalid Socket Labs Key format';

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      onSave(form);
    }
  };

  const inputClass = (field) =>
    `border ${errors[field] ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
      errors[field] ? 'focus:ring-red-500' : 'focus:ring-blue-500'
    }`;

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Company Name */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Company Name</label>
        <input
          name="companyName"
          value={form.companyName}
          onChange={handleChange}
          placeholder="e.g. FleetPro Inc."
          className={inputClass('companyName')}
        />
        {errors.companyName && <span className="text-red-600 text-sm mt-1">{errors.companyName}</span>}
      </div>

      {/* Email */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="support@company.com"
          className={inputClass('email')}
        />
        {errors.email && <span className="text-red-600 text-sm mt-1">{errors.email}</span>}
      </div>

      {/* Phone */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Phone</label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="+1 123 456 7890"
          className={inputClass('phone')}
        />
        {errors.phone && <span className="text-red-600 text-sm mt-1">{errors.phone}</span>}
      </div>

      {/* Street */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Street</label>
        <input
          name="street"
          value={form.street}
          onChange={handleChange}
          placeholder="123 Business St"
          className={inputClass('street')}
        />
        {errors.street && <span className="text-red-600 text-sm mt-1">{errors.street}</span>}
      </div>

      {/* City */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">City</label>
        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="City"
          className={inputClass('city')}
        />
        {errors.city && <span className="text-red-600 text-sm mt-1">{errors.city}</span>}
      </div>

      {/* State */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">State</label>
        <input
          name="state"
          value={form.state}
          onChange={handleChange}
          placeholder="State"
          className={inputClass('state')}
        />
        {errors.state && <span className="text-red-600 text-sm mt-1">{errors.state}</span>}
      </div>

      {/* ZIP and Country side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:col-span-2">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
          <input
            name="zip"
            value={form.zip}
            onChange={handleChange}
            placeholder="12345"
            className={inputClass('zip')}
          />
          {errors.zip && <span className="text-red-600 text-sm mt-1">{errors.zip}</span>}
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Country</label>
          <input
            name="country"
            value={form.country}
            onChange={handleChange}
            placeholder="Country"
            className={inputClass('country')}
          />
          {errors.country && <span className="text-red-600 text-sm mt-1">{errors.country}</span>}
        </div>
      </div>

      {/* Stripe Key */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Stripe API Key</label>
        <input
          name="stripeKey"
          value={form.stripeKey}
          onChange={handleChange}
          placeholder="pk_test_..."
          className={inputClass('stripeKey')}
        />
        {errors.stripeKey && <span className="text-red-600 text-sm mt-1">{errors.stripeKey}</span>}
      </div>

      {/* Maps Key */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Google Maps API Key</label>
        <input
          name="mapsKey"
          value={form.mapsKey}
          onChange={handleChange}
          placeholder="AIza..."
          className={inputClass('mapsKey')}
        />
        {errors.mapsKey && <span className="text-red-600 text-sm mt-1">{errors.mapsKey}</span>}
      </div>

      {/* Socket Labs */}
      <div className="flex flex-col md:col-span-2">
        <label className="text-sm font-medium text-gray-700 mb-1">Socket Labs API Key</label>
        <input
          name="socketKey"
          value={form.socketKey}
          onChange={handleChange}
          placeholder="xxxxx-xxxx-xxxx"
          className={inputClass('socketKey')}
        />
        {errors.socketKey && <span className="text-red-600 text-sm mt-1">{errors.socketKey}</span>}
      </div>

      {/* Save Button */}
      <div className="md:col-span-2 flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 transition-colors text-white font-medium px-6 py-2 rounded-lg shadow"
        >
          Save Settings
        </button>
      </div>
    </form>
  );
};

export default SettingsForm;
