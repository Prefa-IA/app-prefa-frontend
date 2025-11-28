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
      <span className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50">
        {item.name}
      </span>
    );
  }

  return (
    <Link
      to={item.href}
      onClick={onLinkClick}
      className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium text-gray-600 dark:text-white hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500"
    >
      {item.name}
    </Link>
  );
};

export default MobileNavigationLink;
