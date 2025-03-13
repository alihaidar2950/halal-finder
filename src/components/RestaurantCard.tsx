"use client";

import React from 'react';
import { Restaurant } from '@/data/menuData';
import PlaceholderImage from './PlaceholderImage';
import Link from 'next/link';
import HalalStatusBadge from './halal/HalalStatusBadge';
import { AlertTriangleIcon, Navigation } from 'lucide-react';

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
        {/* Image and Restaurant Name Overlay */}
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
          
          {/* Restaurant Name Overlay - Always Visible */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent">
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <h3 className="text-white text-lg font-bold truncate">{name}</h3>
              
              {/* Distance and Price */}
              <div className="flex justify-between items-center mt-1">
                <div className="flex items-center">
                  {formattedDistance && (
                    <span className="text-white/90 text-xs flex items-center">
                      <Navigation className="w-3 h-3 mr-1" />
                      {formattedDistance}
                    </span>
                  )}
                </div>
                <span className="text-white/90 text-sm font-medium">{priceRange}</span>
              </div>
            </div>
          </div>
          
          {/* Rating and Halal Status */}
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
            <div className="absolute bottom-3 right-3 bg-amber-100 border border-amber-300 rounded-full p-1 shadow-md">
              <AlertTriangleIcon className="h-4 w-4 text-amber-700" />
            </div>
          )}
        </div>
        
        {/* Restaurant Details */}
        <div className="p-4">
          <div className="mb-3">
            <span className="inline-block bg-orange-100 text-orange-700 rounded-full px-3 py-1 text-xs font-medium">
              {cuisineType.charAt(0).toUpperCase() + cuisineType.slice(1)}
            </span>
          </div>
          
          <div className="text-gray-600 text-sm mb-1 truncate">
            {address}
          </div>
          
          <div className="text-gray-600 text-sm">
            {phone}
          </div>
        </div>
      </div>
    </Link>
  );
} 