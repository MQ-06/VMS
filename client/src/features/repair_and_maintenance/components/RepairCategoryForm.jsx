import { useState, useEffect } from 'react';
import Select from 'react-select';
import { addRepairCategory, updateRepairCategory } from '@/services/repairCategoryService';
import ErrorMessage from '@/components/ui/ErrorMessage';

const RepairCategoryForm = ({ onSuccess, initialValues = {}, isEdit = false }) => {
  const [form, setForm] = useState({
    customer: '',
    type: 'repair',
    categoryEn: '',
    categoryEs: '',
    supplierTypes: [],
  });

  const [errors, setErrors] = useState({});
  const [customers, setCustomers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const loadCustomers = async () => {
      const res = await fetch('/api/customers');
      const data = await res.json();
      const activeOnly = data.filter((c) => c.active); // ✅ Only active customers
      setCustomers(activeOnly);
    };

    const loadSuppliers = async () => {
      const res = await fetch('/api/suppliers');
      const allSuppliers = await res.json();
      const activeSuppliers = allSuppliers.filter((s) => s.active);
      setSuppliers(activeSuppliers);
    };

    loadCustomers();
    loadSuppliers();
  }, []);

  useEffect(() => {
    if (isEdit && initialValues) {
      setForm({
        ...initialValues,
        customer: initialValues.customer?._id || '',
        supplierTypes: initialValues.supplierTypes?.map((s) => s._id) || [],
      });
    }
  }, [initialValues, isEdit]);

  const validate = () => {
    const newErrors = {};
    if (!form.customer) newErrors.customer = 'Customer is required';
    if (!form.categoryEn) newErrors.categoryEn = 'English name is required';
    if (!form.categoryEs) newErrors.categoryEs = 'Spanish name is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length) {
      setErrors(validation);
      return;
    }

    if (isEdit && initialValues._id) {
      await updateRepairCategory(initialValues._id, form);
    } else {
      await addRepairCategory(form);
    }

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-1 text-black">Customer</label>
          <select
            name="customer"
            value={form.customer}
            onChange={handleChange}
            className="input-style"
          >
            <option value="">Select Customer</option>
            {customers.map((c) => (
              <option key={c._id} value={c._id}>
                {c.companyName}
              </option>
            ))}
          </select>
          {errors.customer && <ErrorMessage message={errors.customer} />}
        </div>

        <div>
          <label className="block mb-1 text-black">Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="input-style"
          >
            <option value="repair">Repair</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-black">Category (English)</label>
          <input
            name="categoryEn"
            value={form.categoryEn}
            onChange={handleChange}
            placeholder="Category English"
            className="input-style"
          />
          {errors.categoryEn && <ErrorMessage message={errors.categoryEn} />}
        </div>

        <div>
          <label className="block mb-1 text-black">Category (Spanish)</label>
          <input
            name="categoryEs"
            value={form.categoryEs}
            onChange={handleChange}
            placeholder="Category Spanish"
            className="input-style"
          />
          {errors.categoryEs && <ErrorMessage message={errors.categoryEs} />}
        </div>
      </div>

      <div>
        <label className="block mb-1 text-black">Supplier Types</label>
        <Select
          isMulti
          name="supplierTypes"
          options={suppliers.map((s) => ({ value: s._id, label: s.type }))}
          value={suppliers
            .filter((s) => form.supplierTypes.includes(s._id))
            .map((s) => ({ value: s._id, label: s.type }))}
          onChange={(selectedOptions) =>
            setForm((prev) => ({
              ...prev,
              supplierTypes: selectedOptions.map((opt) => opt.value),
            }))
          }
        />
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          className="bg-primary text-white px-6 py-2 rounded hover:brightness-105 transition"
        >
          {isEdit ? 'Update Category' : 'Save Category'}
        </button>
      </div>
    </form>
  );
};

export default RepairCategoryForm;
