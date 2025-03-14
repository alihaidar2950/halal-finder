import { Restaurant } from "@/data/menuData";
import { 
  calculateDistance, 
  formatDistance, 
  RestaurantWithDistance 
} from "@/utils/locationUtils";
import {
  getFromCache,
  saveToCache,
  generateNearbyRestaurantsCacheKey,
  CACHE_EXPIRY,
  generateRestaurantDetailsCacheKey
} from "@/utils/cacheUtils";

/**
 * Fetch nearby halal restaurants from Google Places API
 */
export async function fetchNearbyRestaurants(
  latitude: number,
  longitude: number,
  radius: number = 5000,
  forceRefresh: boolean = false,
  cuisineType?: string
): Promise<RestaurantWithDistance[]> {
  try {
    // Check if we have cached results for this location and radius
    const cacheKey = generateNearbyRestaurantsCacheKey(latitude, longitude, radius, cuisineType);
    
    // Only check cache if not forcing a refresh
    if (!forceRefresh) {
      const cachedResults = getFromCache<RestaurantWithDistance[]>(cacheKey);
      if (cachedResults) {
        console.log("Using cached nearby restaurants data");
        // Add a fromCache property to each result
        const resultsWithCacheFlag = cachedResults.map(restaurant => ({
          ...restaurant,
          fromCache: true
        }));
        return resultsWithCacheFlag;
      }
    }
    
    // No cached results or forcing refresh, fetch from API
    // Make API request to our internal endpoint that uses Google Places API
    let apiUrl = `/api/restaurants?lat=${latitude}&lng=${longitude}&radius=${radius}`;
    
    // Add cuisine type if provided
    if (cuisineType && cuisineType !== 'all') {
      apiUrl += `&cuisine=${encodeURIComponent(cuisineType)}`;
    }
    
    const response = await fetch(apiUrl, { method: "GET" });

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Calculate distance for each restaurant
    const restaurantsWithDistance = data.restaurants.map((restaurant: Restaurant) => {
      const distance = calculateDistance(
        latitude,
        longitude,
        restaurant.coordinates.lat,
        restaurant.coordinates.lng
      );
      return {
        ...restaurant,
        distance,
        formattedDistance: formatDistance(distance)
      };
    });

    // Sort by distance
    const sortedResults = restaurantsWithDistance.sort(
      (a: RestaurantWithDistance, b: RestaurantWithDistance) => a.distance - b.distance
    );
    
    // Cache the results
    if (sortedResults.length > 0) {
      saveToCache(cacheKey, sortedResults, CACHE_EXPIRY.NEARBY_RESTAURANTS);
    }
    
    return sortedResults;
  } catch (error) {
    console.error("Error fetching nearby restaurants:", error);
    return [];
  }
}

/**
 * Fetch restaurants by cuisine type
 */
export async function fetchRestaurantsByCuisine(
  latitude: number,
  longitude: number,
  cuisineType: string,
  radius: number = 10000,
  forceRefresh: boolean = false
): Promise<RestaurantWithDistance[]> {
  // Always include 'halal' in the search to ensure we get halal restaurants
  const searchResults = await fetchNearbyRestaurants(
    latitude, 
    longitude, 
    radius, 
    forceRefresh, 
    cuisineType
  );
  
  // Filter out restaurants with unknown halal status to ensure we only return
  // restaurants that are confirmed to be fully halal or have halal options
  return searchResults.filter(restaurant => 
    restaurant.halalStatus !== 'unknown'
  );
}

/**
 * Fetch restaurant details by ID (Google Place ID)
 */
export async function fetchRestaurantDetails(placeId: string): Promise<Restaurant | null> {
  try {
    // Check if we have cached details for this restaurant
    const cacheKey = generateRestaurantDetailsCacheKey(placeId);
    const cachedDetails = getFromCache<Restaurant>(cacheKey);
    
    if (cachedDetails) {
      console.log("Using cached restaurant details");
      // Add a fromCache flag for UI indicators
      return {
        ...cachedDetails,
        fromCache: true
      };
    }
    
    // No cached details, fetch from API
    // This would typically call our backend API which would then call Google Places API
    // to get detailed information about a specific place
    const response = await fetch(`/api/restaurants/${placeId}`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    const restaurantDetails = data.restaurant;
    
    // Cache the restaurant details
    if (restaurantDetails) {
      saveToCache(cacheKey, restaurantDetails, CACHE_EXPIRY.RESTAURANT_DETAILS);
    }
    
    return restaurantDetails;
  } catch (error) {
    console.error("Error fetching restaurant details:", error);
    return null;
  }
} 