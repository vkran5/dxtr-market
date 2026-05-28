"use client";

import { useState, useRef, useMemo } from "react";
import useSWR from "swr";
import Image from "next/image";
import { fetchDxtrCountries } from "@/services/country";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function PhoneInput({ value, onChange, error }: PhoneInputProps) {
  const { data: countries } = useSWR("dxtr-countries", fetchDxtrCountries, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    dedupingInterval: 60000 * 60,
  });

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Derive selected country - Indonesia first, otherwise first in list
  const selected = useMemo(() => {
    if (!countries) return null;
    return countries.find((c) => c.code === "ID") || countries[0];
  }, [countries]);

  // Extract number part from value when value changes externally
  const numberFromValue = useMemo(() => {
    if (!value || !selected) return "";
    return value.replace(selected.dialPrefix, "");
  }, [value, selected]);

  function handleNumberChange(val: string) {
    const digits = val.replace(/\D/g, "");
    if (selected) {
      onChange(selected.dialPrefix + digits);
    }
  }

  return (
    <div className="w-full relative" ref={ref}>
      <div className={`flex border rounded overflow-hidden focus-within:ring-2 focus-within:ring-primary ${error ? "border-red-500" : "border-gray-300"}`}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1 px-3 bg-gray-50 border-r hover:bg-gray-100 min-w-20 shrink-0"
        >
          {selected && (
            <>
              <Image src={selected.flag} alt={selected.code} width={20} height={16} className="rounded" />
              <span className="text-sm text-gray-700">{selected.dialPrefix}</span>
            </>
          )}
          <svg className="w-3 h-3 text-gray-500 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <input
          type="tel"
          placeholder="8123456789"
          value={numberFromValue}
          onChange={(e) => handleNumberChange(e.target.value)}
          className="flex-1 px-3 py-2.5 text-black outline-none"
        />
      </div>

      {open && countries && (
        <div className="absolute z-50 mt-1 w-64 max-h-60 overflow-auto bg-white border rounded shadow-lg">
          {countries.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => {
                setOpen(false);
                onChange(c.dialPrefix + numberFromValue);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-50 text-left"
            >
              <Image src={c.flag} alt={c.code} width={20} height={16} className="rounded" />
              <span className="text-sm text-gray-700">{c.dialPrefix}</span>
              <span className="text-sm text-gray-500 ml-1">{c.name}</span>
            </button>
          ))}
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
