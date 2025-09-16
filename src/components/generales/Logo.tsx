import React from 'react';
import logo from '../../assets/images/logo.png';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  width = 100, 
  height = 30 
}) => {
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