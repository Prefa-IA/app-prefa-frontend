import React from 'react';

import logo from '../../assets/images/logo.png';
import { LogoProps } from '../../types/components';

const Logo: React.FC<LogoProps> = ({ className = '', width = 100, height = 30 }) => {
  return (
    <img
      src={logo}
      alt="Logo"
      width={width}
      height={height}
      className={className}
      style={{ display: 'block' }}
    />
  );
};

export default Logo;
