import { NextRequest, NextResponse } from 'next/server';
import { Client, LatLng } from '@googlemaps/google-maps-services-js';
import { Restaurant } from '@/data/menuData';
import { classifyHalalStatus } from '@/utils/halal/classifier';

const google = new Client({});

// Define halal-friendly cuisines
const HALAL_FRIENDLY_CUISINES = [
  'middle eastern',
  'lebanese',
  'turkish',
  'egyptian',
  'moroccan',
  'afghan',
  'pakistani',
  'syrian',
  'malaysian',
  'indonesian',
  'persian',
  'arab',
  'arabic'
];

// Define cuisine mappings to expand search terms
const CUISINE_MAPPINGS: Record<string, string[]> = {
  'asian': ['chinese', 'japanese', 'korean', 'thai', 'vietnamese', 'malaysian', 'indonesian', 'asian'],
  'american': ['american', 'burger', 'bbq', 'barbecue', 'steakhouse', 'diner', 'grill', 'fast food', 'hot dog', 'sandwich', 'wings'],
  'indian': ['indian', 'pakistani', 'bengali', 'south asian', 'curry', 'tandoori'],
  'mediterranean': ['greek', 'italian', 'spanish', 'mediterranean'],
  'middle eastern': ['lebanese', 'turkish', 'egyptian', 'syrian', 'arabian', 'middle eastern'],
  'lebanese': ['lebanese', 'middle eastern', 'mediterranean', 'shawarma', 'falafel'],
  'turkish': ['turkish', 'middle eastern', 'mediterranean', 'kebab', 'doner'],
  'italian': ['italian', 'pizza', 'pasta', 'mediterranean'],
  'mexican': ['mexican', 'taco', 'burrito', 'quesadilla', 'enchilada', 'tex-mex']
};

// Define cuisine-specific food indicators
// Currently not used but kept for future feature implementation
/*
const CUISINE_FOOD_INDICATORS: Record<string, string[]> = {
  'american': ['burger', 'hot dog', 'french fries', 'steak', 'bbq', 'barbecue', 'wings', 'sandwich', 'fries'],
  'asian': ['wok', 'noodle', 'sushi', 'pho', 'ramen', 'dumpling', 'dim sum', 'korean bbq', 'boba'],
  'indian': ['curry', 'tandoori', 'naan', 'biryani', 'masala', 'tikka'],
  'mediterranean': ['hummus', 'feta', 'olive', 'pita', 'gyro', 'souvlaki'],
  'middle eastern': ['shawarma', 'falafel', 'hummus', 'tahini', 'kebab', 'pita'],
  'lebanese': ['shawarma', 'falafel', 'hummus', 'tahini', 'tabbouleh'],
  'turkish': ['kebab', 'doner', 'baklava', 'kofte', 'pide'],
  'italian': ['pizza', 'pasta', 'risotto', 'gelato', 'lasagna', 'spaghetti', 'caprese'],
  'mexican': ['taco', 'burrito', 'quesadilla', 'enchilada', 'tortilla', 'guacamole', 'salsa']
};
*/

// Define common American restaurant chains to help with identification
const AMERICAN_RESTAURANT_CHAINS = [
  'mcdonald', 'burger king', 'wendy', 'subway', 'kfc', 'popeyes', 'chick-fil-a', 'chipotle',
  'taco bell', 'pizza hut', 'domino', 'papa john', 'five guys', 'shake shack', 'in-n-out',
  'hardee', 'carl\'s jr', 'arby', 'dairy queen', 'white castle', 'sonic', 'whataburger',
  'jack in the box', 'culver', 'steak n shake', 'checkers', 'rally', 'a&w', 'dunkin',
  'krispy kreme', 'tim hortons', 'waffle house', 'ihop', 'denny', 'applebee', 'chili\'s',
  'olive garden', 'outback', 'red lobster', 'texas roadhouse', 'longhorn', 'buffalo wild wings'
];

