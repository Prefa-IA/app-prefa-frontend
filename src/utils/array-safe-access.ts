export const safeArrayAccess = <T>(array: T[], index: number): T | undefined => {
  if (
    typeof index !== 'number' ||
    !Number.isInteger(index) ||
    index < 0 ||
    index >= array.length ||
    !Array.isArray(array)
  ) {
    return undefined;
  }
  // eslint-disable-next-line security/detect-object-injection
  return array[index];
};
