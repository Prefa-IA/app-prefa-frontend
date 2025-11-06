import React from 'react';

interface Props {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

const ActionCard: React.FC<Props> = ({ icon, title, description, onClick }) => (
  <button onClick={onClick} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-primary-200 dark:hover:border-primary-400 transition-all text-left group">
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0 p-3 bg-primary-50 dark:bg-primary-900 rounded-lg group-hover:bg-primary-100 dark:group-hover:bg-primary-800 transition-colors">
        <div className="text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300">{icon}</div>
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary-900 dark:group-hover:text-primary-300">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mt-1">{description}</p>
      </div>
    </div>
  </button>
);

export default ActionCard; 