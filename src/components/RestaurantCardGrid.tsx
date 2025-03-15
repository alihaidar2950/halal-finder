"use client";

import React from 'react';
import { RestaurantWithDistance } from '@/utils/locationUtils';
import RestaurantCard from './RestaurantCard';
import { Database, RefreshCw } from 'lucide-react';
import { clearCache } from '@/utils/cacheUtils';

interface RestaurantCardGridProps {
  restaurants: RestaurantWithDistance[];
  fromCache?: boolean;
  onRefresh?: () => void;
  maxDistance?: number;
}

export default function RestaurantCardGrid({ 
  restaurants, 
  fromCache = false, 
  onRefresh,
  maxDistance
}: RestaurantCardGridProps) {
  const handleClearCache = () => {
    clearCache();
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <div>
      {fromCache && (
        <div className="mb-4 bg-[#1c1c1c] border border-gray-800 rounded-lg p-3 flex justify-between items-center">
          <div className="flex items-center">
            <Database className="h-5 w-5 text-[#ffc107] mr-2" />
            <p className="text-gray-300 text-sm">Results loaded from cache</p>
          </div>
          <button 
            onClick={handleClearCache}
            className="flex items-center text-xs bg-[#2c2c2c] hover:bg-[#3c3c3c] text-gray-200 px-2 py-1 rounded"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh
          </button>
        </div>
      )}

      {maxDistance && (
        <p className="text-gray-400 mb-6 text-center">
          Showing <span className="text-[#ffc107]">{restaurants.length}</span> restaurants within <span className="text-[#ffc107]">{maxDistance}km</span>
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {restaurants.map(restaurant => (
          <div key={restaurant.id} className="relative">
            <RestaurantCard restaurant={restaurant} />
          </div>
        ))}
      </div>
    </div>
  );
} 