"use client";

import React, { useState, useEffect } from 'react';
import { Restaurant } from '../data/menuData';
import RestaurantCard from './RestaurantCard';
import CuisineFilter from './CuisineFilter';
import Link from 'next/link';
import { MapPin, Search, Database, RefreshCw } from 'lucide-react';
import { clearCache } from '@/utils/cacheUtils';

interface RestaurantListProps {
  restaurants: Restaurant[];
  fromCache?: boolean;
  onRefresh?: () => void;
}

const RestaurantList: React.FC<RestaurantListProps> = ({ 
  restaurants: propRestaurants = [], 
  fromCache = false,
  onRefresh 
}) => {
  const [activeCuisine, setActiveCuisine] = useState('all');
  const [showCacheIndicator, setShowCacheIndicator] = useState(fromCache);

  useEffect(() => {
    setShowCacheIndicator(fromCache);
  }, [fromCache]);

  const handleClearCache = () => {
    clearCache();
    if (onRefresh) {
      onRefresh();
    }
  };

  const filteredRestaurants = activeCuisine === 'all' 
    ? propRestaurants 
    : propRestaurants.filter(restaurant => restaurant.cuisineType.toLowerCase() === activeCuisine.toLowerCase());

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-6 text-white">
          <span className="text-[#ffc107]">HALAL</span> RESTAURANTS
        </h1>
        <div className="h-[1px] w-64 bg-gray-800 mx-auto mb-6"></div>
        <div className="inline-flex items-center gap-2 text-gray-400">
          <Link href="/" className="hover:text-[#ffc107]">HOME</Link>
          <span>/</span>
          <span className="text-[#ffc107]">RESTAURANTS</span>
        </div>
      </div>

      {showCacheIndicator && (
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

      <CuisineFilter 
        activeCuisine={activeCuisine} 
        onCuisineChange={setActiveCuisine} 
      />

      {filteredRestaurants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRestaurants.map(restaurant => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#121212] border border-gray-800 rounded-lg">
          <Search className="w-16 h-16 text-[#ffc107] mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2 text-white">No Restaurants Found</h2>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Try using the location search on the home page or search for specific cuisines to find halal restaurants near you.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/" className="bg-[#ffc107] hover:bg-[#e6b006] text-black px-6 py-3 rounded-none flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Find Nearby Restaurants
            </Link>
            <Link href="/restaurants" className="bg-[#232323] hover:bg-[#343434] text-white border border-[#ffc107] px-6 py-3 rounded-none flex items-center">
              <Search className="mr-2 h-5 w-5" />
              Search All Restaurants
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantList; 