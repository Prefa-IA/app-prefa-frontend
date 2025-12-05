export const isTokenExpired = (token: string): boolean => {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return true;
    const payloadPart = parts[1];
    if (!payloadPart) return true;
    const payload = JSON.parse(atob(payloadPart.replace(/-/g, '+').replace(/_/g, '/')));
    const exp = typeof payload.exp === 'number' ? payload.exp : 0;
    return !exp || Date.now() >= exp * 1000;
  } catch {
    return true;
  }
};
