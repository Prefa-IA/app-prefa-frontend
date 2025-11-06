import React, { useRef, useState, useEffect } from 'react';
import { SearchIcon } from '@heroicons/react/outline';
import { 
  SearchBarProps, 
  SuggestionsListProps, 
  SuggestionItemProps,
  SEARCH_CONFIG 
} from '../../types/enums';
import { addClickOutsideListener } from '../../utils/domUtils';
import { handleKeyDown } from '../../utils/formUtils';
import { 
  shouldShowSuggestions,
  createInputChangeHandler,
  createSuggestionSelectHandler,
  createFocusHandler
} from '../../utils/searchUtils';
import styles from '../../styles/SearchBar.module.css';

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSearch,
  isCompoundMode,
  isLoading,
  placeholder = SEARCH_CONFIG.PLACEHOLDER_DEFAULT,
  sugerencias = [],
  onInputChange,
  onSeleccionarSugerencia,
  hasResult=false,
  onClear,
  disabled
}) => {
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [cooldown,setCooldown]=useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const cleanup = addClickOutsideListener((event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setMostrarSugerencias(false);
      }
    });

    return cleanup;
  }, []);

  const handleInputChange = createInputChangeHandler(
    onChange,
    onInputChange,
    setMostrarSugerencias
  );

  const handleSeleccionarSugerencia = createSuggestionSelectHandler(
    onChange,
    setMostrarSugerencias,
    onSeleccionarSugerencia
  );

  const handleSearchClick = () => {
    if(cooldown) return;
    setCooldown(true);
    onSearch();
    setMostrarSugerencias(false);
    setTimeout(()=>setCooldown(false),1500);
  };

  const handleFocus = createFocusHandler(
    value,
    setMostrarSugerencias
  );

  const showSuggestions = shouldShowSuggestions(value, sugerencias.length) && mostrarSugerencias;

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.inputContainer}>
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          className={`${styles.input} dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500`}
          onChange={handleInputChange}
          value={value}
          onKeyDown={handleKeyDown('Enter', handleSearchClick)}
          onFocus={handleFocus}
          disabled={disabled}
          />
        {hasResult ? (
          <button
            onClick={onClear}
            className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700"
          >✕</button>
        ):(
        <button
          onClick={handleSearchClick}
          className={`${styles.searchButton} dark:bg-primary-700 dark:hover:bg-primary-600`}
          disabled={isLoading||cooldown||disabled}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              {!isCompoundMode}
            </div>
          ) : (
            isCompoundMode ? 'Agregar dirección' : <SearchIcon className={styles.icon} />
          )}
        </button>
        )}
      </div>
      
      {showSuggestions && (
        <SuggestionsList 
          sugerencias={sugerencias}
          onSelect={handleSeleccionarSugerencia}
        />
      )}
    </div>
  );
};

const SuggestionsList: React.FC<SuggestionsListProps> = ({ sugerencias, onSelect }) => (
  <div className={`${styles.suggestionsContainer} dark:bg-gray-800 dark:border-gray-700`}>
    {sugerencias.map((sugerencia, index) => (
      <SuggestionItem
        key={index}
        sugerencia={sugerencia}
        onSelect={onSelect}
      />
    ))}
  </div>
);

const SuggestionItem: React.FC<SuggestionItemProps> = ({ sugerencia, onSelect }) => (
  <div
    className={`${styles.suggestionItem} dark:text-gray-100 dark:hover:bg-gray-700`}
    onClick={() => onSelect(sugerencia.direccion)}
  >
    {sugerencia.direccion}
  </div>
);

export default SearchBar; 