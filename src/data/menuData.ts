export type Restaurant = {
  id: string;
  name: string;
  description: string;
  priceRange: string;
  image: string;
  rating: number;
  cuisineType: string;
  address: string;
  phone: string;
};

export type CuisineType = {
  id: string;
  name: string;
  icon: string;
};

export const cuisineTypes: CuisineType[] = [
  { id: 'all', name: 'All', icon: '🍽️' },
  { id: 'american', name: 'American', icon: '🍔' },
  { id: 'indian', name: 'Indian', icon: '🍛' },
  { id: 'asian', name: 'Asian', icon: '🍜' },
  { id: 'lebanese', name: 'Lebanese', icon: '🫓' },
  { id: 'turkish', name: 'Turkish', icon: '🥙' },
  { id: 'mediterranean', name: 'Mediterranean', icon: '🫒' },
];

export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Halal Guys',
    description: 'Famous for their gyro platters and white sauce. A New York institution that delivers authentic halal street food...',
    priceRange: '$$',
    image: '/images/food/burger1.jpg',
    rating: 4.8,
    cuisineType: 'american',
    address: '123 Main Street, Ottawa',
    phone: '(613) 555-1234'
  },
  {
    id: '2',
    name: 'Tandoori Fusion',
    description: 'Authentic Indian cuisine with a modern twist. Their tandoori chicken and butter chicken are must-try dishes...',
    priceRange: '$$$',
    image: '/images/food/burger2.jpg',
    rating: 4.9,
    cuisineType: 'indian',
    address: '456 Bank Street, Ottawa',
    phone: '(613) 555-5678'
  },
  {
    id: '3',
    name: 'Pho Palace',
    description: 'Delicious Vietnamese pho and other Asian specialties. Try their beef pho and spring rolls for an authentic experience...',
    priceRange: '$$',
    image: '/images/food/pizza.jpg',
    rating: 4.7,
    cuisineType: 'asian',
    address: '789 Somerset Street, Ottawa',
    phone: '(613) 555-9012'
  },
  {
    id: '4',
    name: 'Shawarma Station',
    description: 'Best shawarma in town with fresh ingredients and homemade sauces. Their chicken shawarma and falafel wraps are legendary...',
    priceRange: '$',
    image: '/images/food/soup.jpg',
    rating: 4.6,
    cuisineType: 'lebanese',
    address: '101 Rideau Street, Ottawa',
    phone: '(613) 555-3456'
  },
  {
    id: '5',
    name: 'Istanbul Grill',
    description: 'Authentic Turkish kebabs, pide, and mezze. Their mixed grill platter and baklava dessert are highly recommended...',
    priceRange: '$$$',
    image: '/images/food/momos.jpg',
    rating: 4.9,
    cuisineType: 'turkish',
    address: '202 Elgin Street, Ottawa',
    phone: '(613) 555-7890'
  },
  {
    id: '6',
    name: 'Olive & Thyme',
    description: 'Mediterranean cuisine with a focus on fresh ingredients. Try their lamb dishes and homemade hummus...',
    priceRange: '$$$',
    image: '/images/food/pancake.jpg',
    rating: 4.8,
    cuisineType: 'mediterranean',
    address: '303 Preston Street, Ottawa',
    phone: '(613) 555-0123'
  },
  {
    id: '7',
    name: 'Spice Garden',
    description: 'Flavorful Indian curries and tandoori specialties. Their biryanis and samosas are particularly popular...',
    priceRange: '$$',
    image: '/images/food/bread.jpg',
    rating: 4.5,
    cuisineType: 'indian',
    address: '404 Bronson Avenue, Ottawa',
    phone: '(613) 555-4567'
  },
  {
    id: '8',
    name: 'Burger Nation',
    description: 'Gourmet halal burgers with creative toppings. Try their signature smoky BBQ burger or the spicy jalapeño option...',
    priceRange: '$$',
    image: '/images/food/burger3.jpg',
    rating: 4.4,
    cuisineType: 'american',
    address: '505 Wellington Street, Ottawa',
    phone: '(613) 555-8901'
  },
  {
    id: '9',
    name: 'Cedar House',
    description: 'Family-owned Lebanese restaurant serving authentic recipes. Their mezze platter and grilled meats are excellent choices...',
    priceRange: '$$',
    image: '/images/food/salad.jpg',
    rating: 4.7,
    cuisineType: 'lebanese',
    address: '606 Churchill Avenue, Ottawa',
    phone: '(613) 555-2345'
  },
]; 