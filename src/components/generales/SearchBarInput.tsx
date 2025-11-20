import React, { useRef } from 'react';
import { SearchIcon } from '@heroicons/react/outline';

import { handleKeyDown } from '../../utils/form-utils';

import styles from '../../styles/SearchBar.module.css';

interface SearchBarInputProps {
  value: string;
  placeholder: string;
  disabled: boolean;
  hasResult: boolean;
  isLoading: boolean;
  isCompoundMode: boolean;
  singleModeIcon: boolean | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onSearch: () => void;
  onClear?: () => void;
}

const SearchBarInput: React.FC<SearchBarInputProps> = ({
  value,
  placeholder,
  disabled,
  hasResult,
  isLoading,
  isCompoundMode,
  singleModeIcon,
  onChange,
  onFocus,
  onSearch,
  onClear,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={styles['inputContainer']}>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className={`${styles['input']} dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500`}
        onChange={onChange}
        value={value}
        onKeyDown={handleKeyDown('Enter', onSearch)}
        onFocus={onFocus}
        disabled={disabled}
      />
      {hasResult && onClear ? (
        <button
          onClick={onClear}
          className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700"
        >
          ✕
        </button>
      ) : (
        <button
          onClick={onSearch}
          className={`${styles['searchButton']} dark:bg-primary-700 dark:hover:bg-primary-600`}
          disabled={isLoading || disabled}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              {!isCompoundMode}
            </div>
          ) : isCompoundMode ? (
            'Agregar dirección'
          ) : singleModeIcon ? (
            <SearchIcon className={styles['icon']} />
          ) : (
            'Generar'
          )}
        </button>
      )}
    </div>
  );
};

export default SearchBarInput;
