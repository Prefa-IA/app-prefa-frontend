import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeftIcon } from '@heroicons/react/outline';

import { auth as authService } from '../services/api';

import stylesCont from '../styles/LoginForm.module.css';

const ResendVerificationPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await authService.resendVerification(email);
      toast.success('Se envió un nuevo email para verificar tu cuenta');
      navigate('/login');
    } catch (error: unknown) {
      console.error(error);
      const errorMessage =
        (error as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        'No se pudo enviar el correo de verificación';
      toast.error(errorMessage);
    }
    setLoading(false);
  };

  return (
    <div
      className={`${stylesCont['container']} min-h-screen pt-[90px] flex justify-center items-center w-full`}
    >
      <div
        className={`${stylesCont['formContainer']} bg-white dark:bg-gray-800 p-4 sm:p-8 rounded shadow w-full sm:w-auto`}
      >
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="text-gray-500 hover:text-gray-700 flex items-center mb-4"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-1" />
        </button>
        <p className="text-center text-md font-bold mb-4 text-gray-900 dark:text-gray-100">
          Para activar tu cuenta, ingresá tu correo electrónico y te reenviaremos el mail de
          verificación.
        </p>
        <form
          onSubmit={(e) => {
            void handleSubmit(e);
          }}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              placeholder="Correo@ejemplo.com"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${stylesCont['input']} mt-1 dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100`}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full justify-center items-center px-3 py-2 sm:px-4 sm:py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {loading ? 'Enviando...' : 'Reenviar correo'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResendVerificationPage;
