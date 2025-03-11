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
  { id: 'mexican', name: 'Mexican', icon: '🌮' }
];

export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Halal Guys',
    description: 'Authentic American halal food with a focus on quality ingredients. Famous for their gyro sandwiches and combo platters.',
    priceRange: '$$',
    image: undefined,
    rating: 4.5,
    cuisineType: 'american',
    address: '123 Main Street, Ottawa',
    phone: '(613) 555-1234',
    coordinates: {
      lat: 45.4215,
      lng: -75.6972
    }
  },
  {
    id: '2',
    name: 'Tandoori Palace',
    description: 'Authentic Indian cuisine with a wide variety of vegetarian and non-vegetarian options. Famous for their butter chicken and biryani.',
    priceRange: '$$$',
    image: undefined,
    rating: 4.7,
    cuisineType: 'indian',
    address: '456 Bank Street, Ottawa',
    phone: '(613) 555-5678',
    coordinates: {
      lat: 45.4118,
      lng: -75.6845
    }
  },
  {
    id: '3',
    name: 'Far East',
    description: 'Pan-Asian restaurant specializing in halal versions of popular dishes from Japan, China, and Korea.',
    priceRange: '$$',
    image: undefined,
    rating: 4.3,
    cuisineType: 'asian',
    address: '789 Somerset Street, Ottawa',
    phone: '(613) 555-9012',
    coordinates: {
      lat: 45.4089,
      lng: -75.7071
    }
  },
  {
    id: '4',
    name: 'Shawarma Station',
    description: 'Fast-casual Lebanese restaurant known for their shawarma wraps and plates. Fresh ingredients and homemade sauces.',
    priceRange: '$',
    image: undefined,
    rating: 4.2,
    cuisineType: 'lebanese',
    address: '101 Rideau Street, Ottawa',
    phone: '(613) 555-3456',
    coordinates: {
      lat: 45.4292,
      lng: -75.6929
    }
  },
  {
    id: '5',
    name: 'Istanbul Grill',
    description: 'Authentic Turkish cuisine including kebabs, pide, and baklava. Family-owned with recipes passed down through generations.',
    priceRange: '$$$',
    image: undefined,
    rating: 4.8,
    cuisineType: 'turkish',
    address: '202 Elgin Street, Ottawa',
    phone: '(613) 555-7890',
    coordinates: {
      lat: 45.4184,
      lng: -75.6903
    }
  },
  {
    id: '6',
    name: 'Olive & Thyme',
    description: 'Mediterranean fusion restaurant with a focus on healthy, halal options. Known for their mezze platters and grilled seafood.',
    priceRange: '$$$',
    image: undefined,
    rating: 4.6,
    cuisineType: 'mediterranean',
    address: '303 Preston Street, Ottawa',
    phone: '(613) 555-0123',
    coordinates: {
      lat: 45.4035,
      lng: -75.7069
    }
  },
  {
    id: '7',
    name: 'Taj Mahal',
    description: 'Upscale Indian restaurant specializing in Mughlai cuisine. Known for their tandoori dishes and extensive vegetarian menu.',
    priceRange: '$$',
    image: undefined,
    rating: 4.4,
    cuisineType: 'indian',
    address: '404 Bronson Avenue, Ottawa',
    phone: '(613) 555-4567',
    coordinates: {
      lat: 45.4115,
      lng: -75.7032
    }
  },
  {
    id: '8',
    name: 'Liberty Burger',
    description: 'Gourmet halal burgers with creative toppings and homemade sauces. Also serves hand-cut fries and premium milkshakes.',
    priceRange: '$$',
    image: undefined,
    rating: 4.1,
    cuisineType: 'american',
    address: '505 Wellington Street, Ottawa',
    phone: '(613) 555-8901',
    coordinates: {
      lat: 45.4171,
      lng: -75.7128
    }
  },
  {
    id: '9',
    name: 'Cedar House',
    description: 'Traditional Lebanese restaurant offering authentic mezza, grilled meats, and fresh-baked bread. Family-style dining available.',
    priceRange: '$$',
    image: undefined,
    rating: 4.3,
    cuisineType: 'lebanese',
    address: '606 Churchill Avenue, Ottawa',
    phone: '(613) 555-2345',
    coordinates: {
      lat: 45.3977,
      lng: -75.7307
    }
  }
]; 