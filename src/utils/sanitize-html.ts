const ALLOWED_TAGS = [
  'p',
  'br',
  'strong',
  'em',
  'u',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'ul',
  'ol',
  'li',
  'a',
  'span',
  'div',
  'blockquote',
];

const ALLOWED_ATTRIBUTES = ['href', 'target', 'rel'];

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
  ];

  return dangerousPatterns.some((pattern) => pattern.test(str));
};

const escapeHtml = (text: string): string => {
  const ESCAPE_MAP = new Map<string, string>([
    ['&', '&amp;'],
    ['<', '&lt;'],
    ['>', '&gt;'],
    ['"', '&quot;'],
    ["'", '&#039;'],
  ]);
  const VALID_ESCAPE_CHARS = new Set(['&', '<', '>', '"', "'"]);

  const getEscapedChar = (char: string): string => {
    if (VALID_ESCAPE_CHARS.has(char)) {
      const escaped = ESCAPE_MAP.get(char);
      return escaped !== undefined ? escaped : char;
    }
    return char;
  };

  return text.replace(/[&<>"']/g, (m) => getEscapedChar(m));
};

const cleanAttributeValue = (value: string): string => {
  const cleaned = value.replace(/javascript:/gi, '').replace(/on\w+/gi, '');
  return escapeHtml(cleaned);
};

export const sanitizeHtml = (html: string): string => {
  if (!html || typeof html !== 'string') {
    return '';
  }

  if (containsScriptInjection(html)) {
    return escapeHtml(html);
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const body = doc.body;

    const cleanNode = (node: Node): string => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || '';
        return escapeHtml(text);
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        const tagName = element.tagName.toLowerCase();

        if (!ALLOWED_TAGS.includes(tagName)) {
          return Array.from(node.childNodes)
            .map((childNode) => cleanNode(childNode))
            .join('');
        }

        const attributes: string[] = [];
        Array.from(element.attributes).forEach((attr) => {
          if (ALLOWED_ATTRIBUTES.includes(attr.name.toLowerCase())) {
            const cleanedValue = cleanAttributeValue(attr.value);
            attributes.push(`${attr.name}="${cleanedValue}"`);
          }
        });

        const attrsStr = attributes.length > 0 ? ` ${attributes.join(' ')}` : '';
        const children = Array.from(node.childNodes)
          .map((childNode) => cleanNode(childNode))
          .join('');

        return `<${tagName}${attrsStr}>${children}</${tagName}>`;
      }

      return '';
    };

    return Array.from(body.childNodes)
      .map((childNode) => cleanNode(childNode))
      .join('');
  } catch {
    return escapeHtml(html);
  }
};
