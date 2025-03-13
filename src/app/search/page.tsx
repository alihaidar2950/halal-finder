"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Restaurant } from "@/data/menuData";
import RestaurantCard from "@/components/RestaurantCard";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { getCurrentLocation } from "@/utils/locationUtils";
import { 
  getFromCache, 
  saveToCache, 
  generateSearchCacheKey, 
  CACHE_EXPIRY 
} from "@/utils/cacheUtils";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setResults([]);
        setFromCache(false);
        return;
      }

      try {
        setLoading(true);
        // Get user's location
        let location;
        try {
          location = await getCurrentLocation();
        } catch {
          // Fallback to a default location if geolocation fails
          location = { lat: 45.4215, lng: -75.6972 }; // Ottawa center
        }

        // Generate a cache key for this specific search
        const radius = 20000; // 20km radius
        const cacheKey = generateSearchCacheKey(query, location.lat, location.lng, radius);
        
        // Try to get cached results first
        const cachedResults = getFromCache<Restaurant[]>(cacheKey);
        
        if (cachedResults) {
          // We have cached results, use them
          setResults(cachedResults);
          setLoading(false);
          setFromCache(true);
          return;
        }
        
        // No cached results, fetch from API
        setFromCache(false);
        
        // Fetch results from the API with the search query as the keyword
        const response = await fetch(
          `/api/restaurants?lat=${location.lat}&lng=${location.lng}&radius=${radius}&keyword=${encodeURIComponent(query)}`,
          { method: "GET" }
        );

        if (!response.ok) {
          throw new Error(`API request failed with status: ${response.status}`);
        }

        const data = await response.json();
        const apiResults = data.restaurants || [];
        
        // Save results to cache for future use
        if (apiResults.length > 0) {
          saveToCache(cacheKey, apiResults, CACHE_EXPIRY.SEARCH_RESULTS);
        }
        
        setResults(apiResults);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setError("Failed to fetch search results. Please try again.");
        setLoading(false);
        setFromCache(false);
      }
    };

    fetchSearchResults();
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
            {fromCache && <span className="ml-2 text-sm text-orange-500">(from cache)</span>}
          </p>
        ) : (
          <p className="text-gray-600">Enter a search term to find restaurants</p>
        )}
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-500 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Searching for restaurants...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-red-50 rounded-lg">
          <h3 className="text-xl mb-2 text-red-600">Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map(restaurant => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      ) : query ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl mb-2">No restaurants found</h3>
          <p className="text-gray-600 mb-4">
            We couldn&apos;t find any halal restaurants matching &quot;{query}&quot;.
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