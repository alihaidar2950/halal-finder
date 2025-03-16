"use client";

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { CheckCircle, Award, Shield, Globe } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        {/* Hero section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-[#ffc107]">About</span> Halal Finder
          </h1>
          <div className="w-20 h-1 bg-[#ffc107] mx-auto mb-8"></div>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Halal Finder is dedicated to helping Muslims around the world locate and enjoy authentic halal dining experiences with confidence and peace of mind.
          </p>
        </div>

        {/* Mission section */}
        <div className="grid md:grid-cols-2 gap-16 mb-24 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">
              <span className="text-[#ffc107]">Our</span> Mission
            </h2>
            <div className="h-1 w-16 bg-[#ffc107] mb-8"></div>
            <p className="text-gray-300 mb-6">
              Our mission is to create a trusted resource for Muslims seeking halal food options. We understand the importance of adhering to dietary laws and the challenge of finding authentic halal restaurants in unfamiliar locations.
            </p>
            <p className="text-gray-300 mb-6">
              We meticulously verify halal certification, preparation methods, and ingredient sourcing to provide our users with accurate and reliable information. By bridging the gap between halal restaurants and diners, we aim to make halal dining accessible to all.
            </p>
            <p className="text-gray-300">
              Whether you're a local looking for new dining experiences or a traveler in need of halal options, Halal Finder is your trusted companion for discovering delicious, authentic halal cuisine.
            </p>
          </div>
          <div className="bg-[#121212] border border-gray-800 p-8 rounded-lg">
            <h3 className="text-xl font-bold mb-6 text-[#ffc107]">Our Commitments</h3>
            <div className="space-y-6">
              <div className="flex items-start">
                <CheckCircle className="text-[#ffc107] h-6 w-6 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-2">Rigorous Verification</h4>
                  <p className="text-gray-400">We thoroughly verify halal certifications and perform regular audits to ensure continued compliance.</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="text-[#ffc107] h-6 w-6 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-2">Transparent Information</h4>
                  <p className="text-gray-400">We provide clear details about certification status, preparation methods, and any areas of concern.</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="text-[#ffc107] h-6 w-6 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-2">Community Engagement</h4>
                  <p className="text-gray-400">We actively involve the Muslim community in our verification process through reviews and feedback.</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="text-[#ffc107] h-6 w-6 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-2">Continuous Improvement</h4>
                  <p className="text-gray-400">We constantly refine our processes and expand our database to serve you better.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How it works section */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">
              <span className="text-[#ffc107]">How</span> It Works
            </h2>
            <div className="h-1 w-16 bg-[#ffc107] mx-auto mb-8"></div>
            <p className="text-gray-300 max-w-3xl mx-auto">
              Halal Finder uses a comprehensive verification system to ensure all listed restaurants meet our strict halal standards.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#121212] border border-gray-800 p-8 rounded-lg text-center">
              <div className="flex justify-center mb-6">
                <Shield className="h-14 w-14 text-[#ffc107]" />
              </div>
              <h3 className="text-xl font-bold mb-4">Verification Process</h3>
              <p className="text-gray-400">
                We verify halal certifications, inspect preparation areas, and confirm ingredient sourcing before adding a restaurant to our platform.
              </p>
            </div>

            <div className="bg-[#121212] border border-gray-800 p-8 rounded-lg text-center">
              <div className="flex justify-center mb-6">
                <Award className="h-14 w-14 text-[#ffc107]" />
              </div>
              <h3 className="text-xl font-bold mb-4">Certification Levels</h3>
              <p className="text-gray-400">
                We categorize restaurants by certification level, from fully certified to Muslim-owned, giving you complete transparency.
              </p>
            </div>

            <div className="bg-[#121212] border border-gray-800 p-8 rounded-lg text-center">
              <div className="flex justify-center mb-6">
                <Globe className="h-14 w-14 text-[#ffc107]" />
              </div>
              <h3 className="text-xl font-bold mb-4">Global Database</h3>
              <p className="text-gray-400">
                Our growing database includes thousands of verified halal restaurants across the globe, continually updated with new additions.
              </p>
            </div>
          </div>
        </div>

        {/* CTA section */}
        <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Join Our <span className="text-[#ffc107]">Community</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Help us build the world's most comprehensive halal restaurant directory. Sign up today to save favorites, leave reviews, and get personalized recommendations.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/signup" 
              className="bg-[#ffc107] hover:bg-[#e6b006] text-black px-8 py-3 rounded-md font-bold transition-colors"
            >
              Sign Up Now
            </Link>
            <Link 
              href="/contact" 
              className="bg-transparent hover:bg-white/10 text-white border border-white px-8 py-3 rounded-md font-bold transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 