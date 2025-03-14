"use client";

import React from 'react';
import { Restaurant } from '@/data/menuData';
import PlaceholderImage from './PlaceholderImage';
import Link from 'next/link';
import HalalStatusBadge from './halal/HalalStatusBadge';
import { AlertTriangleIcon, Star } from 'lucide-react';

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
    image, 
    halalStatus, 
    halalConfidence,
    isHalalVerified,
    isChainRestaurant,
    formattedDistance
  } = restaurant;
  
  return (
    <Link href={`/restaurants/${id}`} className="group block">
      <div className="bg-white overflow-hidden transition-all duration-300 hover:shadow-lg">
        {/* Image */}
        <div className="aspect-[4/3] relative overflow-hidden">
          {image ? (
            <img 
              src={image} 
              alt={name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <PlaceholderImage name={name} className="w-full h-full" />
          )}
          
          {/* Distance overlay */}
          {formattedDistance && (
            <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-3 py-1">
              {formattedDistance}
            </div>
          )}
          
          {/* Halal Status */}
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
        
        {/* Restaurant Details */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg group-hover:text-amber-700 transition-colors">{name}</h3>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-amber-500 mr-1 fill-amber-500" />
              <span className="text-sm font-medium">{rating}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-sm text-gray-600">
              {cuisineType.charAt(0).toUpperCase() + cuisineType.slice(1)}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-600">{priceRange}</span>
          </div>
          
          <div className="text-gray-600 text-sm mb-1 truncate">
            {address}
          </div>
        </div>
      </div>
    </Link>
  );
} 