import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => (
  <div className="min-h-[70vh] md:min-h-[75vh] lg:min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
    <div className="mb-6">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-16 w-16 md:h-20 md:w-20 text-gray-400 dark:text-gray-500">
        <path fill="currentColor" d="M12 18a2 2 0 1 0 .001 4.001A2 2 0 0 0 12 18Zm9.192-8.808a1 1 0 0 1 0 1.415l-1.06 1.06a12.954 12.954 0 0 0-6.132-3.279l1.383-1.383a10.963 10.963 0 0 1 5.809 3.187Zm-18.384 0a10.963 10.963 0 0 1 5.809-3.187l1.383 1.383a12.954 12.954 0 0 0-6.132 3.279l-1.06-1.06a1 1 0 0 1 0-1.415ZM7.05 12.05a8.977 8.977 0 0 1 9.9 0l-1.414 1.414a6.977 6.977 0 0 0-7.072 0L7.05 12.05Zm7.071 4.243a4 4 0 0 0-4.242 0L8.465 14.88a6 6 0 0 1 7.071 0l-1.415 1.414Z"/>
        <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
    <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-primary-600 dark:text-primary-400 mb-3">404</h1>
    <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-2">Página no encontrada</p>
    <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mb-8">Parece que esta página perdió la señal. Probá volver al inicio.</p>
    <Link
      to="/"
      className="inline-block px-6 py-3 bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 text-white rounded-lg shadow transition-colors"
    >
      Ir al inicio
    </Link>
  </div>
);

export default NotFound;
