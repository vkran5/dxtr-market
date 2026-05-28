import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export function Input({ className, error, ...props }: InputProps) {
  return (
    <div className="w-full">
      <input
        className={cn(
          "w-full px-4 py-2.5 border rounded text-black focus:ring-2 focus:ring-primary focus:outline-none transition-colors",
          error ? "border-red-500" : "border-gray-300",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
