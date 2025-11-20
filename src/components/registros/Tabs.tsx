import React from 'react';

interface TabsProps {
  active: 'informes' | 'direcciones';
  onChange: (t: 'informes' | 'direcciones') => void;
}

const Tabs: React.FC<TabsProps> = ({ active, onChange }) => (
  <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
      <button
        onClick={() => onChange('informes')}
        className={`whitespace-nowrap py-2 px-1 border-b-2 text-sm font-medium ${
          active === 'informes'
            ? 'border-primary-600 text-primary-600 dark:text-primary-400'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-300 dark:hover:text-gray-100'
        }`}
      >
        Mis informes
      </button>
      <button
        onClick={() => onChange('direcciones')}
        className={`whitespace-nowrap py-2 px-1 border-b-2 text-sm font-medium ${
          active === 'direcciones'
            ? 'border-primary-600 text-primary-600 dark:text-primary-400'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-300 dark:hover:text-gray-100'
        }`}
      >
        Mis direcciones
      </button>
    </nav>
  </div>
);

export default Tabs;
