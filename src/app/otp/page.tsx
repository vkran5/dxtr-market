"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useSWRMutation from "swr/mutation";
import { Button } from "@/components/ui/Button";
import { verifyOtp } from "@/services/auth";

function getSavedOtp(): string[] {
  try {
    const saved = sessionStorage.getItem("pending_otp");
    return saved && saved.length === 6 ? saved.split("") : ["", "", "", "", "", ""];
  } catch {
    return ["", "", "", "", "", ""];
  }
}

function getInitialProgress(otpDigits: string[]): string {
  const filledCount = otpDigits.filter((d) => d !== "").length;
  const isComplete = filledCount === 6;
  const progressPercent = isComplete ? 95 : 51 + (filledCount / 6) * 39;
  return `${progressPercent}%`;
}

function getSavedPhone(): string {
  try {
    return sessionStorage.getItem("pending_phone") || "";
  } catch {
    return "";
  }
}

export default function OtpPage() {
  const router = useRouter();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const savedOtp = getSavedOtp();
  const [otp, setOtp] = useState(savedOtp);
  const [errorMsg, setErrorMsg] = useState("");
  const [phoneNumber] = useState(getSavedPhone);
  const [progressWidth, setProgressWidth] = useState(getInitialProgress(savedOtp));

  // Auto-focus first empty input on mount
  useEffect(() => {
    const firstEmptyIndex = otp.findIndex((d) => d === "");
    inputRefs.current[firstEmptyIndex >= 0 ? firstEmptyIndex : 0]?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pastedData) return;

    const digits = pastedData.split("");
    const newOtp = ["", "", "", "", "", ""];
    digits.forEach((digit, i) => {
      if (i < 6) newOtp[i] = digit;
    });
    setOtp(newOtp);
    setErrorMsg("");

    const focusIndex = Math.min(digits.length, 5);
    inputRefs.current[focusIndex]?.focus();

    // Update progress bar based on filled digits (95% until submitted)
    const filledCount = newOtp.filter((d) => d !== "").length;
    const isComplete = filledCount === 6;
    const progressPercent = isComplete ? 95 : 51 + (filledCount / 6) * 39;
    setProgressWidth(`${progressPercent}%`);
  }, []);

  const { trigger, isMutating } = useSWRMutation(
    "/api/proxy/auth/verify-otp",
    (_, { arg }: { arg: { otp: string; phone: string } }) => verifyOtp(arg.otp, arg.phone),
    {
      onSuccess: () => {
        try {
          sessionStorage.removeItem("pending_otp");
          sessionStorage.removeItem("pending_phone");
        } catch {
          // Ignore storage errors
        }
        setProgressWidth("100%");
        setTimeout(() => {
          router.push("/market");
        }, 700);
      },
      onError: () => {
        setErrorMsg("Invalid OTP. Please try again.");
        setProgressWidth("95%");
      },
    }
  );

  function handleChange(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setErrorMsg("");

    // Update progress bar based on filled digits (95% until submitted)
    const filledCount = newOtp.filter((d) => d !== "").length;
    const isComplete = filledCount === 6;
    const progressPercent = isComplete ? 95 : 51 + (filledCount / 6) * 39;
    setProgressWidth(`${progressPercent}%`);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    const code = otp.join("");
    let phone = "";
    try {
      phone = sessionStorage.getItem("pending_phone") || "";
    } catch {
      // Ignore storage errors
    }
    trigger({ otp: code, phone });
  }

  return (
    <main className="relative h-screen flex flex-col overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <div
          className="hidden lg:flex lg:w-1/2 bg-surface items-center justify-center p-8 overflow-hidden"
          style={{
            backgroundImage: "url('/images/left-bg.svg')",
            backgroundSize: "100% auto",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <Image
            src="/images/otp.svg"
            alt="OTP"
            width={400}
            height={400}
            className="h-[80%] w-auto object-contain"
            priority
          />
        </div>
        <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
          <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-roboto)]">Confirm your phone</h1>
              <p className="mt-2 text-sm text-gray-500">
                We sent 6 digits code to +{phoneNumber}
              </p>
            </div>

            <div className="flex gap-3 justify-center py-6">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={i === 0 ? handlePaste : undefined}
                  className={`w-14 h-16 text-center text-2xl font-bold text-primary bg-surface border-0 border-b-2 rounded px-2 focus:outline-none transition-colors ${
                    digit ? "border-primary text-primary" : "border-gray-300 text-gray-400"
                  } ${errorMsg ? "border-red-500" : ""}`}
                />
              ))}
            </div>

            {errorMsg && (
              <p className="text-red-500 text-sm text-center">{errorMsg}</p>
            )}

            <Button
              type="submit"
              disabled={isMutating || otp.join("").length !== 6}
              className="w-full bg-primary hover:bg-primary-hover text-white"
            >
              {isMutating ? "Verifying..." : "Confirm"}
            </Button>
          </form>
        </div>
      </div>

      {/* Progress indicator - bottom right */}
      <div className="absolute bottom-0 right-0 w-full lg:w-1/2 h-1.5 bg-gray-200 overflow-hidden">
        <div
          className={`h-full bg-primary transition-all duration-500 ease-out ${
            isMutating ? "animate-pulse" : ""
          }`}
          style={{ width: isMutating ? "97%" : progressWidth }}
        />
      </div>
    </main>
  );
}
