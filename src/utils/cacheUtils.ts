// Define cache types and interfaces
export interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number; // Expiry time in milliseconds
  location?: {
    lat: number;
    lng: number;
    radius: number;
  };
}

// Default expiry times - significantly increased to reduce API calls
export const CACHE_EXPIRY = {
  SEARCH_RESULTS: 6 * 60 * 60 * 1000, // 6 hours for search results (was 30 minutes)
  NEARBY_RESTAURANTS: 24 * 60 * 60 * 1000, // 24 hours for nearby restaurants (was 15 minutes)
  RESTAURANT_DETAILS: 72 * 60 * 60 * 1000, // 72 hours for restaurant details (was 1 hour)
  POPULAR_LOCATIONS: 12 * 60 * 60 * 1000, // 12 hours for busy urban areas
  RURAL_LOCATIONS: 7 * 24 * 60 * 60 * 1000, // 1 week for rural areas
};

// Maximum storage size to target in bytes (5MB)
const MAX_CACHE_SIZE = 5 * 1024 * 1024;

// Cache hit/miss statistics for monitoring
interface CacheStats {
  hits: number;
  misses: number;
  saved: number; // Estimated API calls saved
}

export const cacheStats: CacheStats = {
  hits: 0,
  misses: 0,
  saved: 0
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

/**
 * Estimate the size of a string in bytes
 */
function getStringByteSize(str: string): number {
  // A quick approximation - 2 bytes per character for UTF-16
  return str.length * 2;
}

/**
 * Save data to cache with improved error handling and size management
 */
export function saveToCache<T>(key: string, data: T, expiry: number = CACHE_EXPIRY.SEARCH_RESULTS, location?: {lat: number, lng: number, radius: number}): void {
  if (!isLocalStorageAvailable()) return;
  
  try {
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiry,
      location
    };
    
    const serialized = JSON.stringify(cacheItem);
    const byteSize = getStringByteSize(serialized);
    
    // Skip storing extremely large items
    if (byteSize > MAX_CACHE_SIZE * 0.25) {
      console.warn(`Cache item too large (${Math.round(byteSize/1024)}KB), skipping storage`);
      return;
    }
    
    localStorage.setItem(key, serialized);
    
    // After saving, check if we need to clean up old items
    manageCacheSize();
    
  } catch (error) {
    console.warn('Error saving to cache:', error);
    // If localStorage is full, clear older items
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      clearOldCacheItems(0.5); // Clear 50% of items if we hit quota
    }
  }
}

/**
 * Get data from cache with extended features
 */
export function getFromCache<T>(key: string): T | null {
  if (!isLocalStorageAvailable()) return null;
  
  try {
    const cachedData = localStorage.getItem(key);
    if (!cachedData) {
      cacheStats.misses++;
      return null;
    }

    const cacheItem: CacheItem<T> = JSON.parse(cachedData);
    const now = Date.now();
    
    // Check if cache has expired
    if (now - cacheItem.timestamp > cacheItem.expiry) {
      localStorage.removeItem(key);
      cacheStats.misses++;
      return null;
    }
    
    // Track cache hit statistics
    cacheStats.hits++;
    cacheStats.saved++;
    
    return cacheItem.data;
  } catch (error) {
    console.warn('Error retrieving from cache:', error);
    cacheStats.misses++;
    return null;
  }
}

/**
 * Find a cache item within proximity of given coordinates
 */
