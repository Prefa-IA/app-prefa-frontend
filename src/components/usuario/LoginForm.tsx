import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline';

import { useAuth } from '../../contexts/AuthContext';
import {
  ExtendedLoginFieldProps,
  LoginFieldsProps,
  LoginFormComponentProps,
} from '../../types/components';
import { LOGIN_CONFIG, LoginCredentials, LoginFormProps } from '../../types/enums';
import { createFormHandler } from '../../utils/form-utils';
import SEO from '../SEO';

import GoogleLoginButton from './GoogleLoginButton';

import styles from '../../styles/LoginForm.module.css';

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (onSubmit) {
        onSubmit(credentials);
      } else {
        await login(credentials);
        navigate('/consultar');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = createFormHandler(setCredentials);

  return (
    <>
      <SEO
        title="Iniciar Sesión | PREFA-IA"
        description="Accede a tu cuenta de PREFA-IA para generar prefactibilidades urbanísticas en CABA. Sistema de análisis de terrenos y código urbanístico."
        url="/login"
        noindex={true}
      />
      <div
        className={`${styles['container']} min-h-screen flex justify-center items-center w-full`}
      >
        <div
          className={`${styles['formContainer']} bg-white dark:bg-gray-800 p-4 sm:p-8 rounded shadow`}
        >
          <LoginFormComponent
            credentials={credentials}
            onSubmit={(e) => {
              void handleSubmit(e);
            }}
            onChange={handleChange}
            showPass={showPass}
            setShowPass={setShowPass}
          />
        </div>
      </div>
    </>
  );
};

const LoginFormComponent: React.FC<LoginFormComponentProps> = ({
  credentials,
  onSubmit,
  onChange,
  showPass,
  setShowPass,
}) => {
  const navigate = useNavigate();
  return (
    <form
      className={styles['form']}
      onSubmit={(e) => {
        void onSubmit(e);
      }}
    >
      <div className={styles['fieldsContainer']}>
        <LoginFields
          credentials={credentials}
          onChange={onChange}
          showPass={showPass}
          setShowPass={setShowPass}
        />
      </div>
      <SubmitButton />
      <div className="my-0.5 flex items-center">
        <div className="flex-grow border-t border-gray-300 dark:border-gray-700" />
        <span className="px-3 text-xs text-gray-500">o</span>
        <div className="flex-grow border-t border-gray-300 dark:border-gray-700" />
      </div>
      <GoogleLoginButton className="flex justify-center" onSuccessNavigate="/consultar" />
      <p className="text-center text-gray-900 dark:text-gray-100 mt-4">
        ¿Todavía no tenés cuenta?{' '}
        <Link to="/registro" className="text-primary-600 dark:text-primary-400 hover:underline">
          Registrate
        </Link>
      </p>
      <div className="mt-2 text-sm flex flex-row justify-between">
        <button
          type="button"
          className="text-primary-600 dark:text-primary-400 w-1/2 hover:underline"
          onClick={() => navigate('/forgot-password')}
        >
          ¿Olvidaste tu contraseña?
        </button>
        <div className="border-l border-gray-400 h-10 mx-4" />
        <button
          type="button"
          className="text-primary-600 dark:text-primary-400 w-1/2 hover:underline"
          onClick={() => navigate('/resend-verification')}
        >
          Reenviar correo de verificación
        </button>
      </div>
    </form>
  );
};

const LoginFields: React.FC<LoginFieldsProps> = ({
  credentials,
  onChange,
  showPass,
  setShowPass,
}) => (
  <>
    {LOGIN_CONFIG.FIELDS.map((field) => (
      <LoginField
        key={field.id}
        {...field}
        value={credentials[field.name]}
        onChange={onChange}
        showPass={showPass}
        setShowPass={setShowPass}
      />
    ))}
  </>
);

const LoginField: React.FC<ExtendedLoginFieldProps> = ({
  id,
  name,
  type,
  label,
  placeholder,
  value,
  onChange,
  autoComplete,
  required = false,
  showPass,
  setShowPass,
}) => (
  <div className={styles['fieldContainer']}>
    <label htmlFor={id} className={`${styles['label']} dark:text-gray-300`}>
      {label}
    </label>
    <div className="relative">
      <input
        id={id}
        name={name}
        type={type === 'password' && showPass ? 'text' : type}
        required={required}
        className={`${styles['input']} dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
      />
      {type === 'password' && (
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
      )}
    </div>
  </div>
);

const SubmitButton: React.FC = () => (
  <div>
    <button
      type="submit"
      className="inline-flex w-full justify-center items-center px-3 py-2 sm:px-4 sm:py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 shadow-md hover:shadow-lg"
    >
      {LOGIN_CONFIG.SUBMIT_TEXT}
    </button>
  </div>
);

export default LoginForm;
