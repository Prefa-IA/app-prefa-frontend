export const useClickOutside = (
  ref: React.RefObject<HTMLElement>,
  callback: () => void
) => {
  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      callback();
    }
  };

  return { handleClickOutside };
};

export const addClickOutsideListener = (
  callback: (event: MouseEvent) => void
) => {
  document.addEventListener('mousedown', callback);
  return () => document.removeEventListener('mousedown', callback);
}; 