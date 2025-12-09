import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { auth as authService } from '../services/api';

import Logo from './generales/Logo';

import stylesCont from '../styles/LoginForm.module.css';

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [message, setMessage] = useState('Verificando tu correo…');
  const [seconds, setSeconds] = useState(3);

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Token no proporcionado');
        return;
      }
      try {
        await authService.verifyEmail(token);
        setStatus('success');
        setMessage('¡Cuenta verificada con éxito!');
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
          'Error al verificar el correo';
        setStatus('error');
        setMessage(msg);
      }
    };
    void verify();
  }, [token]);

  useEffect(() => {
    if (status !== 'success') return;
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
      window.location.href = '/login';
          return 0;
    }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [status]);

  return (
    <div className={`${stylesCont['container']} bg-gray-50 dark:bg-gray-900`}>
      <div
        className={`${stylesCont['formContainer']} bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 rounded shadow text-center text-gray-800 dark:text-gray-100`}
      >
        <div className="flex justify-center mb-2">
          <Logo width={150} height={40} />
        </div>
        {status === 'pending' && (
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4" />
        )}
        <h2 className="text-xl font-medium text-gray-700 dark:text-gray-100 mb-4">{message}</h2>
        {status === 'success' && (
          <p className="text-sm text-gray-500 dark:text-gray-400">Redirigiendo en {seconds}…</p>
        )}
        {status !== 'pending' && (
          <Link
            to="/login"
            className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Ir al login
          </Link>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
