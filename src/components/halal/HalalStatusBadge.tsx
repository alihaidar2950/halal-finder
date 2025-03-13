"use client";

import React from 'react';
import { HalalStatus } from '@/data/menuData';
import { getHalalStatusLabel, getHalalStatusStyles } from '@/utils/halal/classifier';
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { UtensilsCrossed } from 'lucide-react';

interface HalalStatusBadgeProps {
  status?: HalalStatus;
  confidence?: number;
  isChain?: boolean;
  verified?: boolean;
  showConfidence?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function HalalStatusBadge({ 
  status, 
  confidence, 
  isChain = false,
  verified = false,
  showConfidence = false, 
  className = '',
  size = 'md'
}: HalalStatusBadgeProps) {
  if (!status) return null;
  
  const label = getHalalStatusLabel(status, isChain, verified);
  const styles = getHalalStatusStyles(status, isChain, verified);
  
  // Determine if this is likely a cultural/traditional halal restaurant
  const isTraditionalHalal = confidence && confidence > 0.7 && status === "fully_halal" && !isChain;
  
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };
  
  return (
    <div className={`flex items-center ${className}`}>
      <span 
        className={`${styles.bg} ${styles.text} ${sizeStyles[size]} rounded-full font-medium ${styles.border || ""} flex items-center`}
      >
        {isTraditionalHalal && size !== 'sm' && (
          <UtensilsCrossed className="inline-block mr-1 h-3 w-3" />
        )}
        {label}
        {verified && size !== 'sm' && (
          <CheckCircledIcon className="inline-block ml-1 h-3 w-3" />
        )}
      </span>
      {showConfidence && confidence !== undefined && (
        <span className="text-gray-500 text-xs ml-2">
          {(confidence * 5).toFixed(1)}★
        </span>
      )}
    </div>
  );
} 