import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { auth as authService } from '../services/api';
import stylesCont from '../styles/LoginForm.module.css';
import Logo from './generales/Logo';

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'pending'|'success'|'error'>('pending');
  const [message, setMessage] = useState('Verificando tu correo…');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Token no proporcionado');
        return;
      }
      try {
        const { message } = await authService.verifyEmail(token);
        setStatus('success');
        setMessage(message || '¡Correo verificado con éxito!');
      } catch (err: any) {
        const msg = err.response?.data?.error || 'Error al verificar el correo';
        setStatus('error');
        setMessage(msg);
      }
    };
    verify();
  }, [token]);

  return (
    <div className={stylesCont.container}>
      <div className={`${stylesCont.formContainer} bg-white p-8 rounded shadow text-center`}>
        <div className="flex justify-center mb-2"><Logo width={150} height={40} /></div>
        {status === 'pending' && (
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4" />
        )}
        <h2 className="text-xl font-medium text-gray-600 mb-4">{message}</h2>
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