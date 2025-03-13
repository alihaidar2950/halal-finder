'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import UserMenu from '@/components/auth/UserMenu';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-black text-white p-4 border-b border-gray-800">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-orange-500">
            Halal Finder
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-400 hover:bg-gray-800"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-orange-400">Home</Link>
          <Link href="/search" className="hover:text-orange-400">Search</Link>
          <Link href="/#cuisines" className="hover:text-orange-400">Cuisines</Link>
          <Link href="/about" className="hover:text-orange-400">About</Link>
        </nav>

        {/* User Menu (Desktop) */}
        <div className="hidden md:flex">
          <UserMenu />
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col">
            <div className="p-4 flex justify-between items-center border-b border-gray-800">
              <Link href="/" className="text-2xl font-bold text-orange-500">
                Halal Finder
              </Link>
              <button
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex flex-col p-4 space-y-4">
              <Link 
                href="/" 
                className="text-xl py-2 border-b border-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/search" 
                className="text-xl py-2 border-b border-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Search
              </Link>
              <Link 
                href="/#cuisines" 
                className="text-xl py-2 border-b border-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Cuisines
              </Link>
              <Link 
                href="/about" 
                className="text-xl py-2 border-b border-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <div className="pt-4">
                <UserMenu />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 