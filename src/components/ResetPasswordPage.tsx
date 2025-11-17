import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline';

import { auth as authService } from '../services/api';

import Logo from './generales/Logo';

import stylesCont from '../styles/LoginForm.module.css';

const ResetPasswordPage: React.FC = () => {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [repeat, setRepeat] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error('Token inválido');
      navigate('/login');
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== repeat) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    const strong = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!strong.test(password)) {
      toast.error('La contraseña debe tener al menos 6 caracteres, una mayúscula y un número');
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword({ token, password });
      toast.success('Contraseña actualizada');
      navigate('/login');
    } catch (error) {
      console.error(error);
      toast.error('No se pudo actualizar la contraseña');
    }
    setLoading(false);
  };

  return (
    <div className={`${stylesCont['container']} bg-gray-50 dark:bg-gray-900`}>
      <div
        className={`${stylesCont['formContainer']} bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 rounded shadow text-gray-800 dark:text-gray-100`}
      >
        <div className="flex justify-center mb-2">
          <Logo width={150} height={40} />
        </div>
        <h2 className="text-xl font-medium text-gray-700 dark:text-gray-100 text-center mb-6">
          Nueva contraseña
        </h2>
        <form
          onSubmit={(e) => {
            void handleSubmit(e);
          }}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                placeholder="Contraseña"
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`${stylesCont['input']} mt-1 dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? (
                  <EyeOffIcon className="w-5 h-5 text-gray-500" />
                ) : (
                  <EyeIcon className="w-5 h-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label
              htmlFor="repeatPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Repetir Contraseña
            </label>
            <div className="relative">
              <input
                id="repeatPassword"
                placeholder="Repetir contraseña"
                type={showRepeat ? 'text' : 'password'}
                value={repeat}
                onChange={(e) => setRepeat(e.target.value)}
                required
                className={`${stylesCont['input']} mt-1 dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={() => setShowRepeat(!showRepeat)}
              >
                {showRepeat ? (
                  <EyeOffIcon className="w-5 h-5 text-gray-500" />
                ) : (
                  <EyeIcon className="w-5 h-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full justify-center items-center px-3 py-2 sm:px-4 sm:py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {loading ? 'Actualizando...' : 'Confirmar'}
          </button>
        </form>
      </div>
    </div>
  );
};
export default ResetPasswordPage;
