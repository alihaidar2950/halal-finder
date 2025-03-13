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

// Define common American restaurant chains to help with identification
const AMERICAN_RESTAURANT_CHAINS = [
  'mcdonald', 'burger king', 'wendy', 'subway', 'kfc', 'popeyes', 'chick-fil-a', 'chipotle',
  'taco bell', 'pizza hut', 'domino', 'papa john', 'five guys', 'shake shack', 'in-n-out',
  'hardee', 'carl\'s jr', 'arby', 'dairy queen', 'white castle', 'sonic', 'whataburger',
  'jack in the box', 'culver', 'steak n shake', 'checkers', 'rally', 'a&w', 'dunkin',
  'krispy kreme', 'tim hortons', 'waffle house', 'ihop', 'denny', 'applebee', 'chili\'s',
  'olive garden', 'outback', 'red lobster', 'texas roadhouse', 'longhorn', 'buffalo wild wings'
];

// Cache to store fetched restaurant data
const restaurantCache = new Map<string, { data: Restaurant[], timestamp: number }>();
const CACHE_TTL = 3600000; // 1 hour cache TTL

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
  
  if (!lat || !lng) {
    return NextResponse.json({ error: 'Missing latitude or longitude' }, { status: 400 });
  }
  
  try {
    // Build unique cache key based on request parameters
    const cacheKey = `${lat}-${lng}-${radius}-${keyword}-${pagetoken || ''}-${cuisine || ''}`;
    
    // Check if we have a fresh cached response
    const cachedData = restaurantCache.get(cacheKey);
    if (cachedData && (Date.now() - cachedData.timestamp < CACHE_TTL)) {
      const restaurants = cachedData.data;
      return NextResponse.json({ restaurants, fromCache: true });
    }
    
    // Modify the keyword to include cuisine if provided
    let searchKeyword = keyword;
    if (cuisine && cuisine !== 'all') {
      // For specific cuisines, include the cuisine in the search
      searchKeyword = `${cuisine} ${keyword}`;
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
        
        // Check in expanded cuisine mappings
        const expandedMatch = CUISINE_MAPPINGS[cuisineLower] ? 
          CUISINE_MAPPINGS[cuisineLower].some((relatedCuisine: string) => 
            restaurant.cuisineType.toLowerCase().includes(relatedCuisine) || 
            restaurant.name.toLowerCase().includes(relatedCuisine)
          ) : false;
        
        // More advanced matching with cuisine-specific food indicators
        let specialMatch = false;
        if (CUISINE_FOOD_INDICATORS[cuisineLower]) {
          // Check for specific cuisine indicators in name/description
          specialMatch = CUISINE_FOOD_INDICATORS[cuisineLower].some(indicator => 
            restaurant.name.toLowerCase().includes(indicator) || 
            (restaurant.description ? restaurant.description.toLowerCase().includes(indicator) : false)
          );
        }
        
        // Check review texts for cuisine mentions (if available)
        let reviewMatch = false;
        if (restaurant.reviews && restaurant.reviews.length > 0) {
          reviewMatch = restaurant.reviews.some(review => {
            // Check if review mentions the cuisine directly
            if (review.text && review.text.toLowerCase().includes(cuisineLower)) {
              return true;
            }
            
            // Check if review mentions any related cuisine terms
            if (CUISINE_MAPPINGS[cuisineLower] && review.text) {
              return CUISINE_MAPPINGS[cuisineLower].some(term => 
                review.text.toLowerCase().includes(term)
              );
            }
            
            return false;
          });
        }
        
        // Return true if any match type is found
        return directMatch || nameMatch || expandedMatch || specialMatch || reviewMatch || chainMatch;
      });
    }
    
    // Store in cache with timestamp
    restaurantCache.set(cacheKey, { data: filteredRestaurants, timestamp: Date.now() });
    
    return NextResponse.json({ restaurants: filteredRestaurants, nextPageToken: response.data.next_page_token });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return NextResponse.json({ error: 'Failed to fetch restaurants' }, { status: 500 });
  }
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