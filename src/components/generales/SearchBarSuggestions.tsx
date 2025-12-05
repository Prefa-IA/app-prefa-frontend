import React from 'react';

import { SuggestionItemProps, SuggestionsListProps } from '../../types/enums';

import styles from '../../styles/SearchBar.module.css';

const SuggestionItem: React.FC<SuggestionItemProps> = ({ sugerencia, onSelect }) => (
  <div
    role="button"
    tabIndex={0}
    className={`${styles['suggestionItem']} dark:text-gray-100 dark:hover:bg-gray-700`}
    onClick={() => onSelect(sugerencia.direccion)}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect(sugerencia.direccion);
      }
    }}
  >
    {sugerencia.direccion}
  </div>
);

const SuggestionsList: React.FC<SuggestionsListProps> = ({ sugerencias, onSelect }) => (
  <div className={`${styles['suggestionsContainer']} dark:bg-gray-800 dark:border-gray-700`}>
    {sugerencias.map((sugerencia, index) => (
      <SuggestionItem key={index} sugerencia={sugerencia} onSelect={onSelect} />
    ))}
  </div>
);

export default SuggestionsList;
