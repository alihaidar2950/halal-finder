"use client";

import React from 'react';
import { Restaurant } from '@/data/menuData';
import PlaceholderImage from './PlaceholderImage';
import Link from 'next/link';
import HalalStatusBadge from './halal/HalalStatusBadge';
import { AlertTriangleIcon } from 'lucide-react';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const { 
    id, 
    name, 
    cuisineType, 
    priceRange, 
    rating, 
    address, 
    phone, 
    image, 
    halalStatus, 
    halalConfidence,
    isHalalVerified,
    isChainRestaurant,
    formattedDistance
  } = restaurant;
  
  return (
    <Link href={`/restaurants/${id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="h-48 relative">
          {image ? (
            <img 
              src={image} 
              alt={name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <PlaceholderImage name={name} className="w-full h-full" />
          )}
          <div className="absolute top-3 right-3 bg-orange-500 text-white font-bold py-1 px-3 rounded-full text-sm shadow-md">
            {rating} ★
          </div>
          {halalStatus && (
            <div className="absolute top-3 left-3 shadow-md">
              <HalalStatusBadge 
                status={halalStatus} 
                confidence={halalConfidence}
                isChain={isChainRestaurant}
                verified={isHalalVerified}
                size="sm" 
              />
            </div>
          )}
          
          {/* Chain restaurant warning indicator */}
          {isChainRestaurant && halalStatus === 'fully_halal' && !isHalalVerified && (
            <div className="absolute bottom-3 left-3 bg-amber-100 border border-amber-300 rounded-full p-1 shadow-md">
              <AlertTriangleIcon className="h-4 w-4 text-amber-700" />
            </div>
          )}
        </div>
        
        <div className="p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold group-hover:text-orange-500 transition-colors">{name}</h3>
            <span className="text-gray-600">{priceRange}</span>
          </div>
          
          <div className="mb-4">
            <span className="inline-block bg-orange-100 text-orange-700 rounded-full px-3 py-1 text-xs font-medium">
              {cuisineType.charAt(0).toUpperCase() + cuisineType.slice(1)}
            </span>
            {formattedDistance && (
              <span className="ml-2 text-xs text-gray-500">
                {formattedDistance}
              </span>
            )}
          </div>
          
          <div className="text-gray-500 text-sm mb-2 truncate">
            {address}
          </div>
          
          <div className="text-gray-500 text-sm">
            {phone}
          </div>
        </div>
      </div>
    </Link>
  );
} 