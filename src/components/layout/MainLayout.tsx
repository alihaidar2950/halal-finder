'use client';

import React from 'react';
import Header from './Header';
import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {children}
      </main>
      
      <footer className="bg-black text-white p-12 border-t border-gray-800">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-2xl font-serif italic text-white mb-6">Halal Finder</h3>
              <p className="text-gray-300">
                Discover premium halal dining experiences around you with confidence and elegance.
              </p>
            </div>
            <div>
              <h4 className="text-sm uppercase tracking-wider mb-6">Navigation</h4>
              <ul className="space-y-3">
                <li><Link href="/" className="text-gray-300 hover:text-orange-300">Home</Link></li>
                <li><Link href="/about" className="text-gray-300 hover:text-orange-300">About Us</Link></li>
                <li><Link href="/#cuisines" className="text-gray-300 hover:text-orange-300">Cuisines</Link></li>
                <li><Link href="/booking" className="text-gray-300 hover:text-orange-300">Booking</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm uppercase tracking-wider mb-6">Legal</h4>
              <ul className="space-y-3">
                <li><Link href="/terms" className="text-gray-300 hover:text-orange-300">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-gray-300 hover:text-orange-300">Privacy Policy</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-orange-300">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm uppercase tracking-wider mb-6">Connect With Us</h4>
              <div className="flex space-x-4">
                <Link href="#" aria-label="Facebook" className="h-10 w-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-300 hover:text-orange-300 hover:border-orange-300">
                  <Facebook size={18} />
                </Link>
                <Link href="#" aria-label="Instagram" className="h-10 w-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-300 hover:text-orange-300 hover:border-orange-300">
                  <Instagram size={18} />
                </Link>
                <Link href="#" aria-label="Twitter" className="h-10 w-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-300 hover:text-orange-300 hover:border-orange-300">
                  <Twitter size={18} />
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} Halal Finder. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      {/* Social sidebar */}
      <div className="fixed right-0 top-1/2 transform -translate-y-1/2 flex flex-col items-center space-y-6 p-4 z-50">
        <div className="h-20 w-px bg-gray-600 mb-4"></div>
        <Link href="#" aria-label="Facebook" className="text-gray-300 hover:text-orange-300">
          <Facebook size={18} />
        </Link>
        <Link href="#" aria-label="Instagram" className="text-gray-300 hover:text-orange-300">
          <Instagram size={18} />
        </Link>
        <Link href="#" aria-label="Twitter" className="text-gray-300 hover:text-orange-300">
          <Twitter size={18} />
        </Link>
        <div className="h-20 w-px bg-gray-600 mt-4"></div>
        <div className="text-xs uppercase tracking-widest rotate-90 transform translate-y-14 text-gray-400">Social</div>
      </div>
    </div>
  );
} 