// Enhanced Cache with TTL and geo-proximity
interface CacheEntry {
  data: Restaurant[];
  timestamp: number;
  location: {
    lat: number;
    lng: number;
    radius: number;
  };
}

// Cache to store fetched restaurant data
const restaurantCache = new Map<string, CacheEntry>();

// Configure cache TTLs based on data type
const CACHE_TTL = {
  NEARBY_SEARCH: 24 * 60 * 60 * 1000, // 24 hours for nearby search
  POPULAR_LOCATIONS: 48 * 60 * 60 * 1000, // 48 hours for popular/busy locations
  RURAL_LOCATIONS: 168 * 60 * 60 * 1000, // 7 days for rural areas with fewer updates
  PLACE_DETAILS: 72 * 60 * 60 * 1000 // 72 hours for place details
};

// Maximum radius (in meters) to consider a cached result valid for a different location
const LOCATION_CACHE_RADIUS = 500;

// API rate limiting
const API_CALLS = {
  lastCalled: 0,
  minTimeBetweenCalls: 100, // ms between consecutive calls
  dailyLimit: 1000, // self-imposed daily limit to avoid excessive charges
  dailyCount: 0,
  resetDate: new Date().setHours(0, 0, 0, 0)
};

/**
 * GET handler for the restaurants API
 */
