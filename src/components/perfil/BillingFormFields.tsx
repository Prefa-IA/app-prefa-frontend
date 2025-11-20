import React from 'react';

import { BillingInfo } from '../../types/billing';

import BillingAddressFields from './BillingAddressFields';
import BillingPersonalInfoFields from './BillingPersonalInfoFields';

interface BillingFormFieldsProps {
  form: BillingInfo;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const BillingFormFields: React.FC<BillingFormFieldsProps> = ({ form, handleChange }) => (
  <>
    <BillingPersonalInfoFields form={form} handleChange={handleChange} />
    <BillingAddressFields form={form} handleChange={handleChange} />
  </>
);

export default BillingFormFields;
