'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Search } from 'lucide-react';
import UserMenu from '@/components/auth/UserMenu';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-black bg-opacity-80 text-white py-6 absolute top-0 left-0 right-0 z-10">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-serif italic text-white">
            Halal Finder
          </Link>
        </div>

        {/* Desktop Navigation - Centered */}
        <nav className="hidden md:flex space-x-12 absolute left-1/2 transform -translate-x-1/2">
          <Link href="/" className="uppercase text-sm tracking-wider hover:text-orange-300">Home</Link>
          <Link href="/about" className="uppercase text-sm tracking-wider hover:text-orange-300">About</Link>
          <Link href="/#cuisines" className="uppercase text-sm tracking-wider hover:text-orange-300">Menu</Link>
          <Link href="/booking" className="uppercase text-sm tracking-wider hover:text-orange-300">Booking</Link>
          <Link href="/contact" className="uppercase text-sm tracking-wider hover:text-orange-300">Contacts</Link>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-4">
          <Link href="/search" className="hover:text-orange-300">
            <Search className="h-5 w-5" />
          </Link>
          
          {/* User Menu (Desktop) */}
          <div className="hidden md:flex">
            <UserMenu />
          </div>
          
          <button
            className="md:hidden p-2 rounded-lg text-white hover:text-orange-300"
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
              <Link href="/" className="text-2xl font-serif italic text-white">
                Halal Finder
              </Link>
              <button
                className="p-2 text-white hover:text-orange-300"
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
                Home
              </Link>
              <Link 
                href="/about" 
                className="text-xl uppercase tracking-wider"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/#cuisines" 
                className="text-xl uppercase tracking-wider"
                onClick={() => setIsMenuOpen(false)}
              >
                Menu
              </Link>
              <Link 
                href="/booking" 
                className="text-xl uppercase tracking-wider"
                onClick={() => setIsMenuOpen(false)}
              >
                Booking
              </Link>
              <Link 
                href="/contact" 
                className="text-xl uppercase tracking-wider"
                onClick={() => setIsMenuOpen(false)}
              >
                Contacts
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