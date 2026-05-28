"use client";

interface SearchBoxProps {
  value: string;
  onChange: (v: string) => void;
}

export function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <div className="relative">
      <input
        type="search"
        placeholder="Search..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded px-4 py-2.5 pr-10 focus:border-primary focus:outline-none text-sm"
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-black">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
      </span>
    </div>
  );
}
