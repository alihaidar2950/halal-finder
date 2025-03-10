"use client";

import React, { useState } from 'react';
import { restaurants } from '../data/menuData';
import RestaurantCard from './RestaurantCard';
import CuisineFilter from './CuisineFilter';
import Link from 'next/link';

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredRestaurants.map(restaurant => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
};

export default RestaurantList; 