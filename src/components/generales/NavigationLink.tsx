import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import { NavigationLinkProps } from '../../types/components';

interface NavigationLinkExtendedProps extends NavigationLinkProps {
  disabled?: boolean;
}

const NavigationLink: React.FC<NavigationLinkExtendedProps> = ({ item, disabled = false }) => {
  const { pathname } = useLocation();
  const active = pathname === item.href || pathname.startsWith(item.href + '/');

  const base =
    'relative group inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-300';
  const color = active
    ? 'text-primary-600 dark:text-primary-400'
    : 'text-gray-900 dark:text-gray-100 hover:text-primary-600';
  const underline =
    'after:content-[""] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary-600 after:transform after:transition-transform after:duration-300 after:origin-left ' +
    (active ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100');

  const hoverColor = active ? '' : 'hover:text-primary-600';

  const tutorialMap: Record<string, string> = {
    '/consultar': 'analisis-prefactibilidad',
    '/buscar': 'buscar-direccion',
    '/informes': 'registros',
    '/suscripciones': 'planes',
  };

  const tutorialAttr = tutorialMap[item.href] ? { 'data-tutorial': tutorialMap[item.href] } : {};

  if (disabled) {
    return (
      <span
        className={`${base} ${color} ${hoverColor} ${underline} cursor-not-allowed opacity-50`}
        {...tutorialAttr}
      >
        {item.name}
      </span>
    );
  }

  return (
    <Link
      to={item.href}
      className={`${base} ${color} ${hoverColor} ${underline}`}
      {...tutorialAttr}
    >
      {item.name}
    </Link>
  );
};

export default NavigationLink;
