"use client";

import React from 'react';
import { categories, Category } from '../data/menuData';

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  activeCategory, 
  onCategoryChange 
}) => {
  return (
    <div className="flex items-center flex-wrap gap-4 justify-center mb-8">
      {categories.map((category: Category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all ${
            activeCategory === category.id
              ? 'bg-red-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span className="text-xl">{category.icon}</span>
          <span>{category.name}</span>
        </button>
      ))}
      
      <button 
        className="bg-red-500 text-white px-6 py-2 rounded-full ml-auto"
      >
        View All
      </button>
    </div>
  );
};

export default CategoryFilter; 