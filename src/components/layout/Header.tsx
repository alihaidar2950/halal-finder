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
        <nav className="hidden md:flex space-x-12 absolute left-1/2 transform -translate-x-1/2">
          <Link href="/" className="uppercase text-sm tracking-wider hover:text-[#ffc107]">HOME</Link>
          <div className="relative group">
            <Link href="/cuisines" className="uppercase text-sm tracking-wider hover:text-[#ffc107] flex items-center">
              MENU
            </Link>
            <div className="absolute hidden group-hover:block bg-black bg-opacity-90 min-w-[150px] p-4 mt-2">
              <Link href="/cuisines/lunch" className="block text-sm tracking-wider py-2 hover:text-[#ffc107]">LUNCH</Link>
              <Link href="/cuisines/main" className="block text-sm tracking-wider py-2 hover:text-[#ffc107]">MAIN</Link>
              <Link href="/cuisines/bar" className="block text-sm tracking-wider py-2 hover:text-[#ffc107]">BAR</Link>
            </div>
          </div>
          <Link href="/promotions" className="uppercase text-sm tracking-wider hover:text-[#ffc107]">PROMOTIONS</Link>
          <Link href="/events" className="uppercase text-sm tracking-wider hover:text-[#ffc107]">EVENTS</Link>
          <Link href="/gallery" className="uppercase text-sm tracking-wider hover:text-[#ffc107]">GALLERY</Link>
          <Link href="/booking" className="uppercase text-sm tracking-wider hover:text-[#ffc107]">BOOKING</Link>
          <Link href="/contact" className="uppercase text-sm tracking-wider hover:text-[#ffc107]">CONTACT</Link>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-4">
          <Link href="/search" className="hover:text-[#ffc107]">
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
              <div className="relative">
                <Link 
                  href="/cuisines" 
                  className="text-xl uppercase tracking-wider"
                  onClick={() => setIsMenuOpen(false)}
                >
                  MENU
                </Link>
                <div className="py-2 space-y-2 mt-2">
                  <Link 
                    href="/cuisines/lunch" 
                    className="block text-gray-300 text-sm hover:text-[#ffc107]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    LUNCH
                  </Link>
                  <Link 
                    href="/cuisines/main" 
                    className="block text-gray-300 text-sm hover:text-[#ffc107]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    MAIN
                  </Link>
                  <Link 
                    href="/cuisines/bar" 
                    className="block text-gray-300 text-sm hover:text-[#ffc107]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    BAR
                  </Link>
                </div>
              </div>
              <Link 
                href="/promotions" 
                className="text-xl uppercase tracking-wider"
                onClick={() => setIsMenuOpen(false)}
              >
                PROMOTIONS
              </Link>
              <Link 
                href="/events" 
                className="text-xl uppercase tracking-wider"
                onClick={() => setIsMenuOpen(false)}
              >
                EVENTS
              </Link>
              <Link 
                href="/gallery" 
                className="text-xl uppercase tracking-wider"
                onClick={() => setIsMenuOpen(false)}
              >
                GALLERY
              </Link>
              <Link 
                href="/booking" 
                className="text-xl uppercase tracking-wider"
                onClick={() => setIsMenuOpen(false)}
              >
                BOOKING
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