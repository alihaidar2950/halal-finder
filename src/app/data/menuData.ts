export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  rating: number;
  category: string;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
};

export const categories: Category[] = [
  { id: 'all', name: 'All', icon: '🍽️' },
  { id: 'drinks', name: 'Drinks', icon: '🥤' },
  { id: 'pizza', name: 'Pizza', icon: '🍕' },
  { id: 'soda', name: 'Soda', icon: '🥤' },
  { id: 'spicy', name: 'Spicy', icon: '🌶️' },
  { id: 'sweets', name: 'Sweets', icon: '🍰' },
];

export const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Double Patty Veg Burger',
    description: 'There are many variations of passages of Lorem Ipsum available and the...',
    price: '$40.00',
    image: '/images/food/burger1.jpg',
    rating: 5.0,
    category: 'drinks'
  },
  {
    id: '2',
    name: 'Chicken Burger',
    description: 'Nestled between two golden, toasted brioche buns, the burger boasts a symphony...',
    price: '$17.56',
    image: '/images/food/burger2.jpg',
    rating: 4.9,
    category: 'drinks'
  },
  {
    id: '3',
    name: 'Pineapple Pizza',
    description: 'Embark on a culinary journey to tropical flavor with our tantalizing...',
    price: '$24.56',
    image: '/images/food/pizza.jpg',
    rating: 5.0,
    category: 'pizza'
  },
  {
    id: '4',
    name: 'Pineapple Soup',
    description: 'Crafted with the freshest, sun-kissed pineapples, our chef masterpiece this tropical fruit...',
    price: '$11.02',
    image: '/images/food/soup.jpg',
    rating: 4.0,
    category: 'soda'
  },
  {
    id: '5',
    name: 'Momos',
    description: 'Served with love and accompanied by our signature dipping sauce, each bite...',
    price: '$30.00',
    image: '/images/food/momos.jpg',
    rating: 5.0,
    category: 'soda'
  },
  {
    id: '6',
    name: 'Pancake',
    description: 'With their airy lift in delightful taste with our fluffy, stacking delight...',
    price: '$12.20',
    image: '/images/food/pancake.jpg',
    rating: 4.8,
    category: 'sweets'
  },
  {
    id: '7',
    name: 'Honey Bread',
    description: 'Our artisanal bread is lovingly crafted using premium flour and a generous...',
    price: '$15.00',
    image: '/images/food/bread.jpg',
    rating: 4.0,
    category: 'spicy'
  },
  {
    id: '8',
    name: 'Aloo Tikki Burger',
    description: 'Whether you're a spice enthusiast or a curious palate adventurer, our Aloo...',
    price: '$50.00',
    image: '/images/food/burger3.jpg',
    rating: 4.5,
    category: 'spicy'
  },
  {
    id: '9',
    name: 'Green Salad',
    description: 'Refresh your senses with our Garden Fresh Green Salad – a vibrant...',
    price: '$45.00',
    image: '/images/food/salad.jpg',
    rating: 4.7,
    category: 'spicy'
  },
]; 