import React from 'react';
import { Link } from 'react-router-dom';

import Logo from './Logo';

interface BrandLogoProps {
  needsTermsAcceptance?: boolean;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ needsTermsAcceptance = false }) => (
  <div className="flex-shrink-0 flex items-center">
    {needsTermsAcceptance ? (
      <span className="flex items-center h-16 px-2 overflow-hidden cursor-not-allowed opacity-50">
        <Logo className="w-24 sm:w-36 h-auto dark:invert" />
      </span>
    ) : (
      <Link to="/" className="flex items-center h-16 px-2 overflow-hidden">
        <Logo className="w-24 sm:w-36 h-auto dark:invert" />
      </Link>
    )}
  </div>
);

export default BrandLogo;
