import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LoginCredentials, 
  LoginFormProps, 
  LoginFieldProps,
  LOGIN_CONFIG 
} from '../../types/enums';
import { createFormHandler } from '../../utils/formUtils';
import Logo from '../generales/Logo';
import styles from '../../styles/LoginForm.module.css';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline';

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: ''
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
    <div className={styles.container}>
      <div className={`${styles.formContainer} bg-white p-8 rounded shadow`}>
        <LoginHeader />
        <LoginFormComponent
          credentials={credentials}
          onSubmit={handleSubmit}
          onChange={handleChange}
          showPass={showPass}
          setShowPass={setShowPass}
        />
      </div>
    </div>
  );
};

const LoginHeader: React.FC = () => (
  <div className={styles.logoContainer}>
    <Logo width={250} height={40} className={styles.logo} />
  </div>
);

interface LoginFormComponentProps {
  credentials: LoginCredentials;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPass: boolean;
  setShowPass: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginFormComponent: React.FC<LoginFormComponentProps> = ({
  credentials,
  onSubmit,
  onChange,
  showPass,
  setShowPass
}) => {
  const navigate = useNavigate();
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.fieldsContainer}>
        <LoginFields credentials={credentials} onChange={onChange} showPass={showPass} setShowPass={setShowPass} />
      </div>
      <SubmitButton />
      <hr />
      <p className="text-center">¿Todavía no tenés cuenta? <Link to="/registro" className={styles.switchLink}>Registrate</Link></p>
      <div className="mt-2 text-sm flex flex-row justify-between">
        <button type="button" className="text-blue-900 w-1/2 hover:underline" onClick={() => navigate('/forgot-password')}>¿Olvidaste tu contraseña?</button>
        <div className="border-l border-gray-400 h-10 mx-4" />
        <button type="button" className="text-blue-900 w-1/2 hover:underline" onClick={() => navigate('/resend-verification')}>Reenviar correo de verificación</button>
      </div>
    </form>
  );
};

interface LoginFieldsProps {
  credentials: LoginCredentials;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPass: boolean;
  setShowPass: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginFields: React.FC<LoginFieldsProps> = ({ credentials, onChange, showPass, setShowPass }) => (
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

type ExtendedLoginFieldProps = LoginFieldProps & { showPass:boolean; setShowPass:React.Dispatch<React.SetStateAction<boolean>> };

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
  setShowPass
}) => (
  <div className={styles.fieldContainer}>
    <label htmlFor={id} className={styles.label}>
      {label}
    </label>
    <div className="relative">
      <input
        id={id}
        name={name}
        type={type === 'password' && showPass ? 'text' : type}
        required={required}
        className={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
      />
      {type === 'password' && (
        <button type="button" className="absolute inset-y-0 right-3 flex items-center" onClick={() => setShowPass(!showPass)}>
          {showPass ? <EyeOffIcon className="w-5 h-5 text-gray-500" /> : <EyeIcon className="w-5 h-5 text-gray-500" />}
        </button>
      )}
    </div>
  </div>
);

const SubmitButton: React.FC = () => (
  <div>
    <button type="submit" className={styles.submitButton}>
      {LOGIN_CONFIG.SUBMIT_TEXT}
    </button>
  </div>
);

export default LoginForm; 