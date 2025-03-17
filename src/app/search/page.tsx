"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchPage() {
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
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#ffc107] border-r-transparent"></div>
        <p className="mt-4 text-gray-400">Redirecting to restaurants page...</p>
      </div>
    </div>
  );
} 