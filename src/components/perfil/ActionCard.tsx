import React from 'react';

interface Props {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

const ActionCard: React.FC<Props> = ({ icon, title, description, onClick }) => (
  <button onClick={onClick} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-200 transition-all text-left group">
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0 p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
        <div className="text-blue-600 group-hover:text-blue-700">{icon}</div>
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-900">{title}</h3>
        <p className="text-gray-600 mt-1">{description}</p>
      </div>
    </div>
  </button>
);

export default ActionCard; 