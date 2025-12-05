import React from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/solid';

import { useTheme } from '../../contexts/ThemeContext';

const ThemeButton: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md focus:outline-none"
      title={isDark ? 'Modo Claro' : 'Modo Oscuro'}
    >
      {isDark ? (
        <MoonIcon className="h-5 w-5 text-yellow-400 hover:text-yellow-300" />
      ) : (
        <SunIcon className="h-5 w-5 text-gray-800 hover:text-gray-900" />
      )}
    </button>
  );
};

export default ThemeButton;
