import { Restaurant } from "@/data/menuData";

// Function to calculate distance between two points using Haversine formula
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

// Convert degrees to radians
function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Format distance with appropriate units (km or m)
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }
  return `${distance.toFixed(1)} km`;
}

// Get current user location using browser geolocation API
export function getCurrentLocation(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        }
      );
    }
  });
}

// Type for restaurant with distance property
export interface RestaurantWithDistance extends Restaurant {
  distance: number;
}

// Filter restaurants by distance from a point
export function filterRestaurantsByDistance(
  restaurants: Restaurant[],
  userLocation: { lat: number; lng: number },
  maxDistance: number
): RestaurantWithDistance[] {
  return restaurants.filter((restaurant) => {
    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      restaurant.coordinates.lat,
      restaurant.coordinates.lng
    );
    const restaurantWithDistance = restaurant as RestaurantWithDistance;
    restaurantWithDistance.distance = distance;
    return distance <= maxDistance;
  }) as RestaurantWithDistance[];
}

// Sort restaurants by distance from a point
export function sortRestaurantsByDistance(
  restaurants: Restaurant[],
  userLocation: { lat: number; lng: number }
): RestaurantWithDistance[] {
  const restaurantsWithDistance = restaurants.map((restaurant) => {
    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      restaurant.coordinates.lat,
      restaurant.coordinates.lng
    );
    return { ...restaurant, distance };
  });

  return restaurantsWithDistance.sort((a, b) => a.distance - b.distance);
} 