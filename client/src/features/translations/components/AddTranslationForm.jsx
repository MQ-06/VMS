import { useState } from 'react';
import { addTranslation } from '../../../services/translationService';
import ErrorMessage from '../../../components/ui/ErrorMessage';

const AddTranslationForm = ({ onSuccess }) => {
  const [key, setKey] = useState('');
  const [en, setEn] = useState('');
  const [es, setEs] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};
    if (!key.trim()) newErrors.key = 'Key is required';
    if (!en.trim()) newErrors.en = 'English translation is required';
    if (!es.trim()) newErrors.es = 'Spanish translation is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await addTranslation({ key: key.toLowerCase(), en, es });
      alert('Translation added!');
      setKey('');
      setEn('');
      setEs('');
      onSuccess();
    } catch (err) {
      alert('Failed to add translation');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 ">
      <h3 className="text-lg font-semibold mb-6 text-blue-600">Add New Translation</h3>

      <div className="flex flex-col gap-4">
        <div>
          <input
            type="text"
            placeholder="Key (lowercase)"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="input-style"
          />
          <ErrorMessage message={errors.key} />
        </div>

        <div>
          <input
            type="text"
            placeholder="English"
            value={en}
            onChange={(e) => setEn(e.target.value)}
            className="input-style"
          />
          <ErrorMessage message={errors.en} />
        </div>

        <div>
          <input
            type="text"
            placeholder="Spanish"
            value={es}
            onChange={(e) => setEs(e.target.value)}
            className="input-style"
          />
          <ErrorMessage message={errors.es} />
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 bg-primary text-white px-6 py-2 rounded hover:brightness-105 transition"
      >
        Add Translation
      </button>
    </form>
  );
};

export default AddTranslationForm;
