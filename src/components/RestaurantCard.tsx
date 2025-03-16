"use client";

import React from 'react';
import { Restaurant } from '@/data/menuData';
import PlaceholderImage from './PlaceholderImage';
import Link from 'next/link';
import HalalStatusBadge from './halal/HalalStatusBadge';
import { AlertTriangleIcon, Star } from 'lucide-react';
import FavoriteButton from './FavoriteButton';

interface RestaurantCardProps {
  restaurant: Restaurant;
  showFavoriteButton?: boolean;
}

export default function RestaurantCard({ 
  restaurant,
  showFavoriteButton = true 
}: RestaurantCardProps) {
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
    <div className="relative group">
      <Link href={`/restaurants/${id}`} className="block">
        <div className="bg-[#121212] border border-gray-800 overflow-hidden transition-all duration-300 hover:shadow-lg">
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
              <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-3 py-1">
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
              <h3 className="font-bold text-lg text-white group-hover:text-[#ffc107] transition-colors">{name}</h3>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-[#ffc107] mr-1 fill-[#ffc107]" />
                <span className="text-sm font-medium text-white">{rating}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-sm text-gray-400">
                {cuisineType.charAt(0).toUpperCase() + cuisineType.slice(1)}
              </span>
              <span className="text-gray-600">•</span>
              <span className="text-sm text-gray-400">{priceRange}</span>
            </div>
            
            <div className="text-gray-500 text-sm mb-1 truncate">
              {address}
            </div>
          </div>
        </div>
      </Link>
      
      {/* Favorite Button */}
      {showFavoriteButton && (
        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton 
            restaurantId={id}
            size="sm"
          />
        </div>
      )}
    </div>
  );
} 