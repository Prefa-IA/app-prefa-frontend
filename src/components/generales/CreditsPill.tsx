import React from 'react';
import { LightningBoltIcon } from '@heroicons/react/outline';

interface CreditsPillProps {
  saldo: number;
}

const CreditsPill: React.FC<CreditsPillProps> = ({ saldo }) => (
  <span
    className="flex items-center gap-1 rounded-full text-[10px] sm:text-xs font-semibold shadow-sm whitespace-nowrap px-2 py-0.5 sm:px-3 sm:py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
    title="Créditos disponibles"
  >
    <LightningBoltIcon className="inline-block h-3 w-3 sm:h-4 sm:w-4" />
    {saldo.toLocaleString()}/5,000
  </span>
);

export default CreditsPill;
