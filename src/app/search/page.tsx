"use client";

import React, { useState, useEffect, Suspense } from "react";
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

function SearchContent() {
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
        let usingDefaultLocation = false;
        
        try {
          location = await getCurrentLocation();
        } catch (error) {
          // Fallback to a default location if geolocation fails
          location = { lat: 45.4215, lng: -75.6972 }; // Ottawa center
          usingDefaultLocation = true;
          console.warn("Using default location for search:", error);
        }

        // Generate a cache key for this specific search
        const radius = 40000; // 40km radius to match our largest distance filter
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
        
        // Set results with appropriate message
        setResults(apiResults);
        
        // If we're using default location, let the user know
        if (usingDefaultLocation) {
          setError("Using default location (Ottawa, Canada) for search results. Enable location services for more relevant results.");
        } else {
          setError(null);
        }
        
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
    <div className="container mx-auto px-4 py-8 min-h-screen bg-black text-white">
      <div className="mb-8">
        <Link href="/" className="text-[#ffc107] hover:text-[#e6b006] flex items-center gap-2">
          <span>←</span> Back to Home
        </Link>
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">
          <span className="text-[#ffc107]">SEARCH</span> RESULTS
        </h1>
        <div className="h-[1px] w-16 bg-gray-800 mb-6"></div>
        <SearchBar />
      </div>

      {!loading && !error && results.length > 0 && (
        <div className="mb-4 text-gray-400">
          Found <span className="text-[#ffc107]">{results.length}</span> result{results.length !== 1 ? 's' : ''} 
          {fromCache && <span className="text-gray-500 text-sm italic ml-2">(from cache)</span>}
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#ffc107] border-r-transparent"></div>
          <p className="mt-4 text-gray-400">Searching for halal restaurants...</p>
        </div>
      )}

      {error && (
        <div className="bg-[#1c1c1c] border border-red-800 text-red-400 p-4 rounded mb-8">
          <p className="font-semibold mb-2">Error</p>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      )}

      {!loading && !error && query && results.length === 0 && (
        <div className="text-center py-12 bg-[#1c1c1c] border border-gray-800 rounded-lg p-8">
          <div className="mb-4 text-4xl">🍔</div>
          <h2 className="text-xl font-semibold mb-2 text-white">No results found</h2>
          <p className="text-gray-400 mb-4">
            No matching halal restaurants found for &quot;{query}&quot;.
          </p>
          <p className="text-gray-500 text-sm">
            Try searching for different keywords or browse restaurants by cuisine.
          </p>
        </div>
      )}

      {!loading && !error && !query && (
        <div className="text-center py-12 bg-[#1c1c1c] border border-gray-800 rounded-lg p-8">
          <h2 className="text-xl font-semibold mb-2 text-white">Looking for something specific?</h2>
          <p className="text-gray-400 mb-4">
            Search for halal restaurants by name, cuisine type, or location.
          </p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8 min-h-screen bg-black text-white">
          <div className="mb-8">
            <Link href="/" className="text-[#ffc107] hover:text-[#e6b006] flex items-center gap-2">
              <span>←</span> Back to Home
            </Link>
          </div>
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-6">
              <span className="text-[#ffc107]">SEARCH</span> RESULTS
            </h1>
            <div className="h-[1px] w-16 bg-gray-800 mb-6"></div>
            <div className="h-12 bg-[#1c1c1c] border border-gray-800 rounded-none animate-pulse"></div>
          </div>
          
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#ffc107] border-r-transparent"></div>
            <p className="mt-4 text-gray-400">Loading search...</p>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
} 