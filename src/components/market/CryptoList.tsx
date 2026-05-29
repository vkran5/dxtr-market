"use client";

import Image from "next/image";
import type { CryptoItem } from "@/types";

interface CryptoListProps {
  items: CryptoItem[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}

export function CryptoList({ items, selectedId, onSelect }: CryptoListProps) {
  return (
    <ul className="space-y-2">
      {items.map((item) => {
        const isSelected = item.id === selectedId;
        return (
          <li
            key={item.id}
            onClick={() => onSelect?.(item.id)}
            className={`rounded p-3 flex items-center gap-3 cursor-pointer transition-all ${
              isSelected
                ? "bg-primary text-white"
                : "bg-inactive"
            }`}
          >
            {/* Image */}
            <div className="relative w-9 h-9 shrink-0">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.symbol}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className={`w-full h-full rounded flex items-center justify-center font-bold text-xs ${
                  isSelected ? "bg-white/20 text-white" : "bg-primary text-white"
                }`}>
                  {item.symbol[0]}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className={`font-semibold text-sm truncate ${isSelected ? "text-white" : "text-gray-900"}`}>
                {item.symbol}
              </p>
              <p className={`text-xs truncate ${isSelected ? "text-white/70" : "text-gray-500"}`}>
                {item.name}
              </p>
            </div>

            {/* Right side: Price + Change badge */}
            <div className="text-right shrink-0 flex flex-col items-end gap-1">
              {/* Change badge */}
              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                item.isPositive
                  ? "bg-white text-green-600"
                  : "bg-white text-red-600"
              }`}>
                {item.change_percent}
              </span>

              {/* Price */}
              <p className={`font-semibold text-sm ${isSelected ? "text-white" : "text-gray-900"}`}>
                {item.price_idr}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
