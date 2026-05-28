"use client";

import React from "react";

type Filter = "all" | "cryptocurrency" | "favorite" | "defi" | "meme" | "hot";

interface FilterBarProps {
  active: Filter;
  onChange: (f: Filter) => void;
}

const filters: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "cryptocurrency", label: "Cryptocurrency" },
  { key: "favorite", label: "Favorites" },
  { key: "defi", label: "DeFi" },
  { key: "meme", label: "Meme" },
  { key: "hot", label: "Hot" },
];

export function FilterBar({ active, onChange }: FilterBarProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <div className="relative flex items-center">
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-0 overflow-x-auto scrollbar-hide [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden pr-8"
      >
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => onChange(f.key)}
            className={`relative px-3 py-1 text-sm font-medium whitespace-nowrap transition-colors ${
              active === f.key
                ? "text-primary"
                : "text-black hover:text-primary"
            }`}
          >
            {f.label}
            <span className={`absolute bottom-0 left-0 right-0 h-0.5 transition-colors ${
              active === f.key ? "bg-primary" : "bg-gray-300"
            }`} />
          </button>
        ))}
      </div>
      <button
        onClick={handleScrollRight}
        className="absolute right-0 p-1 text-black shrink-0 bg-surface"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </button>
    </div>
  );
}
