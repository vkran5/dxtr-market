export function CryptoListSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="rounded p-3 flex items-center gap-3 animate-pulse"
        >
          {/* Image placeholder */}
          <div className="w-9 h-9 bg-gray-300 rounded shrink-0" />

          {/* Info placeholder */}
          <div className="flex-1 space-y-2">
            <div className="h-4 w-16 bg-gray-300 rounded" />
            <div className="h-3 w-24 bg-gray-200 rounded" />
          </div>

          {/* Right side placeholder */}
          <div className="shrink-0 space-y-2 items-end flex flex-col">
            <div className="h-5 w-16 bg-gray-300 rounded" />
            <div className="h-4 w-12 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
