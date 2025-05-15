import { useEffect, useState } from 'react';
import { fetchTranslations } from '@/services/translationService';
import AddTranslationForm from './components/AddTranslationForm';
import { FaLanguage } from 'react-icons/fa';
import BackButton from '@/components/ui/BackButton';

const TranslationList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const loadTranslations = async () => {
    try {
      const res = await fetchTranslations();
      setData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching translations:', err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTranslations();
  }, []);

  const handleSuccess = () => {
    loadTranslations();
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-white text-black p-4">
      {/* ✅ Modal on Top */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-10 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-4 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>
            <AddTranslationForm onSuccess={handleSuccess} />
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow-xl border border-blue-100">
        <BackButton className="mb-4" />

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-blue1 flex items-center gap-2">
            <FaLanguage className="text-primary" />
            Translations
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary text-white px-4 py-2 rounded shadow hover:brightness-105"
          >
            Add Translation
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading translations...</p>
        ) : (
          <div className="overflow-x-auto rounded shadow-md">
            <table className="w-full bg-white text-sm rounded border border-gray-200">
              <thead className="bg-blue-900 text-white text-lg">
                <tr>
                  <th className="p-3 text-left">Key</th>
                  <th className="p-3 text-left">English</th>
                  <th className="p-3 text-left">Spanish</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((t) => (
                    <tr key={t._id} className="border-t border-gray-200 hover:bg-gray-50 transition">
                      <td className="p-3">{t.key}</td>
                      <td className="p-3">{t.en}</td>
                      <td className="p-3">{t.es}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="p-4 text-center text-gray-400">
                      No translations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranslationList;
