import React, { useCallback, useEffect, useRef, useState } from 'react';

import { SEARCH_CONFIG, SearchBarProps } from '../../types/enums';
import { addClickOutsideListener } from '../../utils/dom-utils';
import {
  createFocusHandler,
  createInputChangeHandler,
  createSuggestionSelectHandler,
  shouldShowSuggestions,
} from '../../utils/search-utils';

import SearchBarInput from './SearchBarInput';
import SuggestionsList from './SearchBarSuggestions';

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
  hasResult = false,
  onClear,
  disabled,
  singleModeIcon,
}) => {
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleSearchClick = useCallback(() => {
    if (cooldown) return;
    setCooldown(true);
    onSearch();
    setMostrarSugerencias(false);
    setTimeout(() => setCooldown(false), 1500);
  }, [cooldown, onSearch]);

  const handleFocus = createFocusHandler(value, setMostrarSugerencias);

  const showSuggestions = shouldShowSuggestions(value, sugerencias.length) && mostrarSugerencias;

  return (
    <div className={styles['container']} ref={containerRef}>
      <SearchBarInput
        value={value}
        placeholder={placeholder}
        disabled={disabled || cooldown}
        hasResult={hasResult}
        isLoading={isLoading}
        isCompoundMode={isCompoundMode}
        singleModeIcon={singleModeIcon}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onSearch={handleSearchClick}
        {...(onClear ? { onClear } : {})}
      />
      {showSuggestions && (
        <SuggestionsList sugerencias={sugerencias} onSelect={handleSeleccionarSugerencia} />
      )}
    </div>
  );
};

export default SearchBar;
