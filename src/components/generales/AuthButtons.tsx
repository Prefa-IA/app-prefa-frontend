import React from 'react';
import { Link } from 'react-router-dom';

interface AuthButtonsProps {
  className?: string;
  onLinkClick?: () => void;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({
  className = 'flex space-x-2 sm:space-x-3',
  onLinkClick,
}) => {
  const isVertical = className.includes('flex-col');
  
  return (
    <div className={className}>
      <Link
        to="/login"
        onClick={onLinkClick}
        className={`inline-flex items-center justify-center w-full px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 ${
          isVertical ? '' : 'sm:w-auto'
        }`}
      >
        Iniciar Sesión
      </Link>
      <Link
        to="/registro"
        onClick={onLinkClick}
        className={`inline-flex items-center justify-center w-full px-4 py-3 border-2 border-primary-600 dark:border-primary-400 text-base font-medium rounded-lg text-primary-600 dark:text-primary-400 bg-white dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 ${
          isVertical ? '' : 'sm:w-auto'
        }`}
      >
        Registrarse
      </Link>
    </div>
  );
};

export default AuthButtons;
