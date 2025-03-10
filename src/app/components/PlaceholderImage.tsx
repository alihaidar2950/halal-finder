import React from 'react';

interface PlaceholderImageProps {
  name: string;
  className?: string;
}

const getRandomColor = (seed: string) => {
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Generate color
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 75%)`;
};

const PlaceholderImage: React.FC<PlaceholderImageProps> = ({ 
  name,
  className = ''
}) => {
  const bgColor = getRandomColor(name);
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div
      className={`flex items-center justify-center overflow-hidden ${className}`}
      style={{ 
        backgroundColor: bgColor,
        width: '100%',
        height: '100%',
        position: 'relative'
      }}
    >
      <span className="text-white text-4xl font-bold">{initials}</span>
      <div className="absolute inset-0 bg-black opacity-20"></div>
    </div>
  );
};

export default PlaceholderImage; 