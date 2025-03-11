"use client";

import React from 'react';
import { cuisineTypes, restaurants } from '@/data/menuData';
import RestaurantCard from '@/components/RestaurantCard';
import Link from 'next/link';

export default function CuisinePage({ params }: { params: { type: string } }) {
  const cuisineType = params.type;
  const cuisine = cuisineTypes.find(c => c.id === cuisineType);
  
  // Filter restaurants by cuisine type
  const filteredRestaurants = restaurants.filter(restaurant => 
    restaurant.cuisineType === cuisineType
  );
  
  if (!cuisine) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-orange-500 mb-4">Cuisine Type Not Found</h1>
        <p className="mb-6">The cuisine type you&apos;re looking for doesn&apos;t exist or may have been removed.</p>
        <Link href="/" className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-full text-white">
          Back to Home
        </Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/" className="text-orange-500 hover:text-orange-600 flex items-center gap-2">
            <span>←</span> Back to Home
          </Link>
        </div>
        
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            {cuisine?.icon} {cuisine?.name} Restaurants
          </h1>
          <p className="text-gray-600">
            Discover the best {cuisine?.name} halal restaurants
          </p>
        </div>
        
        {filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map(restaurant => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl mb-2">No restaurants found</h3>
            <p className="text-gray-600">We couldn&apos;t find any {cuisine?.name} restaurants.</p>
          </div>
        )}
      </div>
    </div>
  );
} 