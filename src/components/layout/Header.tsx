'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Search } from 'lucide-react';
import UserMenu from '@/components/auth/UserMenu';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-black text-white py-6 absolute top-0 left-0 right-0 z-10">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold">
            <span className="text-[#ffc107]">HALAL</span>
            <span className="text-white">FINDER</span>
          </Link>
        </div>

        {/* Desktop Navigation - Centered */}
        <nav className="hidden md:flex space-x-8 absolute left-1/2 transform -translate-x-1/2">
          <Link href="/" className="uppercase text-sm tracking-wider hover:text-[#ffc107]">HOME</Link>
          <Link href="/restaurants" className="uppercase text-sm tracking-wider hover:text-[#ffc107]">RESTAURANTS</Link>
          <Link href="/favorites" className="uppercase text-sm tracking-wider hover:text-[#ffc107]">FAVORITES</Link>
          <Link href="/about" className="uppercase text-sm tracking-wider hover:text-[#ffc107]">ABOUT</Link>
          <Link href="/contact" className="uppercase text-sm tracking-wider hover:text-[#ffc107]">CONTACT</Link>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-4">
          <Link href="/restaurants" className="hover:text-[#ffc107]">
            <Search className="h-5 w-5" />
          </Link>
          
          {/* User Menu (Desktop) */}
          <div className="hidden md:flex">
            <UserMenu />
          </div>
          
          <button
            className="md:hidden p-2 rounded-lg text-white hover:text-[#ffc107]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col">
            <div className="p-6 flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold">
                <span className="text-[#ffc107]">HALAL</span>
                <span className="text-white">FINDER</span>
              </Link>
              <button
                className="p-2 text-white hover:text-[#ffc107]"
                onClick={() => setIsMenuOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex flex-col p-6 space-y-6 items-center pt-12">
              <Link 
                href="/" 
                className="text-xl uppercase tracking-wider"
                onClick={() => setIsMenuOpen(false)}
              >
                HOME
              </Link>
              <Link 
                href="/restaurants" 
                className="text-xl uppercase tracking-wider"
                onClick={() => setIsMenuOpen(false)}
              >
                RESTAURANTS
              </Link>
              <Link 
                href="/favorites" 
                className="text-xl uppercase tracking-wider"
                onClick={() => setIsMenuOpen(false)}
              >
                FAVORITES
              </Link>
              <Link 
                href="/about" 
                className="text-xl uppercase tracking-wider"
                onClick={() => setIsMenuOpen(false)}
              >
                ABOUT
              </Link>
              <Link 
                href="/contact" 
                className="text-xl uppercase tracking-wider"
                onClick={() => setIsMenuOpen(false)}
              >
                CONTACT
              </Link>
              <div className="pt-8">
                <UserMenu />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 