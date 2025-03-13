"use client";

import React from 'react';
import { HalalStatus } from '@/data/menuData';
import { getHalalStatusLabel, getHalalStatusStyles } from '@/utils/halal/classifier';
import { InfoCircledIcon, CheckCircledIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';

interface HalalStatusInfoProps {
  status: HalalStatus;
  confidence: number;
  isChain?: boolean;
  verified?: boolean;
}

// Messages for different confidence levels
const confidenceText = {
  high: "This classification has high confidence based on our analysis.",
  medium: "This classification has moderate confidence but may require verification.",
  low: "This classification has low confidence. Please verify with the restaurant directly."
};

// Messages for different halal statuses
const statusExplanations = {
  fully_halal: "This establishment indicates they only serve halal food and maintain halal standards.",
  halal_options: "This establishment offers some halal food options alongside non-halal items.",
  halal_ingredients: "This establishment may use some halal ingredients, but may not be fully compliant with halal standards.",
  unknown: "We don't have enough information to determine the halal status."
};

// Chain restaurant warnings
const chainRestaurantWarning = "This is a chain restaurant. Halal status may vary by location. Please verify directly.";

// Enhanced traditional halal food explanation
const traditionalHalalExplanation = "This restaurant serves cuisine that is traditionally halal in its authentic form.";

export function HalalStatusInfo({ status, confidence, isChain = false, verified = false }: HalalStatusInfoProps) {
  const styles = getHalalStatusStyles(status, isChain, verified);
  
  // Determine confidence level text
  let confidenceLevel = "low";
  if (confidence > 0.65) {
    confidenceLevel = "high";
  } else if (confidence > 0.35) {
    confidenceLevel = "medium";
  }
  
  // Format confidence as star rating (1-5 scale)
  const starRating = (confidence * 5).toFixed(1);
  
  // Determine if this is likely a culturally halal restaurant
  const isTraditionalHalal = confidence > 0.7 && status === "fully_halal" && !isChain;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span
          className={`px-2 py-1 rounded-md text-sm font-medium ${styles.bg} ${styles.text} ${styles.border || ""}`}
        >
          {getHalalStatusLabel(status, isChain, verified)}
        </span>
        
        {verified && (
          <span className="flex items-center text-green-600 text-xs">
            <CheckCircledIcon className="mr-1 h-3 w-3" />
            Verified
          </span>
        )}
        
        <span className="text-sm text-gray-500">
          {starRating}★
        </span>
      </div>
      
      {/* Show appropriate explanation based on status */}
      <p className="text-sm text-gray-700 flex items-start">
        <InfoCircledIcon className="mr-1 h-4 w-4 shrink-0 mt-0.5 text-blue-500" />
        <span>{statusExplanations[status]}</span>
      </p>
      
      {/* Show traditional halal explanation for culturally halal restaurants */}
      {isTraditionalHalal && (
        <p className="text-sm text-green-700 flex items-start">
          <CheckCircledIcon className="mr-1 h-4 w-4 shrink-0 mt-0.5" />
          <span>{traditionalHalalExplanation}</span>
        </p>
      )}
      
      {/* Show confidence level */}
      <p className="text-sm text-gray-600">
        {confidenceText[confidenceLevel as keyof typeof confidenceText]}
      </p>
      
      {/* Show warning for chain restaurants */}
      {isChain && (
        <p className="text-sm text-amber-600 flex items-start mt-1">
          <ExclamationTriangleIcon className="mr-1 h-4 w-4 shrink-0 mt-0.5" />
          <span>{chainRestaurantWarning}</span>
        </p>
      )}
    </div>
  );
} 