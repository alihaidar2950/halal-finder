"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Create a separate client component to use the hooks
function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Get all current search parameters
    const params = new URLSearchParams(searchParams.toString());
    
    // Redirect to restaurants page with the same parameters
    router.replace(`/restaurants?${params.toString()}`);
  }, [router, searchParams]);
  
  // Show a loading state while redirecting
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-black text-white">
      <div className="py-16 text-center">
        <div className="animate-spin h-12 w-12 border-4 border-[#ffc107] border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="mt-4 text-gray-400">Redirecting to search results...</p>
      </div>
    </div>
  );
}

// Loading fallback component
function SearchLoading() {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-black text-white">
      <div className="py-16 text-center">
        <div className="animate-spin h-12 w-12 border-4 border-[#ffc107] border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="mt-4 text-gray-400">Loading search...</p>
      </div>
    </div>
  );
}

// Main export component with Suspense
export default function SearchPage() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchContent />
    </Suspense>
  );
} 