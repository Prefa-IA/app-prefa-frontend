import React from 'react';
import { Link } from 'react-router-dom';
import type { RegistrationFormProps, FormFieldsProps, FormFieldProps } from '../../types/enums';
import { TermsModalProps } from '../../types/components';
import { createFormHandler } from '../../utils/formUtils';
import { REGISTRATION_FORM_FIELDS } from '../../utils/formConfigUtils';
import styles from '../../styles/RegistroForm.module.css';
import { InputType } from '../../types/enums';
import { EyeIcon, EyeOffIcon, ArrowLeftIcon } from '@heroicons/react/outline';
import TermsAndConditions from './TermsAndConditions';
import { Recaptcha } from '../common/Recaptcha';
import { sanitizePath } from '../../utils/urlSanitizer';
import { useRegistrationForm } from '../../hooks/useRegistrationForm';
import { useNavigate } from 'react-router-dom';

const RegistroForm: React.FC = () => {
  const navigate = useNavigate();
  const {
    datos,
    setDatos,
    showPass,
    setShowPass,
    aceptoTyC,
    mostrarTyC,
    showCaptcha,
    captchaToken,
    isSubmitting,
    recaptchaWidgetIdRef,
    handleSubmit,
    handleCaptchaVerify,
    handleCaptchaError,
    toggleTyC,
    openModal,
    closeModal,
  } = useRegistrationForm();

  const handleChange = createFormHandler(setDatos);

  return (
    <div className={styles.container}>
      <div className={`${styles.formContainer} bg-white dark:bg-gray-800 p-4 sm:p-8 rounded shadow w-full sm:w-auto`}>
        <button type="button" onClick={() => navigate(sanitizePath('/login'))} className="text-gray-500 hover:text-gray-700 flex items-center mb-4">
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
          showCaptcha={showCaptcha}
          captchaToken={captchaToken}
          onCaptchaVerify={handleCaptchaVerify}
          onCaptchaError={handleCaptchaError}
          recaptchaWidgetIdRef={recaptchaWidgetIdRef}
          isSubmitting={isSubmitting}
        />
        {mostrarTyC && <TermsModal onClose={closeModal} />}
      </div>
    </div>
  );
};

const FormHeader: React.FC = () => <></>;

const RegistrationForm: React.FC<RegistrationFormProps & { 
  aceptoTyC: boolean; 
  onToggleTyC: () => void; 
  onOpenTyC: () => void; 
  showPass:boolean; 
  setShowPass:React.Dispatch<React.SetStateAction<boolean>>;
  showCaptcha: boolean;
  captchaToken: string | null;
  onCaptchaVerify: (token: string) => void;
  onCaptchaError: () => void;
  recaptchaWidgetIdRef: React.MutableRefObject<number | null>;
  isSubmitting: boolean;
}> = ({
  datos,
  onSubmit,
  onChange,
  aceptoTyC,
  onToggleTyC,
  onOpenTyC,
  showPass,
  setShowPass,
  showCaptcha,
  captchaToken,
  onCaptchaVerify,
  onCaptchaError,
  recaptchaWidgetIdRef,
  isSubmitting
}) => {
  const recaptchaSiteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY || '';
  
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.inputGroup}>
        <FormFields datos={datos} onChange={onChange} showPass={showPass} setShowPass={setShowPass}/>
      </div>
      <div className="flex items-center text-sm dark:text-gray-300">
        <input
          id="aceptoTyC"
          type="checkbox"
          checked={aceptoTyC}
          onChange={onToggleTyC}
          className="mr-2 dark:bg-gray-900 dark:border-gray-600"
        />
        <label htmlFor="aceptoTyC" className="">
          Acepto los{' '}
          <button type="button" className="text-primary-600 dark:text-primary-400 underline" onClick={onOpenTyC}>
            Términos y Condiciones
          </button>
        </label>
      </div>
      {showCaptcha && recaptchaSiteKey && (
        <div className="flex justify-center my-4">
          <Recaptcha
            siteKey={recaptchaSiteKey}
            onVerify={(token) => {
              onCaptchaVerify(token);
            }}
            onError={onCaptchaError}
            widgetIdRef={recaptchaWidgetIdRef}
          />
        </div>
      )}
      <SubmitButton disabled={!aceptoTyC || (showCaptcha && !captchaToken) || isSubmitting} />
      <hr />
      <p className="text-center text-gray-900 dark:text-gray-100">¿Ya tenés cuenta? <Link to={sanitizePath('/login')} className="text-primary-600 dark:text-primary-400 hover:underline">Ingresá</Link></p>
    </form>
  );
};

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
      <label htmlFor={field.id} className={`${styles.label} dark:text-gray-300`}>
        {field.label}
      </label>
      <div className="relative">
        <input
          id={field.id}
          name={field.name}
          type={field.type===InputType.PASSWORD && show? 'text': field.type}
          required={field.required}
          className={`${styles.input} dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100`}
          placeholder={field.placeholder}
          value={value}
          onChange={onChange}
          autoComplete={field.autoComplete}
          maxLength={field.maxLength}
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

const TermsModal: React.FC<TermsModalProps> = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white dark:bg-gray-900 rounded-xl max-w-3xl w-full max-h-[80vh] overflow-auto">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Términos y Condiciones</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="p-6 space-y-4 text-sm leading-relaxed">
        <TermsAndConditions onClose={onClose} />
      </div>
    </div>
  </div>
);

const SubmitButton: React.FC<{ disabled: boolean }> = ({ disabled }) => (
  <button
    type="submit"
    disabled={disabled}
    className="inline-flex w-full justify-center items-center px-3 py-2 sm:px-4 sm:py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg"
  >
    Crear cuenta
  </button>
);

export default RegistroForm; 