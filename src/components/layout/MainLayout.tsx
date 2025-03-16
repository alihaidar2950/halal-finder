'use client';

import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24">
        {children}
      </main>
      
      <Footer />
      
      {/* Social links */}
      <div className="fixed right-0 top-32 transform -translate-y-1/2 flex flex-col items-center space-y-6 p-4 z-40">
        <div className="h-px w-4 bg-gray-600 my-2"></div>
        <Link href="#" aria-label="Facebook" className="text-gray-300 hover:text-[#ffc107]">
          <Facebook size={16} />
        </Link>
        <Link href="#" aria-label="Instagram" className="text-gray-300 hover:text-[#ffc107]">
          <Instagram size={16} />
        </Link>
        <Link href="#" aria-label="Twitter" className="text-gray-300 hover:text-[#ffc107]">
          <Twitter size={16} />
        </Link>
      </div>
    </div>
  );
} 