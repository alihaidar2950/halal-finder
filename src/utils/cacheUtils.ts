// Define cache types and interfaces
export interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number; // Expiry time in milliseconds
}

// Default expiry times
export const CACHE_EXPIRY = {
  SEARCH_RESULTS: 30 * 60 * 1000, // 30 minutes for search results
  NEARBY_RESTAURANTS: 15 * 60 * 1000, // 15 minutes for nearby restaurants
  RESTAURANT_DETAILS: 60 * 60 * 1000, // 1 hour for restaurant details
};

// Check if localStorage is available (client-side only)
const isLocalStorageAvailable = () => {
  if (typeof window === 'undefined') return false;
  
  try {
    // Test if localStorage is available
    const testKey = '__test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

// Save data to cache
export function saveToCache<T>(key: string, data: T, expiry: number = CACHE_EXPIRY.SEARCH_RESULTS): void {
  if (!isLocalStorageAvailable()) return;
  
  try {
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiry,
    };
    localStorage.setItem(key, JSON.stringify(cacheItem));
  } catch (error) {
    console.warn('Error saving to cache:', error);
    // If localStorage is full, clear older items
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      clearOldCacheItems();
    }
  }
}

// Get data from cache
export function getFromCache<T>(key: string): T | null {
  if (!isLocalStorageAvailable()) return null;
  
  try {
    const cachedData = localStorage.getItem(key);
    if (!cachedData) return null;

    const cacheItem: CacheItem<T> = JSON.parse(cachedData);
    const now = Date.now();
    
    // Check if cache has expired
    if (now - cacheItem.timestamp > cacheItem.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    
    return cacheItem.data;
  } catch (error) {
    console.warn('Error retrieving from cache:', error);
    return null;
  }
}

// Clear all cache
export function clearCache(): void {
  if (!isLocalStorageAvailable()) return;
  
  try {
    // Clear only our application cache keys (those prefixed with 'halal_finder_')
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('halal_finder_')) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn('Error clearing cache:', error);
  }
}

// Clear old cache items when storage is full
function clearOldCacheItems(): void {
  if (!isLocalStorageAvailable()) return;
  
  try {
    const cacheKeys = Object.keys(localStorage)
      .filter(key => key.startsWith('halal_finder_'));
    
    // Get all cache items with their timestamps
    const cacheItems = cacheKeys.map(key => {
      try {
        const item = JSON.parse(localStorage.getItem(key) || '{}');
        return { key, timestamp: item.timestamp || 0 };
      } catch {
        return { key, timestamp: 0 };
      }
    });
    
    // Sort by timestamp (oldest first) and remove oldest 25%
    cacheItems.sort((a, b) => a.timestamp - b.timestamp);
    const itemsToRemove = Math.ceil(cacheItems.length * 0.25); // Remove 25% of items
    
    cacheItems.slice(0, itemsToRemove).forEach(item => {
      localStorage.removeItem(item.key);
    });
  } catch (error) {
    console.warn('Error clearing old cache items:', error);
  }
}

// Generate a cache key for search results
export function generateSearchCacheKey(query: string, lat: number, lng: number, radius: number): string {
  // Round coordinates to 3 decimal places to allow for small variations in location
  const roundedLat = Math.round(lat * 1000) / 1000;
  const roundedLng = Math.round(lng * 1000) / 1000;
  return `halal_finder_search_${query}_${roundedLat}_${roundedLng}_${radius}`;
}

// Generate a cache key for nearby restaurants
export function generateNearbyRestaurantsCacheKey(
  lat: number, 
  lng: number, 
  radius: number,
  cuisineType?: string
): string {
  const roundedLat = Math.round(lat * 1000) / 1000;
  const roundedLng = Math.round(lng * 1000) / 1000;
  const cuisineString = cuisineType ? `_${cuisineType}` : '';
  return `halal_finder_nearby_${roundedLat}_${roundedLng}_${radius}${cuisineString}`;
}

// Generate a cache key for restaurant details
export function generateRestaurantDetailsCacheKey(restaurantId: string): string {
  return `halal_finder_restaurant_${restaurantId}`;
} 