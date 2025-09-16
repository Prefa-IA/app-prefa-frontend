import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { RegistroData } from '../../types/enums';
import type { RegistrationFormProps, FormFieldsProps, FormFieldProps } from '../../types/enums';
import { createFormHandler } from '../../utils/formUtils';
import { REGISTRATION_FORM_FIELDS } from '../../utils/formConfigUtils';
import styles from '../../styles/RegistroForm.module.css';
import Logo from '../generales/Logo';
import { toast } from 'react-toastify';
import { InputType } from '../../types/enums';
import { EyeIcon, EyeOffIcon, ArrowLeftIcon } from '@heroicons/react/outline';
import TermsAndConditions from './TermsAndConditions';

const RegistroForm: React.FC = () => {
  const navigate = useNavigate();
  const { registro } = useAuth();
  const [datos, setDatos] = useState<RegistroData>({
    email: '',
    password: '',
    repeatPassword: '',
    nombre: '',
    acceptedTerms: false
  });
  const [showPass,setShowPass]=useState(false);

  const [aceptoTyC, setAceptoTyC] = useState(false);
  const [mostrarTyC, setMostrarTyC] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(datos.password!==datos.repeatPassword){toast.error('Las contraseñas no coinciden');return;}
    const strong=/^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if(!strong.test(datos.password)){toast.error('La contraseña debe tener al menos 6 caracteres, una mayúscula y un número');return;}
    try {
      const {repeatPassword, ...send}=datos;
      await registro({ ...send, acceptedTerms: aceptoTyC });
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = createFormHandler(setDatos);

  const toggleTyC = () => setAceptoTyC(prev => !prev);

  const openModal = () => setMostrarTyC(true);
  const closeModal = () => setMostrarTyC(false);

  return (
    <div className={styles.container}>
      <div className={`${styles.formContainer} bg-white p-8 rounded shadow`}>
        <button type="button" onClick={() => navigate('/login')} className="text-gray-500 hover:text-gray-700 flex items-center mb-4">
          <ArrowLeftIcon className="w-5 h-5 mr-1" />
        </button>
        <FormHeader />
        <RegistrationForm
          datos={datos}
          onSubmit={handleSubmit}
          onChange={handleChange}
          aceptoTyC={aceptoTyC}
          onToggleTyC={toggleTyC}
          onOpenTyC={openModal}
          showPass={showPass}
          setShowPass={setShowPass}
        />
        {mostrarTyC && <TermsModal onClose={closeModal} />}
      </div>
    </div>
  );
};

const FormHeader: React.FC = () => (
  <div className="flex justify-center mb-2">
    <Logo width={150} height={20} />
  </div>
);

const RegistrationForm: React.FC<RegistrationFormProps & { aceptoTyC: boolean; onToggleTyC: () => void; onOpenTyC: () => void; showPass:boolean; setShowPass:React.Dispatch<React.SetStateAction<boolean>> }> = ({
  datos,
  onSubmit,
  onChange,
  aceptoTyC,
  onToggleTyC,
  onOpenTyC,
  showPass,
  setShowPass
}) => (
  <form className={styles.form} onSubmit={onSubmit}>
    <div className={styles.inputGroup}>
      <FormFields datos={datos} onChange={onChange} showPass={showPass} setShowPass={setShowPass}/>
    </div>
    {/* Aceptación TyC */}
    <div className="flex items-center text-sm">
      <input
        id="aceptoTyC"
        type="checkbox"
        checked={aceptoTyC}
        onChange={onToggleTyC}
        className="mr-2"
      />
      <label htmlFor="aceptoTyC" className="">
        Acepto los{' '}
        <button type="button" className="text-blue-600 underline" onClick={onOpenTyC}>
          Términos y Condiciones
        </button>
      </label>
    </div>
    <SubmitButton disabled={!aceptoTyC} />
    <hr />
    <p className="text-center">¿Ya tenés cuenta? <Link to="/login" className={styles.switchLink}>Ingresá</Link></p>
  </form>
);

const FormFields: React.FC<FormFieldsProps> = ({ datos, onChange,showPass,setShowPass }) => (
  <>
    {REGISTRATION_FORM_FIELDS.map((field) => (
      <FormField
        key={field.id}
        field={field}
        value={datos[field.name] as string}
        onChange={onChange}
        showPass={showPass}
        setShowPass={setShowPass}
      />
    ))}
  </>
);

const FormField: React.FC<FormFieldProps> = ({ field, value, onChange }) => {
  const [show, setShow] = React.useState(false);
  return (
    <div className={styles.fieldContainer}>
      <label htmlFor={field.id} className={styles.label}>
        {field.label}
      </label>
      <div className="relative">
        <input
          id={field.id}
          name={field.name}
          type={field.type===InputType.PASSWORD && show? 'text': field.type}
          required={field.required}
          className={styles.input}
          placeholder={field.placeholder}
          value={value}
          onChange={onChange}
          autoComplete={field.autoComplete}
        />
        {field.type===InputType.PASSWORD && (
          <button type="button" className="absolute inset-y-0 right-3 flex items-center" onClick={()=>setShow(!show)}>
            {show? <EyeOffIcon className="w-5 h-5 text-gray-500" /> : <EyeIcon className="w-5 h-5 text-gray-500" />}
          </button>
        )}
      </div>
    </div>
  );
};

// Modal de Términos y Condiciones
const TermsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl max-w-3xl w-full max-h-[80vh] overflow-auto">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Términos y Condiciones</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="p-6 space-y-4 text-sm leading-relaxed">
        <TermsAndConditions />
      </div>
    </div>
  </div>
);

const SubmitButton: React.FC<{ disabled: boolean }> = ({ disabled }) => (
  <button type="submit" disabled={disabled} className={styles.submitButton}>
    Crear cuenta
  </button>
);

export default RegistroForm; 