export async function GET(request: NextRequest) {
  // Get query parameters
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const radius = searchParams.get('radius') || '5000'; // Default 5km
  const keyword = searchParams.get('keyword') || 'halal restaurant';
  const pagetoken = searchParams.get('pagetoken');
  const cuisine = searchParams.get('cuisine'); // Get cuisine type if provided
  const forceRefresh = searchParams.get('refresh') === 'true';
  
  if (!lat || !lng) {
    return NextResponse.json({ error: 'Missing latitude or longitude' }, { status: 400 });
  }
  
  try {
    // Reset daily count if it's a new day
    const today = new Date().setHours(0, 0, 0, 0);
    if (today > API_CALLS.resetDate) {
      API_CALLS.dailyCount = 0;
      API_CALLS.resetDate = today;
    }
    
    // If forcing refresh, clear the cache for the current search parameters
    if (forceRefresh) {
      // Build cache key for the current request
      const cacheKey = `${lat}-${lng}-${radius}-${keyword}-${pagetoken || ''}-${cuisine || 'no_cuisine'}`;
      
      // Remove specific cached result if it exists
      restaurantCache.delete(cacheKey);
      
      // Log cache clearing for debugging
      console.log('Forcing refresh - cleared cache for:', cacheKey);
    }
    
    // Check if we've exceeded our self-imposed daily limit
    if (API_CALLS.dailyCount >= API_CALLS.dailyLimit) {
      // Return cached data or limited results if available
      const cachedResults = findClosestCachedResult(parseFloat(lat), parseFloat(lng), parseInt(radius));
      if (cachedResults) {
        return NextResponse.json({ 
          restaurants: cachedResults.data,
          fromCache: true,
          notice: "Daily API limit reached. Showing cached results."
        });
      }
      
      return NextResponse.json({ 
        error: 'Daily API limit reached. Please try again tomorrow.',
        restaurants: [] 
      }, { status: 429 });
    }
    
    // Build unique cache key based on request parameters
    // Always include cuisine parameter in the key to properly separate cuisine-specific caches
    const cacheKey = `${lat}-${lng}-${radius}-${keyword}-${pagetoken || ''}-${cuisine || 'no_cuisine'}`;
    
    // Only check cache if not forcing a refresh
    if (!forceRefresh) {
      // Check if we have a fresh cached response for the exact location
      const cachedData = restaurantCache.get(cacheKey);
      if (cachedData && (Date.now() - cachedData.timestamp < determineCacheTTL(parseFloat(lat), parseFloat(lng)))) {
        return NextResponse.json({ restaurants: cachedData.data, fromCache: true });
      }
      
      // If no exact match, try to find a nearby cached result
      // BUT ONLY if there's no cuisine filter (don't mix cuisine results)
      if (!cuisine) {
        const proximityResult = findClosestCachedResult(parseFloat(lat), parseFloat(lng), parseInt(radius));
        if (proximityResult) {
          return NextResponse.json({ restaurants: proximityResult.data, fromCache: true, proximityBased: true });
        }
      }
    } else {
      // If forcing refresh, log it for debugging
      console.log('Forcing refresh - bypassing all caching for:', cacheKey);
    }
    
    // Rate limiting: Ensure minimum time between API calls
    const now = Date.now();
    if (now - API_CALLS.lastCalled < API_CALLS.minTimeBetweenCalls) {
      await new Promise(resolve => setTimeout(resolve, API_CALLS.minTimeBetweenCalls));
    }
    API_CALLS.lastCalled = Date.now();
    API_CALLS.dailyCount++;
    
    // Modify the keyword to include cuisine if provided
    let searchKeyword = keyword;
    if (cuisine && cuisine !== 'all') {
      // Convert cuisine_name format to "cuisine name"
      const formattedCuisine = cuisine.replace(/_/g, ' ');
      
      // For specific cuisines, include the cuisine and always include halal in the search
      searchKeyword = `halal ${formattedCuisine} restaurant`;
    }
    
    // Make request to Google Places API
    const response = await google.placesNearby({
      params: {
        key: process.env.GOOGLE_MAPS_API_KEY || '',
        location: { lat: parseFloat(lat), lng: parseFloat(lng) } as LatLng,
        radius: parseInt(radius),
        keyword: searchKeyword, // Use the modified keyword
        type: 'restaurant',
        pagetoken: pagetoken || undefined
      }
    });
    
    // Transform the response to our Restaurant format
    const restaurants: Restaurant[] = await Promise.all(
      response.data.results.map(async (place) => {
        const placeDetails = await getPlaceDetails(place.place_id || '');
        
        // Combine cuisine information
        let cuisineType = (place.types || [])
          .filter(type => !['restaurant', 'food', 'establishment', 'point_of_interest'].includes(type))
          .join(', ');
          
        // Improve cuisine categorization
        if (!cuisineType) {
          // Try to extract cuisine from name or formatted address
          const nameAndAddress = `${place.name || ''} ${place.vicinity || ''}`.toLowerCase();
          
          // Check for American restaurants first (common fast food chains)
          const isAmericanChain = AMERICAN_RESTAURANT_CHAINS.some(chain => 
            nameAndAddress.includes(chain)
          );
          
          if (isAmericanChain) {
            cuisineType = "american";
          } else {
            // Check for specific cultural cuisines
            for (const cuisine of HALAL_FRIENDLY_CUISINES) {
              if (nameAndAddress.includes(cuisine)) {
                cuisineType = cuisine;
                break;
              }
            }
          }
          
          // Additional checks for American cuisine keywords if still no match
          if (!cuisineType) {
            const americanKeywords = ['burger', 'grill', 'steak', 'bbq', 'barbecue', 'wings', 'diner'];
            if (americanKeywords.some(keyword => nameAndAddress.includes(keyword))) {
              cuisineType = "american";
            }
          }
          
          // Check for other cuisine types by their characteristic keywords
          if (!cuisineType) {
            // Check for Italian cuisine
            if (['pizza', 'pasta', 'italian', 'pizzeria', 'gelato'].some(term => nameAndAddress.includes(term))) {
              cuisineType = "italian";
            } 
            // Check for Mexican cuisine
            else if (['taco', 'burrito', 'mexican', 'quesadilla', 'enchilada'].some(term => nameAndAddress.includes(term))) {
              cuisineType = "mexican";
            }
            // Check for Asian cuisine
            else if (['chinese', 'japanese', 'thai', 'sushi', 'wok', 'noodle', 'pho', 'ramen'].some(term => nameAndAddress.includes(term))) {
              cuisineType = "asian";
            } 
            // Check for Indian cuisine
            else if (['indian', 'curry', 'tandoori', 'punjabi', 'tikka'].some(term => nameAndAddress.includes(term))) {
              cuisineType = "indian";
            }
            // Check for Mediterranean cuisine
            else if (['mediterranean', 'greek', 'feta', 'hummus', 'olive'].some(term => nameAndAddress.includes(term))) {
              cuisineType = "mediterranean";
            }
          }
          
          // If still empty, set as "restaurant"
          if (!cuisineType) {
            cuisineType = "restaurant";
          }
        }

        // Extract description from reviews if any
        let description = placeDetails.editorial_summary?.overview || '';
        
        // If no editorial summary, build a description from reviews
        if (!description && placeDetails.reviews && placeDetails.reviews.length > 0) {
          const reviewTexts = placeDetails.reviews
            .slice(0, 3)
            .map(review => review.text.substring(0, 100) + '...')
            .join(' ');
          description = `User reviews: ${reviewTexts}`;
        }
        
        // Format reviews
        const reviews = placeDetails.reviews?.map(review => ({
          author: review.author_name,
          rating: review.rating,
          text: review.text,
          time: new Date((typeof review.time === 'number' ? review.time : 0) * 1000).toISOString()
        })) || [];
        
        // Get coordinates safely
        const placeLat: number = place.geometry?.location.lat || 0;
        const placeLng: number = place.geometry?.location.lng || 0;
        
        // Get user coordinates from request params
        const userLat: number = parseFloat(lat || '0');
        const userLng: number = parseFloat(lng || '0');
        
        // Calculate distance
        const distance = calculateDistance(
          userLat, 
          userLng, 
          placeLat,
          placeLng
        );
        
        // Create restaurant object
        const restaurant: Restaurant = {
          id: place.place_id || '',
          name: place.name || '',
          description,
          cuisineType: cuisineType.charAt(0).toUpperCase() + cuisineType.slice(1),
          priceRange: place.price_level ? '$'.repeat(place.price_level) : '$$',
          rating: place.rating || 0,
          address: place.vicinity || '',
          phone: placeDetails.formatted_phone_number || '',
          coordinates: {
            lat: placeLat,
            lng: placeLng
          },
          image: place.photos?.[0] ? 
            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}` : 
            undefined,
          website: placeDetails.website,
          reviews,
          reviewCount: place.user_ratings_total || 0,
          distance,
          formattedDistance: formatDistance(distance)
        };
        
        // Classify halal status
        const halalClassification = classifyHalalStatus(restaurant);
        restaurant.halalStatus = halalClassification.status;
        restaurant.halalConfidence = halalClassification.confidence;
        restaurant.isHalalVerified = halalClassification.verified;
        restaurant.isChainRestaurant = halalClassification.isChain;
        
        return restaurant;
      })
    );
    
    // For cuisine filtering, we need a more sophisticated approach
    let filteredRestaurants = restaurants;
    
    if (cuisine && cuisine !== 'all') {
      filteredRestaurants = restaurants.filter(restaurant => {
        // First check direct match with the restaurant's cuisine type
        const directMatch = restaurant.cuisineType.toLowerCase().includes(cuisine.toLowerCase());
        
        // Check if the name contains the cuisine
        const nameMatch = restaurant.name.toLowerCase().includes(cuisine.toLowerCase());
        
        // Get lowercase cuisine for consistency
        const cuisineLower = cuisine.toLowerCase();
        
        // Special handling for American restaurants - check for common American chains
        let chainMatch = false;
        if (cuisineLower === 'american') {
          const restaurantNameLower = restaurant.name.toLowerCase();
          chainMatch = AMERICAN_RESTAURANT_CHAINS.some(chain => 
            restaurantNameLower.includes(chain)
          );
        }
        
        // Special case for Asian cuisine - check subtype matching
        let subtypeMatch = false;
        if (cuisineLower === 'asian' && CUISINE_MAPPINGS['asian']) {
          subtypeMatch = CUISINE_MAPPINGS['asian'].some(subtype => 
            restaurant.cuisineType.toLowerCase().includes(subtype) || 
            restaurant.name.toLowerCase().includes(subtype)
          );
        }
        
        // Special case for Middle Eastern cuisine
        if (cuisineLower === 'middle eastern' || cuisineLower === 'middle_eastern') {
          return directMatch || 
                 nameMatch || 
                 HALAL_FRIENDLY_CUISINES.some(c => 
                   restaurant.cuisineType.toLowerCase().includes(c) ||
                   restaurant.name.toLowerCase().includes(c)
                 );
        }
        
        return directMatch || nameMatch || chainMatch || subtypeMatch;
      });
    }
    
    // Store result in cache
    if (filteredRestaurants.length > 0) {
      restaurantCache.set(cacheKey, {
        data: filteredRestaurants,
        timestamp: Date.now(),
        location: {
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          radius: parseInt(radius)
        }
      });
    }
    
    return NextResponse.json({ restaurants: filteredRestaurants });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return NextResponse.json({ error: 'Failed to fetch restaurants' }, { status: 500 });
  }
}

/**
 * Determine the appropriate cache TTL based on location
 */
function determineCacheTTL(lat: number, lng: number): number {
  // For demonstration, this is a simplified implementation
  // In a real app, you might:
  // 1. Check if location is in a predefined list of busy areas
  // 2. Check population density using another API
  // 3. Use historical data to determine update frequency
  
  // For now we'll use a simple heuristic based on coordinates
  // (This is just a placeholder - replace with actual logic)
  const isPopularLocation = Math.abs(lat) % 1 < 0.1 && Math.abs(lng) % 1 < 0.1;
  const isRuralLocation = Math.abs(lat) % 1 > 0.7 || Math.abs(lng) % 1 > 0.7;
  
  if (isPopularLocation) {
    return CACHE_TTL.POPULAR_LOCATIONS;
  } else if (isRuralLocation) {
    return CACHE_TTL.RURAL_LOCATIONS;
  } else {
    return CACHE_TTL.NEARBY_SEARCH;
  }
}

/**
 * Find the closest cached result within a reasonable proximity
 */
function findClosestCachedResult(lat: number, lng: number, requestRadius: number): CacheEntry | null {
  let closestMatch: CacheEntry | null = null;
  let minDistance = Infinity;
  
  for (const entry of restaurantCache.values()) {
    // Skip if cache entry is expired
    if (Date.now() - entry.timestamp > CACHE_TTL.RURAL_LOCATIONS) {
      continue;
    }
    
    const distance = calculateDistance(
      lat, 
      lng, 
      entry.location.lat, 
      entry.location.lng
    );
    
    // Accept cache if distance is within LOCATION_CACHE_RADIUS
    // or if it's within the larger of the request radius and cached radius
    const maxAcceptableRadius = Math.max(
      LOCATION_CACHE_RADIUS,
      Math.min(requestRadius, entry.location.radius) * 0.3
    );
    
    if (distance < maxAcceptableRadius && distance < minDistance) {
      minDistance = distance;
      closestMatch = entry;
    }
  }
  
  return closestMatch;
}

/**
 * Fetches detailed place information from Google Places API
 */
async function getPlaceDetails(placeId: string) {
  try {
    const response = await google.placeDetails({
      params: {
        key: process.env.GOOGLE_MAPS_API_KEY || '',
        place_id: placeId,
        fields: [
          'name', 'formatted_address', 'formatted_phone_number', 'website', 
          'opening_hours', 'editorial_summary', 'review', 'price_level'
        ]
      }
    });
    
    return response.data.result;
  } catch (error) {
    console.error('Error fetching place details:', error);
    return {};
  }
}

/**
 * Calculate distance between two sets of coordinates using Haversine formula
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Format distance for display
 */
function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
} 