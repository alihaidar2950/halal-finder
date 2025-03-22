import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { Restaurant, HalalStatus } from '@/data/menuData';
import { classifyHalalStatus } from '@/utils/halal/classifier';

// Cache times in milliseconds
const CACHE_TTL = {
  NEARBY_SEARCH: 7 * 24 * 60 * 60 * 1000 // 7 days for nearby search
};

// Define file-scoped caches with proper types
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// Define interfaces for Places API (New) responses
interface PlacesApiPhoto {
  name: string;
  widthPx?: number;
  heightPx?: number;
}

interface PlacesApiLocation {
  latitude: number;
  longitude: number;
}

interface PlacesApiDisplayName {
  text: string;
  languageCode?: string;
}

interface PlacesApiPlace {
  id: string;
  displayName?: PlacesApiDisplayName;
  formattedAddress?: string;
  location?: PlacesApiLocation;
  rating?: number;
  userRatingCount?: number;
  priceLevel?: number;
  types?: string[];
  photos?: PlacesApiPhoto[];
}

interface PlacesApiResult {
  places?: Array<unknown>;
}

const restaurantCache = new Map<string, CacheEntry<Restaurant[]>>();

let lastApiCallTime = 0;
const API_CALL_DELAY = 300; // 300ms between API calls to prevent rate limiting

// Google Places API (New) configuration
const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';

// Define essential field masks for reduced costs
// Documentation: https://developers.google.com/maps/documentation/places/web-service/field-masks
const PLACES_FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.location',
  'places.types',
  'places.rating',
  'places.userRatingCount',
  'places.priceLevel',
  'places.photos.name'
].join(',');

// Daily API usage tracking
const API_USAGE = {
  count: 0,
  date: new Date().toDateString(),
  limit: 500 // Self-imposed daily limit to control costs
};

// Add debug logging function to monitor API usage and costs
function logApiUsage(endpoint: string, params: Record<string, unknown>, responseStatus: number, result: PlacesApiResult) {
  // Reset counter if it's a new day
  const today = new Date().toDateString();
  if (today !== API_USAGE.date) {
    API_USAGE.count = 0;
    API_USAGE.date = today;
  }
  
  // Increment counter
  API_USAGE.count++;
  
  // Log detailed usage for monitoring
  console.log(`[API Usage] #${API_USAGE.count} | ${endpoint} | Status: ${responseStatus} | Fields: ${PLACES_FIELD_MASK.split(',').length} | Results: ${result?.places?.length || 0}`);
}

/**
 * Rate-limited API call function
 */
async function rateLimitedApiCall<T>(apiCallFn: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const timeToWait = Math.max(0, lastApiCallTime + API_CALL_DELAY - now);
  
  if (timeToWait > 0) {
    await new Promise(resolve => setTimeout(resolve, timeToWait));
  }
  
  lastApiCallTime = Date.now();
  return apiCallFn();
}

/**
 * GET handler for the restaurants API
 */
