import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
}

export function Button({ className, variant = "primary", disabled, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "w-full py-2.5 px-4 rounded font-medium transition-colors",
        variant === "primary" && "bg-primary text-white hover:bg-primary-hover",
        variant === "secondary" && "bg-gray-200 text-gray-800 hover:bg-gray-300",
        variant === "outline" && "border border-gray-300 text-gray-700 hover:bg-gray-50",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      disabled={disabled}
      {...props}
    />
  );
}
