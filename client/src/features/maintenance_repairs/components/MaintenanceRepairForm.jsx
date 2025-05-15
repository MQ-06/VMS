import { useEffect, useState } from 'react';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { fetchCustomers } from '@/services/customerService';
import { fetchFleets } from '@/services/fleetService';
import { fetchVehicles } from '@/services/vehicleService';
import { fetchSuppliers } from '@/services/supplierService';
import { fetchUsers } from '@/services/userService';
import { fetchPartsServices } from '@/services/partService';
import { fetchRepairCategories } from '@/services/repairCategoryService';


const MaintenanceRepairForm = ({ onSubmit, initialValues = {}, isEdit = false }) => {
  const [form, setForm] = useState({
    customer: '', fleet: '', vehicle: '', supplier: '',
    type: '', category: '', user: '', date: '', mileage: '',
    cost: '', description: '', parts: [], taxes: '', tags: [],
    photos: [], invoice: null,
  });

  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState('');
  const [dropdowns, setDropdowns] = useState({
    customers: [], fleets: [], vehicles: [], suppliers: [],
    users: [], parts: [], categories: []
  });

  useEffect(() => {
    if (isEdit && initialValues) {
      setForm(prev => ({
        ...prev,
        ...initialValues,
        tags: initialValues.tags || [],
        parts: initialValues.parts || [],
        photos: [],
        invoice: null,
        date: initialValues.date?.split('T')[0] || ''
      }));
    }
  }, [initialValues, isEdit]);

  useEffect(() => {
    fetchCustomers().then(res =>
      setDropdowns(prev => ({ ...prev, customers: res.data.filter(c => c.active) }))
    );
    fetchPartsServices().then(res =>
      setDropdowns(prev => ({ ...prev, parts: res.data.filter(p => p.active) }))
    );
  }, []);

  useEffect(() => {
    if (!form.customer) return;

    console.log('Fetching dependent data for customer:', form.customer);

    fetchFleets({ customer: form.customer }).then(res => {
      console.log('Fleets:', res.data);
      setDropdowns(prev => ({ ...prev, fleets: res.data.filter(f => f.active) }));
    });

    fetchSuppliers({ customer: form.customer }).then(res => {
      console.log('Suppliers:', res.data);
      setDropdowns(prev => ({ ...prev, suppliers: res.data.filter(s => s.active) }));
    });

    fetchUsers({ customer: form.customer }).then(res => {
      console.log('Users:', res.data);
      setDropdowns(prev => ({ ...prev, users: res.data.filter(u => u.active) }));
    });
  }, [form.customer]);

  useEffect(() => {
    if (form.customer && form.fleet) {
      console.log('Fetching vehicles with:', form.customer, form.fleet);
      fetchVehicles({ customer: form.customer, fleet: form.fleet }).then(res => {
        console.log('Fetched vehicles:', res.data);
        setDropdowns(prev => ({ ...prev, vehicles: res.data.filter(v => v.active) }));
      });
    }
  }, [form.customer, form.fleet]);

  useEffect(() => {
    if (form.customer && form.type) {
      console.log('Fetching categories with:', form.customer, form.type);
      fetchRepairCategories({ customer: form.customer, type: form.type }).then(res => {
        console.log('Fetched categories:', res.data);
        setDropdowns(prev => ({ ...prev, categories: res.data }));
      });
    }
  }, [form.customer, form.type]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      if (name === 'photos') {
        const newFiles = Array.from(files);
        const combined = [...form.photos, ...newFiles].slice(0, 5);
        setForm(prev => ({ ...prev, photos: combined }));
      } else {
        setForm(prev => ({ ...prev, invoice: files[0] }));
      }
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const err = {};
    ['customer', 'fleet', 'vehicle', 'supplier', 'type', 'category', 'user', 'date', 'mileage', 'cost'].forEach(field => {
      if (!form[field]) err[field] = 'This field is required';
    });
    return err;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'tags' || key === 'parts') {
        data.append(key, JSON.stringify(value));
      } else if (key === 'photos') {
        value.forEach(file => data.append('photos', file));
      } else if (key === 'invoice' && value) {
        data.append('invoice', value);
      } else {
        data.append(key, value);
      }
    });

    onSubmit(data);
  };

  const handleTagAdd = (e) => {
    e.preventDefault();
    if (tagInput.trim()) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const handleTagRemove = (tag) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };




  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Customer */}
      <div>
        <label>Customer</label>
        <select name="customer" value={form.customer} onChange={handleChange} className="input-style">
          <option value="">Select Customer</option>
          {dropdowns.customers.map(c => (
            <option key={c._id} value={c._id}>{c.companyName}</option>
          ))}
        </select>
        <ErrorMessage message={errors.customer} />
      </div>

      {/* Fleet */}
      <div>
        <label>Fleet</label>
        <select name="fleet" value={form.fleet} onChange={handleChange} className="input-style">
          <option value="">Select Fleet</option>
          {dropdowns.fleets.map(f => (
            <option key={f._id} value={f._id}>{f.name}</option>
          ))}
        </select>
        <ErrorMessage message={errors.fleet} />
      </div>

      {/* Vehicle */}
      <div>
        <label>Vehicle</label>
        <select name="vehicle" value={form.vehicle} onChange={handleChange} className="input-style">
          <option value="">Select Vehicle</option>
          {dropdowns.vehicles.map(v => (
            <option key={v._id} value={v._id}>{v.vehicleIdentifier}</option>
          ))}
        </select>
        <ErrorMessage message={errors.vehicle} />
      </div>

      {/* Supplier */}
      <div>
        <label>Supplier</label>
        <select name="supplier" value={form.supplier} onChange={handleChange} className="input-style">
          <option value="">Select Supplier</option>
          {dropdowns.suppliers.map(s => (
            <option key={s._id} value={s._id}>{s.name}</option>
          ))}
        </select>
        <ErrorMessage message={errors.supplier} />
      </div>

      {/* Type */}
      <div>
        <label>Repair or Maintenance</label>
        <select name="type" value={form.type} onChange={handleChange} className="input-style">
          <option value="">Select Type</option>
          <option value="repair">Repair</option>
          <option value="maintenance">Maintenance</option>
        </select>
        <ErrorMessage message={errors.type} />
      </div>

      {/* Category */}
      <div>
        <label>Category</label>
        <select name="category" value={form.category} onChange={handleChange} className="input-style">
          <option value="">Select Category</option>
          {dropdowns.categories
            .filter(c => {
              const catCustomer = c.customer?._id || c.customer;
              return catCustomer === form.customer && c.type === form.type;
            })
            .map(c => (
              <option key={c._id} value={c._id}>{c.categoryEnglish}</option>
            ))}
        </select>
        <ErrorMessage message={errors.category} />
      </div>

      {/* User */}
      <div>
        <label>Driver/User</label>
        <select name="user" value={form.user} onChange={handleChange} className="input-style">
          <option value="">Select User</option>
          {dropdowns.users.map(u => (
            <option key={u._id} value={u._id}>{u.name}</option>
          ))}
        </select>
        <ErrorMessage message={errors.user} />
      </div>

      {/* Date */}
      <div>
        <label>Date</label>
        <input type="date" name="date" value={form.date} onChange={handleChange} className="input-style" />
        <ErrorMessage message={errors.date} />
      </div>

      {/* Mileage */}
      <div>
        <label>Mileage</label>
        <input type="number" name="mileage" value={form.mileage} onChange={handleChange} className="input-style" />
        <ErrorMessage message={errors.mileage} />
      </div>

      {/* Cost */}
      <div>
        <label>Cost</label>
        <input type="number" name="cost" value={form.cost} onChange={handleChange} className="input-style" />
        <ErrorMessage message={errors.cost} />
      </div>

      {/* Description */}
      <div className="md:col-span-2">
        <label>Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} className="input-style" rows={3} />
      </div>

      {/* Taxes */}
      <div>
        <label>Tax Amount</label>
        <input type="number" name="taxes" value={form.taxes} onChange={handleChange} className="input-style" />
      </div>

      {/* Tags */}
      <div className="md:col-span-2">
        <label>Tags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {form.tags.map((tag, i) => (
            <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
              {tag}
              <button type="button" onClick={() => handleTagRemove(tag)} className="text-red-500 font-bold">×</button>
            </span>
          ))}
        </div>
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleTagAdd(e)}
          placeholder="Type and press Enter"
          className="input-style"
        />
      </div>

      {/* Photos Upload */}
      <div className="md:col-span-2">
        <label className="block font-medium mb-2">Photos (up to 5)</label>
        <input
          id="photo-upload"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleChange}
          name="photos"
        />
        <label htmlFor="photo-upload" className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow inline-block">
          Choose Photos
        </label>
        <p className="text-sm mt-2 text-gray-600">{form.photos.length} / 5 images selected</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {form.photos.map((file, idx) => (
            <span key={idx} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
              {file.name}
              <button type="button" onClick={() =>
                setForm(prev => ({
                  ...prev,
                  photos: prev.photos.filter((_, i) => i !== idx)
                }))
              } className="text-red-500 font-bold">×</button>
            </span>
          ))}
        </div>
      </div>

      {/* Invoice Upload */}
      <div className="md:col-span-2">
        <label className="block font-medium mb-2">Invoice (PDF or Image)</label>
        <input
          id="invoice-upload"
          type="file"
          accept=".pdf,image/*"
          className="hidden"
          onChange={handleChange}
          name="invoice"
        />
        <label htmlFor="invoice-upload" className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow inline-block">
          Upload Invoice
        </label>
        {form.invoice && (
          <span className="mt-2 inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
            {form.invoice.name}
            <button type="button" onClick={() => setForm(prev => ({ ...prev, invoice: null }))} className="text-red-500 font-bold">×</button>
          </span>
        )}
      </div>

      {/* Submit */}
      <div className="md:col-span-2 flex justify-end">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow">
          {isEdit ? 'Update Record' : 'Save Record'}
        </button>
      </div>
    </form>
  );
};

export default MaintenanceRepairForm;
