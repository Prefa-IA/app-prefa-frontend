import React from 'react';

import { BillingInfo } from '../../types/billing';

import BillingAddressRow1 from './BillingAddressRow1';
import BillingAddressRow2 from './BillingAddressRow2';

interface BillingAddressFieldsProps {
  form: BillingInfo;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const BillingAddressFields: React.FC<BillingAddressFieldsProps> = ({ form, handleChange }) => (
  <>
    <BillingAddressRow1 form={form} handleChange={handleChange} />
    <BillingAddressRow2 form={form} handleChange={handleChange} />
  </>
);

export default BillingAddressFields;
