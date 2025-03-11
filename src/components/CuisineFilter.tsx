"use client";

import React from 'react';
import { cuisineTypes, CuisineType } from '../data/menuData';
import Link from 'next/link';

interface CuisineFilterProps {
  activeCuisine: string;
  onCuisineChange: (cuisine: string) => void;
}

const CuisineFilter: React.FC<CuisineFilterProps> = ({ 
  activeCuisine, 
  onCuisineChange 
}) => {
  return (
    <div className="flex items-center flex-wrap gap-4 justify-center mb-8">
      {cuisineTypes.map((cuisine: CuisineType) => (
        <button
          key={cuisine.id}
          onClick={() => onCuisineChange(cuisine.id)}
          className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all ${
            activeCuisine === cuisine.id
              ? 'bg-orange-500 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          <span className="text-xl">{cuisine.icon}</span>
          <span>{cuisine.name}</span>
        </button>
      ))}
    </div>
  );
};

export default CuisineFilter; 