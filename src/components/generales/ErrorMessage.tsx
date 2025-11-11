import React from 'react';
import { ErrorMessageProps } from '../../types/components';

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
      {message}
    </div>
  );
};

export default ErrorMessage; 