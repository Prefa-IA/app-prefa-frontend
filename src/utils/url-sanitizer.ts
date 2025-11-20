export const sanitizeUrl = (url: string | null | undefined): string | null => {
  if (!url || typeof url !== 'string') return null;

  const trimmed = url.trim();
  if (!trimmed) return null;

  try {
    const urlObj = new URL(trimmed, window.location.origin);

    if (
      urlObj.protocol !== 'http:' &&
      urlObj.protocol !== 'https:' &&
      urlObj.protocol !== 'mailto:'
    ) {
      return null;
    }

    if (urlObj.hostname && !isValidHostname(urlObj.hostname)) {
      return null;
    }

    const sanitized = urlObj.toString();

    if (containsScriptInjection(sanitized)) {
      return null;
    }

    return sanitized;
  } catch {
    return null;
  }
};

export const sanitizePath = (path: string | null | undefined): string => {
  if (!path || typeof path !== 'string') return '/';

  const trimmed = path.trim();
  if (!trimmed || trimmed === '') return '/';

  if (!trimmed.startsWith('/')) {
    return '/';
  }

  if (containsScriptInjection(trimmed)) {
    return '/';
  }

  if (trimmed.includes('//')) {
    return '/';
  }

  if (trimmed.includes('<') || trimmed.includes('>')) {
    return '/';
  }

  try {
    const decoded = decodeURIComponent(trimmed);
    if (containsScriptInjection(decoded)) {
      return '/';
    }
    return trimmed;
  } catch {
    return '/';
  }
};

function isValidLabelPart(part: string): boolean {
  if (part.length === 0 || part.length > 63) return false;
  if (!/^[a-zA-Z0-9]/.test(part)) return false;
  if (!/[a-zA-Z0-9]$/.test(part)) return false;
  for (let i = 0; i < part.length; i++) {
    const char = part.charAt(i);
    if (!char) continue;
    const isValidChar = /[a-zA-Z0-9-]/.test(char);
    if (!isValidChar) return false;
  }
  return true;
}

const isValidHostname = (hostname: string): boolean => {
  if (hostname.length > 253) return false;
  const parts = hostname.split('.');
  if (parts.length === 0) return false;
  for (const part of parts) {
    if (!isValidLabelPart(part)) return false;
  }
  return true;
};

const containsScriptInjection = (str: string): boolean => {
  const dangerousPatterns = [
    /javascript:/i,
    /on\w+\s*=/i,
    /<script/i,
    /<\/script>/i,
    /eval\s*\(/i,
    /expression\s*\(/i,
    /vbscript:/i,
    /data:text\/html/i,
    /&#x/i,
    /%3c/i,
    /%3e/i,
  ];

  return dangerousPatterns.some((pattern) => pattern.test(str));
};

export const sanitizeQueryParam = (param: string | null | undefined): string => {
  if (!param || typeof param !== 'string') return '';

  if (containsScriptInjection(param)) {
    return '';
  }

  return param.replace(/[<>'"]/g, '');
};
