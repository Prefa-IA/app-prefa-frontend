import React from 'react';
import { Link } from 'react-router-dom';

import { MobileNavigationLinkProps } from '../../types/components';

interface MobileNavigationLinkExtendedProps extends MobileNavigationLinkProps {
  disabled?: boolean;
  onLinkClick?: () => void;
}

const MobileNavigationLink: React.FC<MobileNavigationLinkExtendedProps> = ({
  item,
  disabled = false,
  onLinkClick,
}) => {
  if (disabled) {
    return (
      <span className="block px-6 py-3 text-left text-base font-medium text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50 border-l-4 border-transparent">
        {item.name}
      </span>
    );
  }

  return (
    <Link
      to={item.href}
      onClick={onLinkClick}
      className="block px-6 py-3 text-left text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 border-l-4 border-transparent hover:border-primary-500 transition-all duration-200 active:bg-gray-100 dark:active:bg-gray-700"
    >
      {item.name}
    </Link>
  );
};

export default MobileNavigationLink;