export function getNearbyCachedItem<T>(
  lat: number, 
  lng: number, 
  radius: number, 
  keyPattern: string
): T | null {
  if (!isLocalStorageAvailable()) return null;
  
  try {
    const radiusInMeters = radius || 500; // Default 500m
    let nearestMatch: T | null = null;
    let minDistance = Infinity;
    
    // Scan all cache items with matching pattern
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith(keyPattern)) continue;
      
      const cachedData = localStorage.getItem(key);
      if (!cachedData) continue;
      
      try {
        const cacheItem: CacheItem<T> = JSON.parse(cachedData);
        
        // Skip if expired
        if (Date.now() - cacheItem.timestamp > cacheItem.expiry) {
          localStorage.removeItem(key);
          continue;
        }
        
        // Skip if location data missing
        if (!cacheItem.location) continue;
        
        const distance = calculateDistance(
          lat, 
          lng, 
          cacheItem.location.lat, 
          cacheItem.location.lng
        );
        
        // Accept if within reasonable distance
        const maxRadius = Math.min(radiusInMeters, cacheItem.location.radius);
        if (distance < maxRadius && distance < minDistance) {
          minDistance = distance;
          nearestMatch = cacheItem.data;
        }
      } catch (_) {
        continue; // Skip invalid items
      }
    }
    
    if (nearestMatch) {
      cacheStats.hits++;
      cacheStats.saved++;
      return nearestMatch;
    }
    
    cacheStats.misses++;
    return null;
    
  } catch (error) {
    console.warn('Error retrieving nearby cache item:', error);
    return null;
  }
}

/**
 * Clear all cache
 */
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

/**
 * Manage cache size to avoid hitting storage limits
 */
function manageCacheSize(): void {
  if (!isLocalStorageAvailable()) return;
  
  try {
    // Estimate current cache size
    let totalSize = 0;
    const cacheItems: {key: string, size: number, timestamp: number}[] = [];
    
    // Calculate size of all cache items
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith('halal_finder_')) continue;
      
      const value = localStorage.getItem(key);
      if (!value) continue;
      
      const size = getStringByteSize(value);
      totalSize += size;
      
      // Extract timestamp for sorting
      try {
        const parsed = JSON.parse(value);
        cacheItems.push({
          key,
          size,
          timestamp: parsed.timestamp || 0
        });
      } catch {
        cacheItems.push({
          key,
          size,
          timestamp: 0
        });
      }
    }
    
    // If we're using more than 80% of our target size, clear older items
    if (totalSize > MAX_CACHE_SIZE * 0.8) {
      // Sort by timestamp (oldest first)
      cacheItems.sort((a, b) => a.timestamp - b.timestamp);
      
      const sizeToFree = totalSize - (MAX_CACHE_SIZE * 0.6); // Target 60% usage
      let freedSize = 0;
      
      // Remove oldest items until we've freed enough space
      for (const item of cacheItems) {
        localStorage.removeItem(item.key);
        freedSize += item.size;
        if (freedSize >= sizeToFree) break;
      }
    }
  } catch (error) {
    console.warn('Error managing cache size:', error);
  }
}

/**
 * Clear old cache items when storage is full
 */
function clearOldCacheItems(percentToClear: number = 0.25): void {
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
    
    // Sort by timestamp (oldest first) and remove oldest items
    cacheItems.sort((a, b) => a.timestamp - b.timestamp);
    const itemsToRemove = Math.ceil(cacheItems.length * percentToClear);
    
    cacheItems.slice(0, itemsToRemove).forEach(item => {
      localStorage.removeItem(item.key);
    });
  } catch (error) {
    console.warn('Error clearing old cache items:', error);
  }
}

/**
 * Calculate distance between two coordinates in meters
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
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

// Generate cache key for specific region
export function generateRegionCacheKey(
  neLat: number, 
  neLng: number, 
  swLat: number, 
  swLng: number
): string {
  // Round coordinates to 2 decimal places for region caching
  const roundedNeLat = Math.round(neLat * 100) / 100;
  const roundedNeLng = Math.round(neLng * 100) / 100;
  const roundedSwLat = Math.round(swLat * 100) / 100;
  const roundedSwLng = Math.round(swLng * 100) / 100;
  return `halal_finder_region_${roundedNeLat}_${roundedNeLng}_${roundedSwLat}_${roundedSwLng}`;
}