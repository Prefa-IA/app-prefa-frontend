import React from 'react';

import { PageNumberProps } from '../../types/components';

const PageNumber: React.FC<PageNumberProps> = ({ pageNumber, className = '' }) => {
  return (
    <div
      className={`mt-4 border border-gray-300 rounded w-fit px-3 py-1.5 text-black bg-white ml-auto print-hidden ${className}`}
      style={{
        fontSize: '0.875rem',
        fontWeight: 600,
        textAlign: 'right',
        color: '#000000',
        backgroundColor: '#ffffff',
        borderColor: '#d1d5db',
        minWidth: 'fit-content',
        whiteSpace: 'nowrap',
        letterSpacing: 'normal',
        wordSpacing: 'normal',
        fontVariantNumeric: 'normal',
      }}
    >
      {pageNumber}
    </div>
  );
};

export default PageNumber;
