import React from 'react';
import { Link } from 'react-router-dom';

interface AuthButtonsProps {
  className?: string;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({ className = 'flex space-x-2 sm:space-x-3' }) => (
  <div className={className}>
    <Link
      to="/login"
      className="inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
    >
      Iniciar Sesión
    </Link>
    <Link
      to="/registro"
      className="inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 border border-primary-600 text-xs sm:text-sm font-medium rounded-lg text-primary-600 dark:text-primary-400 bg-white dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
    >
      Registrarse
    </Link>
  </div>
);

export default AuthButtons;
