"use client";

import React, { useState, useEffect } from 'react';
import { restaurants, cuisineTypes } from '@/data/menuData';
import RestaurantCard from '@/components/RestaurantCard';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const cuisineParam = searchParams.get('cuisine') || 'all';

  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [selectedCuisine, setSelectedCuisine] = useState(cuisineParam);
  const [searchResults, setSearchResults] = useState(restaurants);
  
  useEffect(() => {
    // Filter restaurants based on search term and selected cuisine
    const filtered = restaurants.filter(restaurant => {
      const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           restaurant.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCuisine = selectedCuisine === 'all' || restaurant.cuisineType === selectedCuisine;
      
      return matchesSearch && matchesCuisine;
    });
    
    setSearchResults(filtered);
  }, [searchTerm, selectedCuisine]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The effect will handle updating results
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-500 mb-4">Search Halal Restaurants</h1>
          <p className="text-gray-400">Find the perfect halal restaurant for your next meal</p>
        </div>
        
        <div className="max-w-4xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by restaurant name or description"
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div className="md:w-48">
                <select
                  value={selectedCuisine}
                  onChange={(e) => setSelectedCuisine(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {cuisineTypes.map(cuisine => (
                    <option key={cuisine.id} value={cuisine.id}>
                      {cuisine.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </form>
        </div>
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">
            {searchResults.length > 0 
              ? `Found ${searchResults.length} restaurants`
              : 'No restaurants found'}
          </h2>
          <p className="text-gray-400">
            {searchTerm && `Search results for "${searchTerm}"`}
            {selectedCuisine !== 'all' && searchTerm && ' in '}
            {selectedCuisine !== 'all' && cuisineTypes.find(c => c.id === selectedCuisine)?.name}
          </p>
        </div>
        
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {searchResults.map(restaurant => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2">No matching restaurants found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search terms or filter</p>
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