"use client";

import React from 'react';
import { Restaurant } from '../data/menuData';
import PlaceholderImage from './PlaceholderImage';
import Link from 'next/link';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md transition-transform hover:shadow-lg hover:scale-[1.01] border border-gray-700">
      <div className="relative h-60 w-full">
        <div className="absolute top-2 right-2 bg-orange-500 text-white text-sm font-bold px-2 py-1 rounded z-10">
          {restaurant.cuisineType.charAt(0).toUpperCase() + restaurant.cuisineType.slice(1)}
        </div>
        <div className="absolute top-2 left-2 bg-gray-900 bg-opacity-80 text-white px-2 py-1 rounded flex items-center z-10">
          <span className="font-bold text-yellow-400">{restaurant.priceRange}</span>
        </div>
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 rounded flex items-center z-10">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 text-yellow-500" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="ml-1">{restaurant.rating}</span>
        </div>
        <PlaceholderImage 
          name={restaurant.name} 
          className="transition-transform hover:scale-110"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-100">{restaurant.name}</h3>
        <p className="text-sm text-gray-400 mt-1 line-clamp-2">{restaurant.description}</p>
        
        <div className="mt-3 text-sm text-gray-400">
          <div className="flex items-center mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="line-clamp-1">{restaurant.address}</span>
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>{restaurant.phone}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <span className="text-orange-500 font-bold">{restaurant.cuisineType.charAt(0).toUpperCase() + restaurant.cuisineType.slice(1)}</span>
          <Link 
            href={`/restaurant/${restaurant.id}`}
            className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-xs rounded-full text-white"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard; 