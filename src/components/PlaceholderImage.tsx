"use client";

import React from 'react';

interface PlaceholderImageProps {
  name: string;
  className?: string;
}

export default function PlaceholderImage({ name, className = "" }: PlaceholderImageProps) {
  // Generate a background color based on the name
  const getColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    // Use a moderate saturation and lightness for readability
    return `hsl(${hue}, 70%, 75%)`;
  };

  // Get initials from the name
  const getInitials = (name: string) => {
    const words = name.split(' ');
    if (words.length === 1) {
      return name.substring(0, 2).toUpperCase();
    }
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  const bgColor = getColor(name);
  const initials = getInitials(name);

  return (
    <div 
      className={`flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900 text-white font-bold text-3xl ${className}`}
      style={{ background: bgColor }}
      aria-label={`Placeholder image for ${name}`}
    >
      {initials}
    </div>
  );
} 