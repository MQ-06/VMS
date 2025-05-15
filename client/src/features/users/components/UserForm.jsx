import { useEffect, useState } from 'react';
import { fetchCustomers } from '@/services/customerService';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const UserForm = ({ onSubmit, initialValues = {}, isEdit = false, onClose }) => {
  const initialFormState = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    type: '',
    customer: '',
    active: true,
  };

  const [form, setForm] = useState({ ...initialFormState, ...initialValues });
  const [customers, setCustomers] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

  useEffect(() => {
    fetchCustomers()
      .then((res) => {
        const activeCustomers = res.data.filter(c => c.active); // ✅ Only active
        setCustomers(activeCustomers);
      })
      .catch(() => setError('Failed to load customers'));
  }, []);

  useEffect(() => {
    if (isEdit && initialValues) {
      setForm({ ...initialFormState, ...initialValues });
    }
  }, [initialValues, isEdit]);

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    const val = inputType === 'checkbox' ? checked : value;
    setForm({ ...form, [name]: val });

    if (name === 'password') {
      setPasswordStrength(getPasswordStrength(value));
    }
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    switch (strength) {
      case 5: return 'Strong';
      case 4: return 'Good';
      case 3: return 'Moderate';
      default: return 'Weak';
    }
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const { email, password, type, customer } = form;

    if (!form.firstName || !form.lastName || !email || (!isEdit && !password) || !type) {
      setError('❌ Please fill in all required fields.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('❌ Please enter a valid email address.');
      return;
    }

    if (['customer_admin', 'customer_user', 'driver'].includes(type) && !customer) {
      setError('❌ Please select a customer.');
      return;
    }

    if (!isEdit && getPasswordStrength(password) !== 'Strong') {
      setError('❌ Password must be strong: include 8+ characters, upper/lower case, number & symbol.');
      return;
    }

    const finalForm = { ...form };
    if (isEdit) delete finalForm.password;

    onSubmit(finalForm);
    if (!isEdit) setForm(initialFormState);
  };

  const strengthColor = {
    Weak: 'bg-red-500',
    Moderate: 'bg-yellow-500',
    Good: 'bg-blue-500',
    Strong: 'bg-green-600',
  }[passwordStrength] || 'bg-gray-300';

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {error && (
        <div className="md:col-span-2">
          <ErrorMessage message={error} />
        </div>
      )}

      <div>
        <label className="block mb-1 font-medium">First Name</label>
        <input name="firstName" value={form.firstName} onChange={handleChange} className="input-style" />
      </div>

      <div>
        <label className="block mb-1 font-medium">Last Name</label>
        <input name="lastName" value={form.lastName} onChange={handleChange} className="input-style" />
      </div>

      <div className="md:col-span-2">
        <label className="block mb-1 font-medium">Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} className="input-style" />
      </div>

      {!isEdit && (
        <div className="md:col-span-2 relative">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={form.password}
            onChange={handleChange}
            className="input-style pr-10"
          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-9 cursor-pointer text-gray-600"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
          {form.password && (
            <div className="mt-2">
              <div className="h-2 rounded-full transition-all duration-300" style={{ width: '100%', backgroundColor: '#e5e7eb' }}>
                <div className={`h-2 ${strengthColor} rounded-full`}
                     style={{ width: `${(passwordStrength === 'Weak' ? 25 : passwordStrength === 'Moderate' ? 50 : passwordStrength === 'Good' ? 75 : 100)}%` }} />
              </div>
              <div className="text-sm mt-1 text-gray-600">
                Strength: <span className="font-semibold">{passwordStrength}</span>
              </div>
            </div>
          )}
        </div>
      )}

      <div>
        <label className="block mb-1 font-medium">Type</label>
        <select name="type" value={form.type} onChange={handleChange} className="input-style">
          <option value="">Select...</option>
          <option value="super_admin">Super Admin</option>
          <option value="customer_admin">Customer Admin</option>
          <option value="customer_user">Customer User</option>
          <option value="driver">Company Driver</option>
        </select>
      </div>

      {['customer_admin', 'customer_user', 'driver'].includes(form.type) && (
        <div>
          <label className="block mb-1 font-medium">Customer</label>
          <select name="customer" value={form.customer} onChange={handleChange} className="input-style">
            <option value="">Select...</option>
            {customers.map((c) => (
              <option key={c._id} value={c._id}>{c.companyName}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block mb-1 font-medium">Active</label>
        <select
          name="active"
          value={form.active ? 'true' : 'false'}
          onChange={(e) => setForm({ ...form, active: e.target.value === 'true' })}
          className="input-style"
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>

      <div className="md:col-span-2 flex justify-end gap-4">
        <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded shadow">
          {isEdit ? 'Update User' : 'Save User'}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
