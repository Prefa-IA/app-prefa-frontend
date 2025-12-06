import React from 'react';

import { MobileNavigationProps } from '../../types/components';

import MobileNavigationLink from './MobileNavigationLink';

interface MobileNavigationExtendedProps extends MobileNavigationProps {
  disabled?: boolean;
  onLinkClick?: () => void;
}

const MobileNavigation: React.FC<MobileNavigationExtendedProps> = ({
  navigation,
  disabled = false,
  onLinkClick,
}) => (
  <div className="pt-2 pb-4">
    {navigation.map((item) => (
      <MobileNavigationLink
        key={item.name}
        item={item}
        disabled={disabled}
        {...(onLinkClick ? { onLinkClick } : {})}
      />
    ))}
  </div>
);

export default MobileNavigation;
