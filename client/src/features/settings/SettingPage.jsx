import { useEffect, useState } from 'react';
import SettingsForm from './components/SettingsForm';
import { getSettings, updateSettings } from '@/services/settingsService';
import BackButton from '@/components/ui/BackButton'; // 👈 import back button

const SettingsPage = () => {
  const [form, setForm] = useState({
    logo: '',
    companyName: '',
    email: '',
    phone: '',
    address: '',
    stripeKey: '',
    mapsKey: '',
    socketKey: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSettings().then((res) => {
      if (res?.data) setForm(res.data);
      setLoading(false);
    });
  }, []);

  const handleSave = async (data) => {
    await updateSettings(data);
    alert('Settings updated successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start py-10 px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-4xl">
        <BackButton className="mb-4" /> 
        <h2 className="text-2xl font-semibold text-blue-800 mb-6">System Settings</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <SettingsForm form={form} setForm={setForm} onSave={handleSave} />
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
