"use client";

import React from 'react';
import { cuisineTypes, CuisineType } from '../data/menuData';

interface CuisineFilterProps {
  activeCuisine: string;
  onCuisineChange: (cuisine: string) => void;
}

const CuisineFilter: React.FC<CuisineFilterProps> = ({ 
  activeCuisine, 
  onCuisineChange 
}) => {
  return (
    <div className="py-8 mb-8">
      <h2 className="text-2xl font-bold text-center mb-10 text-white">
        <span className="text-[#ffc107]">MENU</span>
      </h2>
      <div className="flex items-center flex-wrap gap-8 justify-center">
        {cuisineTypes.map((cuisine: CuisineType) => (
          <button
            key={cuisine.id}
            onClick={() => onCuisineChange(cuisine.id)}
            className="group flex flex-col items-center gap-4 transition-all"
          >
            <div className={`h-20 w-20 rounded-full flex items-center justify-center border-2 transition-all ${
              activeCuisine === cuisine.id
                ? 'border-[#ffc107] bg-[#ffc107]/10'
                : 'border-gray-700 bg-[#1c1c1c] group-hover:border-[#ffc107]/50'
            }`}>
              <span className={`text-3xl ${
                activeCuisine === cuisine.id ? 'text-[#ffc107]' : 'text-white group-hover:text-[#ffc107]'
              }`}>
                {cuisine.icon}
              </span>
            </div>
            <span className={`uppercase text-xs tracking-wider ${
              activeCuisine === cuisine.id ? 'text-[#ffc107]' : 'text-gray-400 group-hover:text-[#ffc107]'
            }`}>
              {cuisine.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CuisineFilter; 