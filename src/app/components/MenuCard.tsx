import React from 'react';
import { MenuItem } from '../data/menuData';
import PlaceholderImage from './PlaceholderImage';

interface MenuCardProps {
  item: MenuItem;
}

const MenuCard: React.FC<MenuCardProps> = ({ item }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md transition-transform hover:shadow-lg hover:scale-[1.01]">
      <div className="relative h-60 w-full">
        <div className="absolute top-2 right-2 bg-amber-500 text-white text-sm font-bold px-2 py-1 rounded z-10">
          New
        </div>
        <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 text-gray-800 px-2 py-1 rounded flex items-center z-10">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 text-yellow-500" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="ml-1">{item.rating}</span>
        </div>
        <PlaceholderImage 
          name={item.name} 
          className="transition-transform hover:scale-110"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-red-500 font-bold">{item.price}</span>
        </div>
      </div>
    </div>
  );
};

export default MenuCard; 