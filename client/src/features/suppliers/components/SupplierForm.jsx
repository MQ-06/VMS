import { useEffect, useState } from 'react';
import { fetchCustomers } from '@/services/customerService';
import ErrorMessage from '@/components/ui/ErrorMessage';

const SupplierForm = ({ onSubmit, initialValues = {}, isEdit = false, onClose }) => {
  const [form, setForm] = useState({
    customer: '',
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    },
    type: '',
    active: true
  });
  const [logoFile, setLogoFile] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCustomers()
      .then(res => setCustomers(res.data.filter(c => c.active))) // ✅ Only active customers
      .catch(() => setCustomers([]));
  }, []);

  useEffect(() => {
    if (initialValues && isEdit) {
      setForm({
        customer: initialValues.customer?._id || '',
        name: initialValues.name || '',
        contactPerson: initialValues.contactPerson || '',
        phone: initialValues.phone || '',
        email: initialValues.email || '',
        address: initialValues.address || {
          street: '', city: '', state: '', zip: '', country: ''
        },
        type: initialValues.type || '',
        active: typeof initialValues.active === 'boolean' ? initialValues.active : true
      });
    }
  }, [initialValues, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const key = name.split('.')[1];
      setForm({ ...form, address: { ...form.address, [key]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
    setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!form.name) errs.name = 'Supplier name is required';
    if (!form.customer) errs.customer = 'Customer is required';
    if (!form.type) errs.type = 'Type is required';
    if (!form.email) errs.email = 'Email is required';
    if (!form.phone) errs.phone = 'Phone is required';
    if (!form.contactPerson) errs.contactPerson = 'Contact person is required';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    const formData = new FormData();
    for (const key in form) {
      if (key === 'address') {
        formData.append('address', JSON.stringify(form.address));
      } else {
        formData.append(key, form[key]);
      }
    }

    if (logoFile) {
      formData.append('logo', logoFile);
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="md:col-span-2 flex flex-col items-start">
        <label className="mb-1 font-medium">Upload Logo</label>
        <input
          type="file"
          onChange={(e) => setLogoFile(e.target.files[0])}
          className="hidden"
          id="logo-upload"
        />
        <label htmlFor="logo-upload" className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow">
          Choose Logo
        </label>
        {logoFile && <p className="mt-2 text-sm text-gray-600">Selected: {logoFile.name}</p>}
      </div>

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
        <label>Supplier Name</label>
        <input name="name" value={form.name} onChange={handleChange} className="input-style" />
        <ErrorMessage message={errors.name} />
      </div>

      <div>
        <label>Contact Person</label>
        <input name="contactPerson" value={form.contactPerson} onChange={handleChange} className="input-style" />
        <ErrorMessage message={errors.contactPerson} />
      </div>

      <div>
        <label>Phone</label>
        <input name="phone" value={form.phone} onChange={handleChange} className="input-style" />
        <ErrorMessage message={errors.phone} />
      </div>

      <div>
        <label>Email</label>
        <input name="email" value={form.email} onChange={handleChange} className="input-style" />
        <ErrorMessage message={errors.email} />
      </div>

      <div className="md:col-span-2 font-semibold">Address</div>
      {['street', 'city', 'state', 'zip', 'country'].map((field) => (
        <div key={field}>
          <label className="capitalize">{field}</label>
          <input
            name={`address.${field}`}
            value={form.address[field]}
            onChange={handleChange}
            className="input-style"
          />
        </div>
      ))}

      <div className="md:col-span-2">
        <label>Type</label>
        <select name="type" value={form.type} onChange={handleChange} className="input-style">
          <option value="">Select Type</option>
          <option value="mechanic">Mechanic</option>
          <option value="electro mechanic">Electro Mechanic</option>
          <option value="body shop">Body Shop</option>
          <option value="tire center">Tire Center</option>
          <option value="transmissions">Transmissions</option>
          <option value="other">Other</option>
        </select>
        <ErrorMessage message={errors.type} />
      </div>

      <div className="md:col-span-2 flex justify-end gap-4">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow">
          {isEdit ? 'Update Supplier' : 'Save Supplier'}
        </button>
      </div>
    </form>
  );
};

export default SupplierForm;
