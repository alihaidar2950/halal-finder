"use client";

import React from 'react';
import { categories, Category } from '../data/menuData';
import Link from 'next/link';

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
              ? 'bg-orange-500 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          <span className="text-xl">{category.icon}</span>
          <span>{category.name}</span>
        </button>
      ))}
      
      <Link 
        href="/menu"
        className="bg-orange-500 text-white px-6 py-2 rounded-full ml-auto hover:bg-orange-600"
      >
        View All
      </Link>
    </div>
  );
};

export default CategoryFilter; 