import { useEffect, useState } from 'react';
import BackButton from '@/components/ui/BackButton';
import EditButton from '@/components/ui/EditButton';
import EditModal from '@/components/ui/EditModal';
import ToggleButton from '@/components/ui/ToggleButton';
import UserForm from './components/UserForm';
import { fetchUsers, createUser, updateUser } from '@/services/userService';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      const res = await fetchUsers();
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (formData) => {
    await createUser(formData);
    setShowForm(false);
    loadUsers();
  };

  const handleUpdate = async (formData) => {
    await updateUser(editingUser._id, formData);
    setEditingUser(null);
    loadUsers();
  };

  const handleToggleStatus = async (user) => {
    try {
      await updateUser(user._id, { ...user, active: !user.active });
      loadUsers();
    } catch (err) {
      console.error('Failed to toggle user status:', err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const formatRoleLabel = (role) => {
    const map = {
      super_admin: 'Super Admin',
      customer_admin: 'Customer Admin',
      customer_user: 'Customer User',
      driver: 'Company Driver',
    };
    return map[role] || role;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow">
        <BackButton className="mb-4" />

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-800">Manage Users</h2>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add User
          </button>
        </div>

        <div className="overflow-x-auto rounded border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Active</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">Loading...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-400">No users found.</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="border-t hover:bg-gray-50 transition">
                    <td className="p-3">{user.firstName} {user.lastName}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{formatRoleLabel(user.role || user.type)}</td>
                    <td className="p-3">{user.customer?.companyName || '—'}</td>
                    <td className="p-3">{user.active ? 'Yes' : 'No'}</td>
                    <td className="p-3 flex gap-2">
                      <EditButton onClick={() => setEditingUser(user)} />
                      <ToggleButton
                        isActive={user.active}
                        onToggle={() => handleToggleStatus(user)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-3xl relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-4 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-blue-700 mb-4">Add New User</h2>
            <UserForm onSubmit={handleAdd} />
          </div>
        </div>
      )}

      {editingUser && (
        <EditModal
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          title="Edit User"
        >
          <UserForm
            initialValues={editingUser}
            isEdit
            onClose={() => setEditingUser(null)}
            onSubmit={handleUpdate}
          />
        </EditModal>
      )}
    </div>
  );
};

export default UsersPage;
