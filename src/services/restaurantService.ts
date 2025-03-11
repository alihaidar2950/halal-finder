import { Restaurant } from "@/data/menuData";
import { 
  calculateDistance, 
  formatDistance, 
  RestaurantWithDistance 
} from "@/utils/locationUtils";

/**
 * Fetch nearby halal restaurants from Google Places API
 */
export async function fetchNearbyRestaurants(
  latitude: number,
  longitude: number,
  radius: number = 5000
): Promise<RestaurantWithDistance[]> {
  try {
    // Make API request to our internal endpoint that uses Google Places API
    const response = await fetch(
      `/api/restaurants?lat=${latitude}&lng=${longitude}&radius=${radius}`,
      { method: "GET" }
    );

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
    return restaurantsWithDistance.sort((a: RestaurantWithDistance, b: RestaurantWithDistance) => a.distance - b.distance);
  } catch (error) {
    console.error("Error fetching nearby restaurants:", error);
    return [];
  }
}

/**
 * Fetch restaurant details by ID (Google Place ID)
 */
export async function fetchRestaurantDetails(placeId: string): Promise<Restaurant | null> {
  try {
    // This would typically call our backend API which would then call Google Places API
    // to get detailed information about a specific place
    // For now, we'll keep this as a placeholder
    const response = await fetch(`/api/restaurants/${placeId}`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.restaurant;
  } catch (error) {
    console.error("Error fetching restaurant details:", error);
    return null;
  }
} 