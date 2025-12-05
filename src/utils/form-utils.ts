export const handleInputChange =
  <T>(setState: React.Dispatch<React.SetStateAction<T>>, field: keyof T) =>
  (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { value } = e.target;
    setState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

export const createFormHandler =
  <T>(setState: React.Dispatch<React.SetStateAction<T>>) =>
  (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

export const handleKeyDown = (key: string, callback: () => void) => (e: React.KeyboardEvent) => {
  if (e.key === key) {
    callback();
  }
};
