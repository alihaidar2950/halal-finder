"use client";

import React from 'react';
import { restaurants, cuisineTypes } from '@/data/menuData';
import RestaurantCard from '@/components/RestaurantCard';
import Link from 'next/link';

export default function CuisinePage({ params }: { params: { type: string }}) {
  const cuisineType = params.type;
  const cuisine = cuisineTypes.find(c => c.id === cuisineType);
  
  // Filter restaurants by cuisine type
  const filteredRestaurants = restaurants.filter(r => r.cuisineType === cuisineType);
  
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
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">{cuisine.icon}</div>
          <h1 className="text-4xl font-bold mb-4 text-orange-500">{cuisine.name} Restaurants</h1>
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <Link href="/" className="hover:text-orange-400">Home</Link>
            <span>/</span>
            <Link href="/" className="hover:text-orange-400">Cuisines</Link>
            <span>/</span>
            <span>{cuisine.name}</span>
          </div>
        </div>
        
        {filteredRestaurants.length > 0 ? (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">
                Found {filteredRestaurants.length} {cuisine.name} restaurants
              </h2>
              <p className="text-gray-400">
                Discover the best {cuisine.name.toLowerCase()} halal restaurants in your area
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRestaurants.map(restaurant => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">😢</div>
            <h3 className="text-xl font-bold mb-2">No {cuisine.name} restaurants found</h3>
            <p className="text-gray-400 mb-6">
              We couldn&apos;t find any {cuisine.name.toLowerCase()} restaurants at this time
            </p>
            <Link 
              href="/"
              className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-full text-white"
            >
              View All Restaurants
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 