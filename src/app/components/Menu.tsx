"use client";

import React, { useState } from 'react';
import { menuItems } from '../data/menuData';
import MenuCard from './MenuCard';
import CategoryFilter from './CategoryFilter';

const Menu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold italic mb-6 text-gray-800">Menu Style 3</h1>
        <div className="inline-flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full">
          <span>Home</span>
          <span>/</span>
          <span>Menu Style 3</span>
        </div>
      </div>

      <CategoryFilter 
        activeCategory={activeCategory} 
        onCategoryChange={setActiveCategory} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map(item => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Menu; 