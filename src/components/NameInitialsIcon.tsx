import React from 'react';

interface NameInitialsIconProps {
  name: string;
  size?: number;
  className?: string;
}

const NameInitialsIcon: React.FC<NameInitialsIconProps> = ({ 
  name, 
  size = 40,
  className = ''
}) => {
  const getInitials = (name: string) => {
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <div
      className={`rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4
      }}
    >
      {getInitials(name)}
    </div>
  );
};

export default NameInitialsIcon; 