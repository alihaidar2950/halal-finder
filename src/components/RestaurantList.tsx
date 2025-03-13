"use client";

import React, { useState } from 'react';
import { restaurants } from '../data/menuData';
import RestaurantCard from './RestaurantCard';
import CuisineFilter from './CuisineFilter';
import Link from 'next/link';
import { MapPin, Search } from 'lucide-react';

const RestaurantList: React.FC = () => {
  const [activeCuisine, setActiveCuisine] = useState('all');

  const filteredRestaurants = activeCuisine === 'all' 
    ? restaurants 
    : restaurants.filter(restaurant => restaurant.cuisineType === activeCuisine);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold italic mb-6 text-orange-500">Halal Restaurants</h1>
        <div className="inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-full">
          <Link href="/" className="hover:text-gray-200">Home</Link>
          <span>/</span>
          <span>Restaurants</span>
        </div>
      </div>

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
        <div className="text-center py-16 bg-gray-800 rounded-lg">
          <Search className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No Restaurants Found</h2>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Try using the location search on the home page or search for specific cuisines to find halal restaurants near you.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Find Nearby Restaurants
            </Link>
            <Link href="/search" className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg flex items-center">
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