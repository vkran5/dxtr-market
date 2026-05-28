interface EmptyStateProps {
  keyword: string;
}

export function EmptyState({ keyword }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-gray-900">
        No results found
      </h2>
      <p className="text-gray-500 text-sm max-w-xs">
        {keyword
          ? `We couldn't find any matches for "${keyword}". Try adjusting your search or filter.`
          : "No items available with the current filter. Try a different category."}
      </p>
    </div>
  );
}
