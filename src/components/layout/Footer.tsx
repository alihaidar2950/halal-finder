'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white p-12 border-t border-gray-800">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-6">
              <span className="text-[#ffc107]">HALAL</span>
              <span className="text-white">FINDER</span>
            </h3>
            <p className="text-gray-300">
              Discover premium halal dining experiences around you with confidence and elegance.
            </p>
          </div>
          <div>
            <h4 className="text-[#ffc107] text-sm uppercase tracking-wider mb-6">NAVIGATION</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-gray-300 hover:text-[#ffc107]">HOME</Link></li>
              <li><Link href="/restaurants" className="text-gray-300 hover:text-[#ffc107]">RESTAURANTS</Link></li>
              <li><Link href="/favorites" className="text-gray-300 hover:text-[#ffc107]">FAVORITES</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-[#ffc107]">ABOUT</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-[#ffc107]">CONTACT</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[#ffc107] text-sm uppercase tracking-wider mb-6">CONTACT US</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-[#ffc107] mt-0.5" />
                <span className="text-gray-300">Ottawa, ON, Canada</span>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-[#ffc107]" />
                <span className="text-gray-300">alihaidar2950@gmail.com</span>
              </div>
              <div className="flex space-x-4 mt-4">
                <Link href="#" aria-label="Facebook" className="h-10 w-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-300 hover:text-[#ffc107] hover:border-[#ffc107]">
                  <Facebook size={18} />
                </Link>
                <Link href="#" aria-label="Instagram" className="h-10 w-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-300 hover:text-[#ffc107] hover:border-[#ffc107]">
                  <Instagram size={18} />
                </Link>
                <Link href="#" aria-label="Twitter" className="h-10 w-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-300 hover:text-[#ffc107] hover:border-[#ffc107]">
                  <Twitter size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Halal Finder. All rights reserved.</p>
          <div className="mt-4">
            <Link href="/terms" className="text-gray-500 hover:text-[#ffc107] mx-2">Terms of Service</Link>
            <Link href="/privacy" className="text-gray-500 hover:text-[#ffc107] mx-2">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 