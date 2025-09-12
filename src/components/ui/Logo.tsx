import React from 'react';
import logoImage from '../../assets/Logo.png';

interface LogoProps {
  size?: 'small' | 'medium' | 'large' | 'figma';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'h-8 w-auto',
    medium: 'h-12 w-auto',
    large: 'h-16 w-auto',
    figma: 'w-[468.902px] h-[102px] flex-shrink-0'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src={logoImage} 
        alt="MunQuest Logo" 
        className={`${sizeClasses[size]} object-contain`}
      />
    </div>
  );
};

export default Logo;
