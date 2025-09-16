import React from 'react';

interface PageNumberProps {
  pageNumber: number;
  className?: string;
}

const PageNumber: React.FC<PageNumberProps> = ({ pageNumber, className = '' }) => {
  return (
    <div className={`mt-4 border rounded w-fit px-3 py-1 text-dark bg-gray-100 ml-auto print-hidden ${className}`}>
      {pageNumber}
    </div>
  );
};

export default PageNumber;