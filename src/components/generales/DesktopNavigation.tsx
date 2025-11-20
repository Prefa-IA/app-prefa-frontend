import React from 'react';

import { NAVBAR_CONFIG } from '../../types/enums';

import NavigationLink from './NavigationLink';

interface DesktopNavigationProps {
  needsTermsAcceptance?: boolean;
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({ needsTermsAcceptance = false }) => (
  <div className="hidden lg:ml-6 lg:flex lg:space-x-8">
    {NAVBAR_CONFIG.NAVIGATION.map((item) => (
      <NavigationLink key={item.name} item={item} disabled={needsTermsAcceptance} />
    ))}
  </div>
);

export default DesktopNavigation;
