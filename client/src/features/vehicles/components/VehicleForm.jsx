import { useEffect, useState } from 'react';
import { fetchCustomers } from '@/services/customerService';
import { fetchFleetsByCustomer } from '@/services/fleetService';
import ErrorMessage from '@/components/ui/ErrorMessage';

const VehicleForm = ({ onSubmit, initialValues = {}, isEdit = false, onClose }) => {
  const [form, setForm] = useState({
    customer: '',
    fleet: '',
    name: '',
    vin: '',
    licensePlate: '',
    brand: '',
    color: '',
    year: '',
    mileage: '',
    purchaseDate: '',
    cost: '',
    ownership: '',
    amountPaid: '',
    monthlyPayment: '',
    paymentDay: '',
    finalPaymentDate: '',
    notes: '',
    labels: []
  });

  const [customers, setCustomers] = useState([]);
  const [fleets, setFleets] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCustomers()
      .then(res => setCustomers(res.data.filter(c => c.active)))
      .catch(() => setCustomers([]));
  }, []);

  useEffect(() => {
    if (isEdit && initialValues) {
      const filledForm = {
        customer: initialValues.customer?._id || initialValues.customer || '',
        fleet: initialValues.fleet?._id || initialValues.fleet || '',
        name: initialValues.name || '',
        vin: initialValues.vin || '',
        licensePlate: initialValues.licensePlate || '',
        brand: initialValues.brand || '',
        color: initialValues.color || '',
        year: initialValues.year || '',
        mileage: initialValues.mileage || '',
        purchaseDate: initialValues.purchaseDate?.split('T')[0] || '',
        cost: initialValues.cost || '',
        ownership: initialValues.ownership || '',
        amountPaid: initialValues.amountPaid || '',
        monthlyPayment: initialValues.monthlyPayment || '',
        paymentDay: initialValues.paymentDay || '',
        finalPaymentDate: initialValues.finalPaymentDate?.split('T')[0] || '',
        notes: initialValues.notes || '',
        labels: initialValues.labels || []
      };
      setForm(filledForm);
      if (filledForm.customer) {
        fetchFleetsByCustomer(filledForm.customer)
          .then(res => setFleets(res.data.filter(f => f.active)))
          .catch(() => setFleets([]));
      }
    }
  }, [initialValues, isEdit]);

  useEffect(() => {
    return () => {
      photos.forEach(file => file.preview && URL.revokeObjectURL(file.preview));
    };
  }, [photos]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'customer') {
      setForm(prev => ({ ...prev, customer: value, fleet: '' }));
      setFleets([]);
      if (value) {
        fetchFleetsByCustomer(value)
          .then(res => setFleets(res.data.filter(f => f.active)))
          .catch(() => setFleets([]));
      }
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }

    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.customer) newErrors.customer = 'Customer is required';
    if (!form.fleet) newErrors.fleet = 'Fleet is required';
    if (!form.name.trim()) newErrors.name = 'Vehicle name is required';
    if (!form.vin.trim()) newErrors.vin = 'VIN number is required';
    if (!form.licensePlate.trim()) newErrors.licensePlate = 'License Plate is required';
    if (!form.brand.trim()) newErrors.brand = 'Brand is required';
    if (!form.year) newErrors.year = 'Year is required';
    if (!form.ownership) newErrors.ownership = 'Ownership is required';
    return newErrors;
  };

  const handlePhotoChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const totalFiles = [...photos, ...selectedFiles].slice(0, 5);
    const withPreview = totalFiles.map(file =>
      file.preview ? file : Object.assign(file, { preview: URL.createObjectURL(file) })
    );
    setPhotos(withPreview);
  };

  const handleDocumentChange = (e, index) => {
    const updated = [...documents];
    updated[index] = { ...updated[index], file: e.target.files[0] };
    setDocuments(updated);
  };

  const handleDocumentLabelChange = (e, index) => {
    const updated = [...documents];
    updated[index] = { ...updated[index], label: e.target.value };
    setDocuments(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    photos.forEach(photo => formData.append('photos', photo));
    documents.forEach(doc => {
      if (doc?.file) formData.append('documents', doc.file);
      formData.append('labels', doc.label || '');
    });

    onSubmit(formData);
  };

  const inputClass = (field) =>
    `p-3 border rounded focus:ring-2 focus:ring-blue-400 outline-none ${
      errors[field] ? 'border-red-500' : 'border-gray-300'
    }`;

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <h3 className="text-lg font-semibold mb-6 text-blue-600">
        {isEdit ? 'Update Vehicle' : 'Add New Vehicle'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-1 font-medium">Customer</label>
          <select
            name="customer"
            value={form.customer}
            onChange={handleChange}
            className={inputClass('customer')}
          >
            <option value="">Select Customer</option>
            {customers.map(c => (
              <option key={c._id} value={c._id}>{c.companyName}</option>
            ))}
          </select>
          <ErrorMessage message={errors.customer} />
        </div>

        <div>
          <label className="block mb-1 font-medium">Fleet</label>
          <select
            name="fleet"
            value={form.fleet}
            onChange={handleChange}
            className={inputClass('fleet')}
            disabled={!form.customer}
          >
            <option value="">Select Fleet</option>
            {fleets.map(f => (
              <option key={f._id} value={f._id}>{f.name}</option>
            ))}
          </select>
          <ErrorMessage message={errors.fleet} />
        </div>

        {[
          'name', 'vin', 'licensePlate', 'brand', 'color',
          'year', 'mileage', 'purchaseDate', 'cost'
        ].map(field => (
          <div key={field}>
            <label className="block mb-1 font-medium">{field.replace(/([A-Z])/g, ' $1')}</label>
            <input
              name={field}
              value={form[field]}
              onChange={handleChange}
              type={field.includes('Date') ? 'date' : ['year', 'mileage', 'cost'].includes(field) ? 'number' : 'text'}
              className={inputClass(field)}
            />
            <ErrorMessage message={errors[field]} />
          </div>
        ))}

        <div>
          <label className="block mb-1 font-medium">Ownership</label>
          <select
            name="ownership"
            value={form.ownership}
            onChange={handleChange}
            className={inputClass('ownership')}
          >
            <option value="">Select Ownership</option>
            <option value="fully_paid">Fully Paid</option>
            <option value="lease">Lease</option>
            <option value="financed">Financed</option>
          </select>
          <ErrorMessage message={errors.ownership} />
        </div>

        {(form.ownership === 'lease' || form.ownership === 'financed') &&
          ['amountPaid', 'monthlyPayment', 'paymentDay', 'finalPaymentDate'].map(field => (
            <div key={field}>
              <label className="block mb-1 font-medium">{field.replace(/([A-Z])/g, ' $1')}</label>
              <input
                name={field}
                value={form[field]}
                onChange={handleChange}
                type={field.includes('Date') ? 'date' : 'text'}
                className={inputClass(field)}
              />
            </div>
          ))
        }

        <div className="md:col-span-2">
          <label className="block mb-1 font-medium">Notes</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            className={`${inputClass('notes')} w-full`}
          ></textarea>
        </div>

        <div className="md:col-span-2">
          <label className="block mb-1 font-medium">Upload Photos (max 5)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handlePhotoChange}
            className="file:bg-blue-600 file:text-white file:rounded file:px-4 file:py-2 file:border-0 text-gray-600"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block mb-1 font-medium">Upload Documents</label>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                type="file"
                className="file:bg-blue-600 file:text-white file:rounded file:px-4 file:py-2 file:border-0 text-gray-600"
                onChange={(e) => handleDocumentChange(e, i)}
              />
              <input
                type="text"
                placeholder="Label"
                className="p-2 border border-gray-300 rounded"
                onChange={(e) => handleDocumentLabelChange(e, i)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="text-right mt-6">
        <button
          type="submit"
          className="bg-primary text-white px-6 py-2 rounded hover:brightness-105"
        >
          {isEdit ? 'Update Vehicle' : 'Save Vehicle'}
        </button>
      </div>
    </form>
  );
};

export default VehicleForm;
