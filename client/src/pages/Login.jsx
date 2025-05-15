import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

import Button from '../components/ui/Button';
import ErrorMessage from '../components/ui/ErrorMessage';
import { login } from '../services/api';
import { useTranslation } from '@/context/TranslationContext';

const Login = () => {
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    // Hardcoded admin check
    if (email === 'admin@admin.com' && password === '987654321@#') {
      localStorage.setItem('token', 'fake-admin-token');
      localStorage.setItem('role', 'admin');
  
      navigate('/admin/dashboard');
      return;
    }
  
    // Optional: display error for incorrect hardcoded credentials
    setError('Invalid email or password');
  };
  

  return (
    <div className="min-h-screen bg-light flex items-center justify-center p-4 font-body">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <h2 className="text-3xl font-heading font-bold text-center text-blue1 mb-6">
          {t('login_title') || 'Login'}
        </h2>

        {error && (
          <div className="mb-4">
            <ErrorMessage message={error} />
          </div>
        )}

        <div className="mb-4">
          <input
            type="email"
            required
            className="w-full p-3 border border-blue3 rounded text-black focus:outline-none focus:ring-1 focus:ring-primary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('email_label') || 'Email address'}
          />
        </div>

        <div className="mb-4 relative">
          <input
            type={showPassword ? 'text' : 'password'}
            required
            className="w-full p-3 border border-blue3 rounded text-black focus:outline-none focus:ring-1 focus:ring-primary pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('password_label') || 'Password'}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
          </button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            className="text-sm text-primary border border-primary px-4 py-1 rounded-full hover:bg-primary hover:text-white transition"
          >
            {t('subscribe_button') || 'Subscribe'}
          </button>

          <button
            type="button"
            className="text-sm text-primary hover:underline focus:outline-none"
          >
            {t('forgot_password') || 'Forgot password?'}
          </button>
        </div>

        <Button
          type="submit"
          className="w-full bg-blue5 text-white font-semibold py-2 rounded shadow hover:scale-105 transform transition-transform duration-200"
        >
          {t('submit_button') || 'Continue'}
        </Button>
      </form>
    </div>
  );
};

export default Login;
