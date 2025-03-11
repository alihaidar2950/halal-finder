"use client";

import React from 'react';
import { HalalStatus } from '@/data/menuData';
import { getHalalStatusLabel, getHalalStatusStyles } from '@/utils/halal/classifier';

interface HalalStatusBadgeProps {
  status?: HalalStatus;
  confidence?: number;
  showConfidence?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function HalalStatusBadge({ 
  status, 
  confidence, 
  showConfidence = false, 
  className = '',
  size = 'md'
}: HalalStatusBadgeProps) {
  if (!status) return null;
  
  const label = getHalalStatusLabel(status);
  const styles = getHalalStatusStyles(status);
  
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };
  
  return (
    <div className={`flex items-center ${className}`}>
      <span className={`${styles.bg} ${styles.text} ${sizeStyles[size]} rounded-full font-medium`}>
        {label}
      </span>
      {showConfidence && confidence !== undefined && (
        <span className="text-gray-500 text-xs ml-2">
          Confidence: {Math.round(confidence * 100)}%
        </span>
      )}
    </div>
  );
} 