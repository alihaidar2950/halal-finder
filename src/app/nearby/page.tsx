"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NearbyRedirectPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the homepage since we've merged the nearby functionality there
    router.push("/");
  }, [router]);
  
  // Show a loading state while redirecting
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="animate-spin h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p>Redirecting to home page...</p>
    </div>
  );
} 