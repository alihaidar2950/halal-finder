"use client";

import React from 'react';
import { restaurants } from '@/data/menuData';
import Link from 'next/link';
import PlaceholderImage from '@/components/PlaceholderImage';

export default function RestaurantDetail({ params }: { params: { id: string }}) {
  const restaurant = restaurants.find(r => r.id === params.id);
  
  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-orange-500 mb-4">Restaurant Not Found</h1>
        <p className="mb-6">The restaurant you're looking for doesn't exist or may have been removed.</p>
        <Link href="/" className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-full text-white">
          Back to Home
        </Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2 h-96 relative rounded-lg overflow-hidden">
            <PlaceholderImage name={restaurant.name} className="w-full h-full" />
          </div>
          
          <div className="w-full md:w-1/2">
            <div className="flex items-center gap-4 mb-4">
              <Link href="/" className="text-orange-400 hover:underline">Home</Link>
              <span>/</span>
              <Link href="/" className="text-orange-400 hover:underline">Restaurants</Link>
              <span>/</span>
              <span>{restaurant.name}</span>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
                {restaurant.cuisineType.charAt(0).toUpperCase() + restaurant.cuisineType.slice(1)}
              </span>
              <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
                {restaurant.priceRange}
              </span>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">{restaurant.name}</h1>
            
            <div className="flex items-center mb-6">
              <div className="flex items-center mr-4">
                <svg className="w-5 h-5 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-bold">{restaurant.rating}</span>
                <span className="text-gray-400 ml-1">(142 reviews)</span>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold mb-3">About</h2>
              <p className="text-gray-300 mb-4">{restaurant.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div>
                  <h3 className="text-gray-400 mb-2">Address</h3>
                  <p className="flex items-start">
                    <svg className="w-5 h-5 mr-2 mt-1 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {restaurant.address}
                  </p>
                </div>
                <div>
                  <h3 className="text-gray-400 mb-2">Phone</h3>
                  <p className="flex items-start">
                    <svg className="w-5 h-5 mr-2 mt-1 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {restaurant.phone}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg text-white font-bold flex-1">
                Book a Table
              </button>
              <button className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg text-white font-bold flex-1">
                Add to Favorites
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 