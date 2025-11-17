import { SEARCH_CONFIG } from '../types/enums';

export const shouldShowSuggestions = (value: string, suggestionsLength: number): boolean => {
  return value.length > SEARCH_CONFIG.MIN_CHARS_FOR_SUGGESTIONS && suggestionsLength > 0;
};

export const createInputChangeHandler =
  (
    onChange: (value: string) => void,
    onInputChange?: (value: string) => void,
    setMostrarSugerencias?: (show: boolean) => void
  ) =>
  (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    onInputChange?.(newValue);

    if (setMostrarSugerencias) {
      const shouldShow = newValue.length > SEARCH_CONFIG.MIN_CHARS_FOR_SUGGESTIONS;
      setMostrarSugerencias(shouldShow);
    }
  };

export const createSuggestionSelectHandler =
  (
    onChange: (value: string) => void,
    setMostrarSugerencias: (show: boolean) => void,
    onSeleccionarSugerencia?: (direccion: string) => void
  ) =>
  (direccion: string) => {
    onChange(direccion);
    setMostrarSugerencias(false);
    onSeleccionarSugerencia?.(direccion);
  };

export const createSearchClickHandler =
  (onSearch: () => void, setMostrarSugerencias: (show: boolean) => void) => () => {
    onSearch();
    setMostrarSugerencias(false);
  };

export const createFocusHandler =
  (value: string, setMostrarSugerencias: (show: boolean) => void) => () => {
    if (value.length > SEARCH_CONFIG.MIN_CHARS_FOR_SUGGESTIONS) {
      setMostrarSugerencias(true);
    }
  };
