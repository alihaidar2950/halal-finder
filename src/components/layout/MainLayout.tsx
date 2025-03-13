'use client';

import React from 'react';
import Header from './Header';
import Link from 'next/link';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-black text-white p-6 border-t border-gray-800">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold text-orange-500 mb-4">Halal Finder</h3>
              <p className="text-gray-400">
                Find the best halal restaurants near you with confidence.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-orange-400">Home</Link></li>
                <li><Link href="/search" className="text-gray-400 hover:text-orange-400">Search</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-orange-400">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-orange-400">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/terms" className="text-gray-400 hover:text-orange-400">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-orange-400">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500">
            <p>© {new Date().getFullYear()} Halal Finder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 