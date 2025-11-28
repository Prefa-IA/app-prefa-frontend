import React, { useMemo } from 'react';

import { htmlToReact } from '../../utils/html-to-react';
import { sanitizeHtml } from '../../utils/sanitize-html';

interface SafeHtmlProps {
  html: string;
  className?: string;
}

const SafeHtml: React.FC<SafeHtmlProps> = ({ html, className }) => {
  const sanitized = useMemo(() => sanitizeHtml(html), [html]);
  const reactElements = useMemo(() => htmlToReact(sanitized), [sanitized]);

  return <div className={className}>{reactElements}</div>;
};

export default SafeHtml;
