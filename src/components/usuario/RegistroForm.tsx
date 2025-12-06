import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, EyeIcon, EyeOffIcon } from '@heroicons/react/outline';

import { useRegistrationForm } from '../../hooks/use-registration-form';
import { TermsModalProps } from '../../types/components';
import type { FormFieldProps, FormFieldsProps, RegistrationFormProps } from '../../types/enums';
import { InputType } from '../../types/enums';
import { REGISTRATION_FORM_FIELDS } from '../../utils/form-config-utils';
import { createFormHandler } from '../../utils/form-utils';
import { sanitizePath } from '../../utils/url-sanitizer';
import { Recaptcha } from '../common/Recaptcha';

import GoogleLoginButton from './GoogleLoginButton';
import TermsAndConditions from './TermsAndConditions';

import styles from '../../styles/RegistroForm.module.css';

const RegistroForm: React.FC = () => {
  const navigate = useNavigate();
  const {
    datos,
    setDatos,
    showPass,
    setShowPass,
    aceptoTyC,
    mostrarTyC,
    captchaToken,
    captchaValidated,
    isSubmitting,
    recaptchaWidgetIdRef,
    resetKey,
    handleSubmit,
    handleCaptchaVerify,
    handleCaptchaError,
    resetCaptcha,
    toggleTyC,
    openModal,
    closeModal,
  } = useRegistrationForm();

  const handleChange = createFormHandler(setDatos);

  return (
    <div
      className={`${styles['container']} min-h-screen flex justify-center items-center w-full`}
    >
      <div
        className={`${styles['formContainer']} bg-white dark:bg-gray-800 p-4 sm:p-8 rounded shadow`}
      >
        <button
          type="button"
          onClick={() => navigate(sanitizePath('/login'))}
          className="text-gray-500 hover:text-gray-700 flex items-center mb-4"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-1" />
        </button>
        <FormHeader />
        <RegistrationForm
          datos={datos}
          onSubmit={(e) => {
            void handleSubmit(e);
          }}
          onChange={handleChange}
          aceptoTyC={aceptoTyC}
          onToggleTyC={toggleTyC}
          onOpenTyC={openModal}
          showPass={showPass}
          setShowPass={setShowPass}
          captchaToken={captchaToken}
          captchaValidated={captchaValidated}
          onCaptchaVerify={handleCaptchaVerify}
          onCaptchaError={handleCaptchaError}
          recaptchaWidgetIdRef={recaptchaWidgetIdRef}
          resetKey={resetKey}
          isSubmitting={isSubmitting}
          resetCaptcha={resetCaptcha}
        />
        {mostrarTyC && <TermsModal onClose={closeModal} />}
      </div>
    </div>
  );
};

const FormHeader: React.FC = () => <></>;

interface RegistrationFormExtendedProps extends RegistrationFormProps {
  aceptoTyC: boolean;
  onToggleTyC: () => void;
  onOpenTyC: () => void;
  showPass: boolean;
  setShowPass: React.Dispatch<React.SetStateAction<boolean>>;
  captchaToken: string | null;
  captchaValidated: boolean;
  onCaptchaVerify: (token: string) => void;
  onCaptchaError: () => void;
  recaptchaWidgetIdRef: React.MutableRefObject<number | null>;
  resetKey: number;
  isSubmitting: boolean;
  resetCaptcha: () => void;
}

const TermsCheckbox: React.FC<{
  aceptoTyC: boolean;
  onToggleTyC: () => void;
  onOpenTyC: () => void;
}> = ({ aceptoTyC, onToggleTyC, onOpenTyC }) => (
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
      <button
        type="button"
        className="text-primary-600 dark:text-primary-400 underline"
        onClick={onOpenTyC}
      >
        Términos y Condiciones
      </button>
    </label>
  </div>
);

