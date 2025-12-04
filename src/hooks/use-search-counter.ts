import { useEffect, useState } from 'react';

export const useSearchCounter = (isSearching: boolean): number => {
  const [counter, setCounter] = useState<number>(20);

  useEffect(() => {
    if (!isSearching) {
      setCounter(20);
      return;
    }

    setCounter(20);

    const interval = setInterval(() => {
      setCounter((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSearching]);

  return counter;
};
