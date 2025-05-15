import React, { useEffect, useState } from 'react';
import CustomerForm from './components/CustomerForm';
import Button from '@/components/ui/Button';
import BackButton from '@/components/ui/BackButton';
import EditModal from '@/components/ui/EditModal';
import EditButton from '@/components/ui/EditButton';
import ToggleButton from '@/components/ui/ToggleButton';
import {
  fetchCustomers as fetchCustomersAPI,
  updateCustomerStatus
} from '@/services/customerService';

const CustomersPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = () => {
    setLoading(true);
    fetchCustomersAPI()
      .then(res => {
        const data = res.data;
        if (Array.isArray(data)) {
          setCustomers(data);
        } else if (Array.isArray(data.customers)) {
          setCustomers(data.customers);
        } else {
          console.error('Unexpected format from /api/customers:', data);
          setCustomers([]);
        }
      })
      .catch(err => {
        console.error("Failed to fetch customers", err);
        setCustomers([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <BackButton />

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-800">Manage Customers</h1>
        <Button onClick={() => setShowForm(true)}>Add Customer</Button>
      </div>

      <div className="overflow-x-auto rounded shadow-sm border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="p-3 text-left">Company Name</th>
              <th className="p-3 text-left">Contact Person</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Vehicles</th>
              <th className="p-3 text-left">Current Plan</th>
              <th className="p-3 text-left">Next Renewal</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="p-4 text-center">Loading...</td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-4 text-center text-gray-500">No customers found.</td>
              </tr>
            ) : (
              customers.map(customer => (
                <tr key={customer._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{customer.companyName}</td>
                  <td className="p-3">{customer.contactPerson}</td>
                  <td className="p-3">{customer.email}</td>
                  <td className="p-3">{customer.phone}</td>
                  <td className="p-3 text-center">{customer.vehiclesRegistered}</td>
                  <td className="p-3">{customer.currentPlan?.name_en || '—'}</td>
                  <td className="p-3">
                    {customer.nextRenewalDate
                      ? new Date(customer.nextRenewalDate).toLocaleDateString()
                      : '—'}
                  </td>
                  <td className="p-3 flex gap-2">
                    <EditButton onClick={() => setEditingCustomer(customer)} />
                    <ToggleButton
                      isActive={customer.active}
                      onToggle={async () => {
                        try {
                          await updateCustomerStatus(customer._id);
                          fetchCustomers();
                        } catch (error) {
                          console.error('Failed to toggle status:', error);
                        }
                      }}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Add New Customer</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-600 text-2xl font-bold hover:text-gray-800"
              >
                ×
              </button>
            </div>
            <CustomerForm onClose={() => {
              setShowForm(false);
              fetchCustomers();
            }} />
          </div>
        </div>
      )}

      {editingCustomer && (
        <EditModal
          isOpen={!!editingCustomer}
          onClose={() => setEditingCustomer(null)}
          title="Edit Customer"
        >
          <CustomerForm
            initialValues={editingCustomer}
            isEdit
            onClose={() => {
              setEditingCustomer(null);
              fetchCustomers();
            }}
          />
        </EditModal>
      )}
    </div>
  );
};

export default CustomersPage;