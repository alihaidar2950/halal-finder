"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { restaurants, Restaurant } from "@/data/menuData";
import RestaurantCard from "@/components/RestaurantCard";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<Restaurant[]>([]);

  useEffect(() => {
    if (query) {
      const searchTerms = query.toLowerCase().split(" ");
      const filteredResults = restaurants.filter((restaurant) => {
        const nameMatch = restaurant.name.toLowerCase().includes(query.toLowerCase());
        const descriptionMatch = restaurant.description.toLowerCase().includes(query.toLowerCase());
        const cuisineMatch = restaurant.cuisineType.toLowerCase().includes(query.toLowerCase());
        
        // Check if any of the search terms match
        const termMatch = searchTerms.some(term => 
          restaurant.name.toLowerCase().includes(term) || 
          restaurant.description.toLowerCase().includes(term) ||
          restaurant.cuisineType.toLowerCase().includes(term)
        );
        
        return nameMatch || descriptionMatch || cuisineMatch || termMatch;
      });
      
      setResults(filteredResults);
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/" className="text-orange-500 hover:text-orange-600 flex items-center gap-2">
          <span>←</span> Back to Home
        </Link>
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Search Results</h1>
        <SearchBar />
      </div>
      
      <div className="mb-6">
        {query ? (
          <p className="text-gray-600">
            {results.length} results found for &quot;{query}&quot;
          </p>
        ) : (
          <p className="text-gray-600">Enter a search term to find restaurants</p>
        )}
      </div>
      
      {results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map(restaurant => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      ) : query ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl mb-2">No restaurants found</h3>
          <p className="text-gray-600 mb-4">
            We couldn&apos;t find any restaurants matching your search.
          </p>
          <Link 
            href="/"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
          >
            View All Restaurants
          </Link>
        </div>
      ) : null}
    </div>
  );
} 