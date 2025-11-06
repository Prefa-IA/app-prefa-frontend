import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
    <h1 className="text-5xl font-extrabold text-primary-600 dark:text-primary-400 mb-4">404</h1>
    <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">Página no encontrada</p>
    <Link
      to="/"
      className="inline-block px-6 py-3 bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 text-white rounded-lg shadow transition-colors"
    >
      Volver al inicio
    </Link>
  </div>
);

export default NotFound;
