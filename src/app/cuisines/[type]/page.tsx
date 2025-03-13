"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { cuisineTypes } from '@/data/menuData';
import Link from 'next/link';
import { MapPin, Search } from 'lucide-react';

export default function CuisinePage() {
  // Use the useParams hook instead of receiving params as a prop
  const params = useParams();
  const cuisineType = params.type as string;
  
  const cuisine = cuisineTypes.find(c => c.id === cuisineType);
  
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
          <p className="text-gray-400">
            Discover the best {cuisine?.name} halal restaurants near you
          </p>
        </div>
        
        <div className="text-center py-16 bg-gray-800 rounded-lg">
          <Search className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Use Location Search</h2>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            To find {cuisine.name.toLowerCase()} halal restaurants near you, use the location search on the home page.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Find Nearby {cuisine.name} Restaurants
            </Link>
            <Link href="/search" className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg flex items-center">
              <Search className="mr-2 h-5 w-5" />
              Search All Restaurants
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 