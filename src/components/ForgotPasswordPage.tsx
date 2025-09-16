import React, { useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/outline';
import { auth as authService } from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Logo from './generales/Logo';
import stylesBtn from '../styles/LoginForm.module.css';
import stylesCont from '../styles/LoginForm.module.css';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      toast.success('Te enviamos un correo con las instrucciones para restablecer tu contraseña');
      navigate('/login');
    } catch (error) {
      console.error(error);
      toast.error('No se pudo enviar el email. Verifica el correo ingresado');
    }
    setLoading(false);
  };

  return (
    <div className={stylesCont.container}>
      <div className={`${stylesCont.formContainer} bg-white p-8 rounded shadow`}>
        <button type="button" onClick={()=>navigate('/login')} className="text-gray-500 hover:text-gray-700 flex items-center mb-4">
          <ArrowLeftIcon className="w-5 h-5 mr-1" />
        </button>
        <div className="flex justify-center mb-2"><Logo width={250} height={40} /></div>
        <p className="text-center text-lg font-bold mb-4">Ingresá tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              placeholder='Correo@ejemplo.com'
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`${stylesBtn.submitButton} disabled:opacity-50`}
          >
            {loading ? 'Enviando...' : 'Enviar correo'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage; 