export async function GET(request: NextRequest) {
  // Get query parameters
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const radius = searchParams.get('radius') || '5000'; // Default 5km
  let keyword = searchParams.get('keyword') || '';
  const cuisine = searchParams.get('cuisine'); // Get cuisine type if provided
  const forceRefresh = searchParams.get('refresh') === 'true';
  
  if (!lat || !lng) {
    return NextResponse.json({ error: 'Missing latitude or longitude' }, { status: 400 });
  }
  
  try {
    // Build search keyword
    if (cuisine && cuisine !== 'all') {
      // Format cuisine name (replace underscores with spaces)
      const formattedCuisine = cuisine.replace(/_/g, ' ');
      
      // If we have a mapped cuisine, log it for debugging
      if (cuisine in CUISINE_MAPPINGS) {
        console.log(`Using expanded terms for ${formattedCuisine}:`, CUISINE_MAPPINGS[cuisine]);
      }
      
      // Always include "halal" in the search keyword
      keyword = keyword ? `halal ${keyword} ${formattedCuisine}` : `halal ${formattedCuisine} restaurant`;
    } else if (!keyword) {
      // Default search if no keyword or cuisine provided
      keyword = 'halal restaurant';
    } else if (!keyword.toLowerCase().includes('halal')) {
      // Add "halal" to the search if not already included
      keyword = `halal ${keyword}`;
    }
    
    // Cache key for restaurant search
    const cacheKey = `${lat}-${lng}-${radius}-${keyword}`;
    
    // Check for cached results
    if (!forceRefresh && restaurantCache.has(cacheKey)) {
      const cachedData = restaurantCache.get(cacheKey);
      if (cachedData && (Date.now() - cachedData.timestamp < CACHE_TTL.NEARBY_SEARCH)) {
        return NextResponse.json({ 
          restaurants: cachedData.data,
          fromCache: true
        });
      }
    }
    
    // Log the request for debugging
    console.log('Places API request payload:', {
      endpoint: 'https://places.googleapis.com/v1/places:searchText',
      payload: {
        textQuery: keyword,
        maxResultCount: 20,
        locationBias: {
          circle: {
            center: { 
              latitude: parseFloat(lat), 
              longitude: parseFloat(lng) 
            },
            radius: parseInt(radius)
          }
        },
        includedType: "restaurant"
      },
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': 'API_KEY_HIDDEN', // Don't log the actual key
        'X-Goog-FieldMask': PLACES_FIELD_MASK
      }
    });
    
    // Check if we've reached our self-imposed API usage limit
    const today = new Date().toDateString();
    if (today !== API_USAGE.date) {
      API_USAGE.count = 0;
      API_USAGE.date = today;
    }
    
    if (API_USAGE.count >= API_USAGE.limit) {
      console.warn(`Daily API usage limit reached (${API_USAGE.count}/${API_USAGE.limit}). Using cached data only.`);
      return NextResponse.json({ 
        error: 'Daily API limit reached',
        message: 'Please try again tomorrow or use cached data',
        restaurants: [] 
      }, { status: 429 });
    }
    
    // Make request to Google Places API (New) with rate limiting
    const response = await rateLimitedApiCall(() => 
      axios.post(
        'https://places.googleapis.com/v1/places:searchText',
        {
          textQuery: keyword,
          maxResultCount: 20,
          locationBias: {
            circle: {
              center: { 
                latitude: parseFloat(lat), 
                longitude: parseFloat(lng) 
              },
              radius: parseInt(radius)
            }
          },
          includedType: "restaurant"
        }, 
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': GOOGLE_API_KEY,
            'X-Goog-FieldMask': PLACES_FIELD_MASK
          }
        }
      )
    );
    
    // Increment API usage counter after successful call
    API_USAGE.count++;
    
    // Log the raw response for debugging
    console.log(`Debug: Places API response status: ${response.status}`);
    console.log(`Debug: Response places count: ${response.data.places?.length || 0}`);
    if (!response.data.places || response.data.places.length === 0) {
      console.log(`Debug: Empty places array or missing. Full response:`, JSON.stringify(response.data, null, 2));
    }
    
    // Log API usage metrics
    logApiUsage('places:searchText', { keyword, locationBias: true }, response.status, response.data);
    
    // Log that we received a response for debugging
    console.log(`Received ${response.data.places?.length || 0} results from Places API`);
    
    // Create restaurants with minimal detail calls
    const restaurants: Restaurant[] = await Promise.all(
      (response.data.places || []).map(async (place: PlacesApiPlace) => {
        // Extract basic info from search results to minimize Place Details calls
        const placeLat = place.location?.latitude || 0;
        const placeLng = place.location?.longitude || 0;
        const userLat = parseFloat(lat || '0');
        const userLng = parseFloat(lng || '0');
        const distance = calculateDistance(userLat, userLng, placeLat, placeLng);
        
        // Extract cuisine type from place types
        let cuisineType = (place.types || [])
          .filter((type: string) => !['restaurant', 'food', 'establishment', 'point_of_interest'].includes(type))
          .join(', ');
          
        if (!cuisineType) {
          cuisineType = "restaurant";
        }
        
        // Get the primary photo reference if available
        let photoReference = undefined;
        if (place.photos && place.photos.length > 0) {
          photoReference = place.photos[0].name;
        }
        
        // Create basic restaurant without Place Details
        const basicRestaurant: Restaurant = {
          id: place.id || '',
          name: place.displayName?.text || '',
          description: '',
          cuisineType: cuisineType.charAt(0).toUpperCase() + cuisineType.slice(1),
          priceRange: place.priceLevel ? '$'.repeat(place.priceLevel) : '$$',
          rating: place.rating || 0,
          address: place.formattedAddress || '',
          phone: '',
          coordinates: {
            lat: placeLat,
            lng: placeLng
          },
          // Use smaller image sizes to reduce bandwidth and cost (300px instead of 400px)
          // Only request the image when actually needed for display
          image: photoReference ? 
            `https://places.googleapis.com/v1/${photoReference}/media?key=${GOOGLE_API_KEY}&maxHeightPx=300&maxWidthPx=300` : 
            undefined,
          website: '',
          reviews: [],
          reviewCount: place.userRatingCount || 0,
          distance,
          formattedDistance: formatDistance(distance),
          halalStatus: 'unknown' as HalalStatus,
          halalConfidence: 0,
          isHalalVerified: false,
          isChainRestaurant: false,
          fromCache: false
        };
        
        // Classify without additional API calls
        const halalClassification = classifyHalalStatus(basicRestaurant);
        
        basicRestaurant.halalStatus = halalClassification.status;
        basicRestaurant.halalConfidence = halalClassification.confidence;
        basicRestaurant.isHalalVerified = halalClassification.verified;
        basicRestaurant.isChainRestaurant = halalClassification.isChain;
        
        return basicRestaurant;
      })
    );
    
    // Cache the results
    restaurantCache.set(cacheKey, {
      data: restaurants,
      timestamp: Date.now()
    });
    
    return NextResponse.json({ restaurants });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching restaurants:', errorMessage);
    
    // Log more detailed error info for API errors
    if (axios.isAxiosError(error) && error.response) {
      console.error('Places API error details:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        requestUrl: error.config?.url,
        requestData: error.config?.data,
        requestHeaders: error.config?.headers
      });
    } else {
      console.error('Non-Axios error:', error);
    }
    
    return NextResponse.json({ 
      error: 'Failed to fetch restaurants',
      errorDetails: errorMessage,
      restaurants: [] // Return empty array instead of error
    }, { status: 200 }); // Return 200 with empty results instead of 500
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

