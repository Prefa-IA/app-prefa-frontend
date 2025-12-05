import { useCallback, useState } from 'react';

export const useInformesSearch = () => {
  const [search, setSearch] = useState('');
  const [searchCooldown, setSearchCooldown] = useState(false);

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchCooldown) return;
      setSearchCooldown(true);
      setTimeout(() => setSearchCooldown(false), 1500);
    },
    [searchCooldown]
  );

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value.toUpperCase());
  }, []);

  return {
    search,
    setSearch,
    searchCooldown,
    handleSearchSubmit,
    handleSearchChange,
  };
};
