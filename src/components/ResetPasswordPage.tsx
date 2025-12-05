import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline';

import { auth as authService } from '../services/api';

import Logo from './generales/Logo';

import stylesCont from '../styles/LoginForm.module.css';

interface PasswordFieldProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  showPassword: boolean;
  onToggleShow: () => void;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  showPassword,
  onToggleShow,
}) => (
  <div className={stylesCont['fieldContainer']}>
    <label htmlFor={id} className={`${stylesCont['label']} dark:text-gray-300`}>
      {label}
    </label>
    <div className="relative">
      <input
        id={id}
        placeholder={placeholder}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className={`${stylesCont['input']} dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100`}
      />
      <button
        type="button"
        className="absolute inset-y-0 right-3 flex items-center"
        onClick={onToggleShow}
      >
        {showPassword ? (
          <EyeOffIcon className="w-5 h-5 text-gray-500" />
        ) : (
          <EyeIcon className="w-5 h-5 text-gray-500" />
        )}
      </button>
    </div>
  </div>
);

const ResetPasswordForm: React.FC<{
  password: string;
  repeat: string;
  showPass: boolean;
  showRepeat: boolean;
  loading: boolean;
  onPasswordChange: (value: string) => void;
  onRepeatChange: (value: string) => void;
  onToggleShowPass: () => void;
  onToggleShowRepeat: () => void;
  onSubmit: (e: React.FormEvent) => void;
}> = ({
  password,
  repeat,
  showPass,
  showRepeat,
  loading,
  onPasswordChange,
  onRepeatChange,
  onToggleShowPass,
  onToggleShowRepeat,
  onSubmit,
}) => (
  <form onSubmit={onSubmit} className={stylesCont['form']}>
    <div className={stylesCont['fieldsContainer']}>
      <PasswordField
        id="password"
        label="Contraseña"
        placeholder="Contraseña"
        value={password}
        onChange={onPasswordChange}
        showPassword={showPass}
        onToggleShow={onToggleShowPass}
      />
      <PasswordField
        id="repeatPassword"
        label="Repetir Contraseña"
        placeholder="Repetir contraseña"
        value={repeat}
        onChange={onRepeatChange}
        showPassword={showRepeat}
        onToggleShow={onToggleShowRepeat}
      />
    </div>
    <button
      type="submit"
      disabled={loading}
      className="inline-flex w-full justify-center items-center px-3 py-2 sm:px-4 sm:py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg"
    >
      {loading ? 'Actualizando...' : 'Confirmar'}
    </button>
  </form>
);

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
        <ResetPasswordForm
          password={password}
          repeat={repeat}
          showPass={showPass}
          showRepeat={showRepeat}
          loading={loading}
          onPasswordChange={setPassword}
          onRepeatChange={setRepeat}
          onToggleShowPass={() => setShowPass(!showPass)}
          onToggleShowRepeat={() => setShowRepeat(!showRepeat)}
          onSubmit={(e) => {
            void handleSubmit(e);
          }}
        />
      </div>
    </div>
  );
};
export default ResetPasswordPage;
