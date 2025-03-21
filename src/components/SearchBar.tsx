"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    // Log search for analytics
    console.log(`[SEARCH] User searched for: "${trimmedQuery}"`);
    
    // Don't clear cache for every search - that wastes precious API calls
    // Only add the force refresh parameter to ensure the specific search gets fresh results
    router.push(`/restaurants?q=${encodeURIComponent(trimmedQuery)}&forceRefresh=true&_=${Date.now()}`);
  };

  return (
    <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for halal restaurants, cuisines, or dishes..."
          className="w-full py-4 pl-5 pr-14 rounded-none text-white bg-[#121212] border border-gray-800 focus:border-[#ffc107] focus:ring-2 focus:ring-[#ffc107]/20 outline-none transition-all text-lg"
        />
        <button
          type="submit"
          className="absolute right-0 top-0 bottom-0 bg-[#ffc107] hover:bg-[#e6b006] text-black px-4 transition-colors"
          aria-label="Search"
        >
          <Search className="h-6 w-6" />
        </button>
      </div>
    </form>
  );
} 