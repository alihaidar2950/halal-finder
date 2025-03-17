// Define halal classification levels
export type HalalStatus = 'fully_halal' | 'halal_options' | 'halal_ingredients' | 'unknown';

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  priceRange: string;
  image?: string;
  rating: number;
  cuisineType: string;
  address: string;
  phone: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  // Additional fields from Google Places API
  website?: string;
  hours?: Array<{ day: string; hours: string }>;
  photos?: string[];
  reviews?: Array<{
    author: string;
    rating: number;
    text: string;
    time: string;
  }>;
  reviewCount?: number;
  formattedDistance?: string;
  // Halal classification
  halalStatus?: HalalStatus;
  halalConfidence?: number; // 0-1 confidence score
  isHalalVerified?: boolean; // Whether halal status has been verified
  isChainRestaurant?: boolean; // Whether this is a chain restaurant
  distance?: number; // Distance in meters
  // Cache status
  fromCache?: boolean;
}

export interface CuisineType {
  id: string;
  name: string;
  icon: string;
}

export const cuisineTypes: CuisineType[] = [
  { id: 'all', name: 'All Cuisines', icon: '🍽️' },
  { id: 'american', name: 'American', icon: '🍔' },
  { id: 'indian', name: 'Indian', icon: '🍛' },
  { id: 'mediterranean', name: 'Mediterranean', icon: '🥙' },
  { id: 'asian', name: 'Asian', icon: '🍜' },
  { id: 'lebanese', name: 'Lebanese', icon: '🧆' },
  { id: 'turkish', name: 'Turkish', icon: '🥙' },
  { id: 'italian', name: 'Italian', icon: '🍕' },
  { id: 'middle_eastern', name: 'Middle Eastern', icon: '🫓' }
];

// An empty array instead of hardcoded dummy restaurants
// Real data will be fetched from the API
export const restaurants: Restaurant[] = []; 