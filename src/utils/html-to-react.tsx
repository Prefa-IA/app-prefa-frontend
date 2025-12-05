import React from 'react';

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

const parseNodeToReact = (node: Node): React.ReactNode => {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent || '';
  }

  if (node.nodeType === Node.ELEMENT_NODE) {
    const element = node as Element;
    const tagName = element.tagName.toLowerCase();

    if (!ALLOWED_TAGS.includes(tagName)) {
      return Array.from(node.childNodes)
        .map((childNode) => parseNodeToReact(childNode))
        .filter((child) => child !== null && child !== undefined);
    }

    const props: Record<string, string> = {};
    Array.from(element.attributes).forEach((attr) => {
      if (ALLOWED_ATTRIBUTES.includes(attr.name.toLowerCase())) {
        props[attr.name] = attr.value;
      }
    });

    const children = Array.from(node.childNodes)
      .map((childNode) => parseNodeToReact(childNode))
      .filter((child) => child !== null && child !== undefined);

    return React.createElement(tagName, props, ...children);
  }

  return null;
};

export const htmlToReact = (html: string): React.ReactNode[] => {
  if (!html || typeof html !== 'string') {
    return [];
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const body = doc.body;

    return Array.from(body.childNodes)
      .map((node) => parseNodeToReact(node))
      .filter((node) => node !== null && node !== undefined);
  } catch {
    return [];
  }
};
