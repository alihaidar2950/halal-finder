"use client";

import React from 'react';
import { HalalStatus } from '@/data/menuData';
import HalalStatusBadge from './HalalStatusBadge';
import { AlertTriangle, InfoIcon } from 'lucide-react';

interface HalalStatusInfoProps {
  status?: HalalStatus;
  confidence?: number;
}

export default function HalalStatusInfo({ status, confidence }: HalalStatusInfoProps) {
  if (!status) {
    return (
      <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
        <h2 className="text-xl font-bold mb-2 text-orange-800 flex items-center">
          <InfoIcon className="w-5 h-5 mr-2" />
          Halal Status
        </h2>
        <p className="text-orange-700 mb-4">
          This restaurant appears in search results for halal food. We recommend verifying halal status directly with the restaurant.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
      <h2 className="text-xl font-bold mb-2 text-orange-800 flex items-center">
        <InfoIcon className="w-5 h-5 mr-2" />
        Halal Status
      </h2>
      
      <div className="mb-4">
        <HalalStatusBadge 
          status={status} 
          confidence={confidence} 
          showConfidence={true} 
          size="md"
          className="mb-3"
        />
        
        <p className="text-gray-700">
          {status === 'fully_halal' && 
            'This restaurant appears to be fully halal, offering only halal food and typically does not serve alcohol.'}
          {status === 'halal_options' && 
            'This restaurant offers halal options, but may also serve non-halal items. Please confirm specific dishes with staff.'}
          {status === 'halal_ingredients' && 
            'This restaurant may use halal ingredients or can accommodate halal dietary requirements. Please verify with staff.'}
          {status === 'unknown' && 
            'The halal status of this restaurant is uncertain. We recommend confirming directly with the restaurant.'}
        </p>
      </div>
      
      <div className="text-sm text-gray-600 mt-2 flex items-start">
        <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5 text-orange-500" />
        <div>
          <p className="font-medium">Important Note:</p>
          <p>This classification is based on available information and may not be 100% accurate. Always verify halal status directly with the restaurant before dining.</p>
        </div>
      </div>
    </div>
  );
} 