/**
 * Handle debugging endpoint
 */
export async function POST(request: NextRequest) {
  try {
    // Get request parameters
    const body = await request.json();
    const { location, radius, textFilter, fields, includedType } = body;
    
    if (!location) {
      return NextResponse.json({ error: 'Missing location' }, { status: 400 });
    }
    
    // Parse location
    const [lat, lng] = location.split(',');
    
    // Ensure API key is available
    if (!GOOGLE_API_KEY) {
      return NextResponse.json({ error: 'API key is not configured' }, { status: 500 });
    }
    
    // Build search keyword
    const keyword = textFilter || 'halal restaurant';
    
    // Prepare API request (correct format according to Google documentation)
    console.log('Debug: Preparing Places API POST request to searchText endpoint');
    
    const requestPayload = {
      textQuery: keyword,
      maxResultCount: 20,
      locationBias: {
        circle: {
          center: { 
            latitude: parseFloat(lat), 
            longitude: parseFloat(lng) 
          },
          radius: parseInt(radius) || 1500
        }
      },
      includedType: includedType || "restaurant"
    };
    
    // Log the request for debugging
    console.log('Places API request payload:', {
      endpoint: 'https://places.googleapis.com/v1/places:searchText',
      payload: requestPayload,
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': 'API_KEY_HIDDEN', // Don't log the actual key
        'X-Goog-FieldMask': fields || PLACES_FIELD_MASK
      }
    });
    
    // Make request to Google Places API (New) with rate limiting
    console.log('Debug: Sending request to Google Places API');
    const response = await rateLimitedApiCall(() => 
      axios.post(
        'https://places.googleapis.com/v1/places:searchText',
        requestPayload, 
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': GOOGLE_API_KEY,
            'X-Goog-FieldMask': fields || PLACES_FIELD_MASK
          }
        }
      )
    );
    
    // Increment API usage counter after successful call
    API_USAGE.count++;
    
    // Log detailed response for debugging
    console.log(`Debug: Places API response status: ${response.status}`);
    console.log(`Debug: Response has data:`, !!response.data);
    console.log(`Debug: Response has places array:`, !!response.data.places);
    console.log(`Debug: Places count:`, response.data.places?.length || 0);
    
    // Return the raw API response for debugging
    return NextResponse.json({
      debug: {
        success: true,
        requestPayload,
        responseStatus: response.status,
        responseData: response.data
      }
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in debug endpoint:', errorMessage);
    
    // Log more detailed error info for API errors
    if (axios.isAxiosError(error)) {
      console.error('Places API error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        requestUrl: error.config?.url,
        requestData: error.config?.data,
        requestHeaders: error.config?.headers
      });
      
      return NextResponse.json({ 
        error: 'Failed to fetch restaurants',
        errorDetails: errorMessage,
        debugInfo: {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          requestData: JSON.parse(error.config?.data as string || '{}')
        }
      }, { status: 200 }); // Return 200 with error details
    }
    
    return NextResponse.json({ 
      error: 'Failed to fetch restaurants',
      errorDetails: errorMessage
    }, { status: 200 }); // Return 200 with empty results instead of 500
  }
} 