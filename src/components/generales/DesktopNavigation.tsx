import React from 'react';

import { NAVBAR_CONFIG } from '../../types/enums';

import NavigationLink from './NavigationLink';

interface DesktopNavigationProps {
  needsTermsAcceptance?: boolean;
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({ needsTermsAcceptance = false }) => (
  <div className="hidden md:ml-6 md:flex md:space-x-8">
    {NAVBAR_CONFIG.NAVIGATION.map((item) => (
      <NavigationLink key={item.name} item={item} disabled={needsTermsAcceptance} />
    ))}
  </div>
);

export default DesktopNavigation;