const RecaptchaSection: React.FC<{
  recaptchaSiteKey: string;
  captchaValidated: boolean;
  resetKey: number;
  onCaptchaVerify: (token: string) => void;
  onCaptchaError: () => void;
  recaptchaWidgetIdRef: React.MutableRefObject<number | null>;
}> = ({
  recaptchaSiteKey,
  captchaValidated,
  resetKey,
  onCaptchaVerify,
  onCaptchaError,
  recaptchaWidgetIdRef,
}) => {
  if (!recaptchaSiteKey || captchaValidated) {
    return null;
  }

  return (
    <div className="flex justify-center my-2 sm:my-4">
      <Recaptcha
        key={resetKey}
        siteKey={recaptchaSiteKey}
        onVerify={onCaptchaVerify}
        onError={onCaptchaError}
        widgetIdRef={recaptchaWidgetIdRef}
      />
    </div>
  );
};

const SocialLoginSection: React.FC<{ resetCaptcha: () => void }> = ({ resetCaptcha }) => (
  <>
    <div className="my-0.5 flex items-center mt-4">
      <div className="flex-grow border-t border-gray-300 dark:border-gray-700" />
      <span className="px-3 text-xs text-gray-500">o</span>
      <div className="flex-grow border-t border-gray-300 dark:border-gray-700" />
    </div>
    <GoogleLoginButton
      className="flex justify-center"
      onSuccessNavigate="/consultar"
      onBeforeClick={resetCaptcha}
    />
  </>
);

const RegistrationForm: React.FC<RegistrationFormExtendedProps> = ({
  datos,
  onSubmit,
  onChange,
  aceptoTyC,
  onToggleTyC,
  onOpenTyC,
  showPass,
  setShowPass,
  captchaToken,
  captchaValidated,
  onCaptchaVerify,
  onCaptchaError,
  recaptchaWidgetIdRef,
  resetKey,
  isSubmitting,
  resetCaptcha,
}) => {
  const recaptchaSiteKey = process.env['REACT_APP_RECAPTCHA_SITE_KEY'] || '';

  return (
    <form className={styles['form']} onSubmit={(e) => void onSubmit(e)}>
      <div className={styles['inputGroup']}>
        <FormFields
          datos={datos}
          onChange={onChange}
          showPass={showPass}
          setShowPass={setShowPass}
        />
      </div>
      <TermsCheckbox aceptoTyC={aceptoTyC} onToggleTyC={onToggleTyC} onOpenTyC={onOpenTyC} />
      <RecaptchaSection
        recaptchaSiteKey={recaptchaSiteKey}
        captchaValidated={captchaValidated}
        resetKey={resetKey}
        onCaptchaVerify={onCaptchaVerify}
        onCaptchaError={onCaptchaError}
        recaptchaWidgetIdRef={recaptchaWidgetIdRef}
      />
      <div className="mt-2 sm:mt-4">
        <SubmitButton disabled={!aceptoTyC || !captchaToken || isSubmitting} />
      </div>
      <SocialLoginSection resetCaptcha={resetCaptcha} />
      <p className="text-center text-gray-900 dark:text-gray-100 mt-4">
        ¿Ya tenés cuenta?{' '}
        <Link
          to={sanitizePath('/login')}
          className="text-primary-600 dark:text-primary-400 hover:underline"
        >
          Ingresá
        </Link>
      </p>
    </form>
  );
};

const FormFields: React.FC<FormFieldsProps> = ({ datos, onChange, showPass, setShowPass }) => (
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
    <div className={styles['fieldContainer']}>
      <label htmlFor={field.id} className={`${styles['label']} dark:text-gray-300`}>
        {field.label}
      </label>
      <div className="relative">
        <input
          id={field.id}
          name={field.name}
          type={field.type === InputType.PASSWORD && show ? 'text' : field.type}
          required={field.required}
          className={`${styles['input']} dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100`}
          placeholder={field.placeholder}
          value={value}
          onChange={onChange}
          autoComplete={field.autoComplete}
          maxLength={field.maxLength}
        />
        {field.type === InputType.PASSWORD && (
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center"
            onClick={() => setShow(!show)}
          >
            {show ? (
              <EyeOffIcon className="w-5 h-5 text-gray-500" />
            ) : (
              <EyeIcon className="w-5 h-5 text-gray-500" />
            )}
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
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Términos y Condiciones
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
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
