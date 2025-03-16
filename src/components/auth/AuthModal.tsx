"use client";

import { useState } from 'react';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Link from 'next/link';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectTo?: string;
}

export default function AuthModal({ isOpen, onClose, redirectTo = '/' }: AuthModalProps) {
  const router = useRouter();
  const [view, setView] = useState<'signin' | 'signup'>('signin');
  
  const handleRedirectClick = (path: string) => {
    onClose();
    router.push(path + (redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''));
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="bg-[#121212] border border-gray-800 text-white p-6 max-w-md mx-auto rounded-lg shadow-xl">
        <DialogHeader className="flex items-center justify-between">
          <DialogTitle className="text-xl font-bold">
            {view === 'signin' ? 'Sign in to continue' : 'Create an account'}
          </DialogTitle>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </DialogHeader>
        
        <div className="mt-4">
          {view === 'signin' ? (
            <>
              <p className="text-gray-400 mb-6">
                Sign in to your account to save favorites, leave reviews, and personalize your halal dining experience.
              </p>
              
              <div className="space-y-4">
                <button 
                  onClick={() => handleRedirectClick('/signin')}
                  className="w-full bg-[#ffc107] hover:bg-[#e6b006] text-black font-medium py-3 rounded-md transition-colors"
                >
                  Sign in with Email
                </button>
                
                <div className="relative flex items-center justify-center my-6">
                  <div className="border-t border-gray-700 w-full absolute"></div>
                  <span className="bg-[#121212] px-3 text-gray-500 text-sm relative">or</span>
                </div>
                
                <button 
                  onClick={() => handleRedirectClick('/signin')}
                  className="w-full bg-white hover:bg-gray-100 text-gray-800 font-medium py-3 rounded-md transition-colors flex items-center justify-center"
                >
                  <img src="/images/google-logo.svg" alt="Google" className="h-5 w-5 mr-2" />
                  Continue with Google
                </button>
              </div>
              
              <p className="mt-6 text-center text-gray-400 text-sm">
                Don&apos;t have an account?{' '}
                <button 
                  onClick={() => setView('signup')}
                  className="text-[#ffc107] hover:underline"
                >
                  Sign up
                </button>
              </p>
            </>
          ) : (
            <>
              <p className="text-gray-400 mb-6">
                Create an account to save favorites, leave reviews, and get personalized halal restaurant recommendations.
              </p>
              
              <div className="space-y-4">
                <button 
                  onClick={() => handleRedirectClick('/signup')}
                  className="w-full bg-[#ffc107] hover:bg-[#e6b006] text-black font-medium py-3 rounded-md transition-colors"
                >
                  Sign up with Email
                </button>
                
                <div className="relative flex items-center justify-center my-6">
                  <div className="border-t border-gray-700 w-full absolute"></div>
                  <span className="bg-[#121212] px-3 text-gray-500 text-sm relative">or</span>
                </div>
                
                <button 
                  onClick={() => handleRedirectClick('/signup')}
                  className="w-full bg-white hover:bg-gray-100 text-gray-800 font-medium py-3 rounded-md transition-colors flex items-center justify-center"
                >
                  <img src="/images/google-logo.svg" alt="Google" className="h-5 w-5 mr-2" />
                  Continue with Google
                </button>
              </div>
              
              <p className="mt-6 text-center text-gray-400 text-sm">
                Already have an account?{' '}
                <button 
                  onClick={() => setView('signin')}
                  className="text-[#ffc107] hover:underline"
                >
                  Sign in
                </button>
              </p>
            </>
          )}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-800 text-xs text-gray-500 text-center">
          By continuing, you agree to our{' '}
          <Link href="/terms" className="text-gray-400 hover:text-[#ffc107]">Terms of Service</Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-gray-400 hover:text-[#ffc107]">Privacy Policy</Link>.
        </div>
      </DialogContent>
    </Dialog>
  );
} 