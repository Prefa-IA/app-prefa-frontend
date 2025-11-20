export const safeObjectAccess = <T>(obj: Record<string, T>, key: string): T | undefined => {
  if (!key || typeof key !== 'string' || typeof obj !== 'object' || obj === null) {
    return undefined;
  }
  if (!Object.prototype.hasOwnProperty.call(obj, key)) {
    return undefined;
  }
  // eslint-disable-next-line security/detect-object-injection
  return obj[key];
};
