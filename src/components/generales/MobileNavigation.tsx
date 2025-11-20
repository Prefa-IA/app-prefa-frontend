import React from 'react';

import { MobileNavigationProps } from '../../types/components';

import MobileNavigationLink from './MobileNavigationLink';

interface MobileNavigationExtendedProps extends MobileNavigationProps {
  disabled?: boolean;
}

const MobileNavigation: React.FC<MobileNavigationExtendedProps> = ({
  navigation,
  disabled = false,
}) => (
  <div className="pt-2 pb-3 space-y-1">
    {navigation.map((item) => (
      <MobileNavigationLink key={item.name} item={item} disabled={disabled} />
    ))}
  </div>
);

export default MobileNavigation;
