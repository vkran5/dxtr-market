"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useCryptoList } from "@/services/market";
import { SearchBox } from "./SearchBox";
import { FilterBar } from "./FilterBar";
import { CryptoList } from "./CryptoList";
import { EmptyState } from "./EmptyState";
import { CryptoListSkeleton } from "./CryptoListSkeleton";
import type { CryptoItem } from "@/types";

type Filter = "all" | "cryptocurrency" | "favorite" | "defi" | "meme" | "hot";

const CryptoDetail = React.memo(function CryptoDetail({ item }: { item: CryptoItem }) {
  const priceColor = item.isPositive ? "text-green-500" : "text-red-500";
  return (
    <div className="text-sm">
      <div className="flex gap-4 items-center">
        <div className="flex items-center py-2">
          {item.image ? (
            <Image src={item.image} alt={item.symbol} width={36} height={36} className="object-contain" />
          ) : (
            <div className="w-9 h-9 bg-primary rounded flex items-center justify-center text-white text-sm font-bold">
              {item.symbol[0]}
            </div>
          )}
          <span className="ml-1 text-2xl text-black font-bold">{item.symbol}/IDR</span>
        </div>
        <div className="flex flex-col items-end gap-0">
          <span className={`text-xs ${priceColor}`}>{item.price_idr}</span>
          <span className={`text-xs ${priceColor}`}>{item.change_percent}</span>
        </div>
      </div>
    </div>
  );
});

export function MarketView() {
  const { data, error, isLoading } = useCryptoList();
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return (data || []).filter((item) => {
      if (filter === "favorite" && !item.isFavorite) return false;
      if (filter === "cryptocurrency" && item.type !== "cryptocurrency") return false;
      if (filter === "defi" && item.type !== "defi") return false;
      if (filter === "meme" && item.type !== "meme") return false;
      if (filter === "hot" && !item.hot) return false;
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesName = item.name?.toLowerCase().includes(searchLower);
        const matchesSymbol = item.symbol.toLowerCase().includes(searchLower);
        if (!matchesName && !matchesSymbol) return false;
      }
      return true;
    });
  }, [data, filter, search]);

  const selectedItem = data?.find((item) => item.id === selectedId) || filtered[0] || null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left sidebar */}
      <div className="w-full lg:w-[380px] xl:w-[400px] bg-surface flex flex-col">
        {/* Header */}
        <header className="px-4 pt-5 pb-4 space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Markets</h1>
          <SearchBox value={search} onChange={setSearch} />
          <FilterBar active={filter} onChange={setFilter} />
        </header>

        {/* List */}
        <main className="flex-1 overflow-y-auto px-4 pb-4">
          {isLoading ? (
            <CryptoListSkeleton />
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Market data unavailable</h2>
              <p className="text-gray-500 text-sm max-w-xs">
                The crypto market endpoint is not ready yet. Please check back later or contact support.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState keyword={search} />
          ) : (
            <CryptoList items={filtered} selectedId={selectedId || selectedItem?.id} onSelect={setSelectedId} />
          )}
        </main>
      </div>

      {/* Right detail panel */}
      <div className="hidden lg:flex flex-1 flex-col bg-white">
        {/* User header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
              <Image src="https://i.pravatar.cc/150?img=11" alt="User" width={40} height={40} className="object-cover" />
            </div>
            <span className="font-semibold text-gray-900">John Johnson</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Welcome to Trading Dashboard</h2>

          {selectedItem ? (
            <CryptoDetail item={selectedItem} />
          ) : (
            <p className="text-gray-500">Select a market item to view details</p>
          )}
        </div>
      </div>
    </div>
  );
}
