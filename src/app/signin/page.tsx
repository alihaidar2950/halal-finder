'use client';

import React, { Suspense } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import SignInForm from '@/components/auth/SignInForm';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

function SignInContent() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/';
  
  // Redirect to home or requested page if already logged in
  useEffect(() => {
    if (user && !isLoading) {
      router.push(redirectTo);
    }
  }, [user, isLoading, router, redirectTo]);
  
  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex justify-center items-center">
        <div className="animate-spin h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  // Only show the form if not logged in
  if (!user) {
    return (
      <div className="min-h-[70vh] flex justify-center items-center p-4">
        <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8">
          <SignInForm redirectTo={redirectTo} />
        </div>
      </div>
    );
  }
  
  // This should never be visible due to the redirect
  return null;
}

export default function SignInPage() {
  return (
    <MainLayout>
      <Suspense fallback={
        <div className="min-h-[70vh] flex justify-center items-center">
          <div className="animate-spin h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full"></div>
        </div>
      }>
        <SignInContent />
      </Suspense>
    </MainLayout>
  );
} 