"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LoginForm } from "@/components/forms/LoginForm";

export default function Home() {
  const router = useRouter();
  const [mode, setMode] = useState<"email" | "phone">("email");
  const [progressWidth, setProgressWidth] = useState("0%");

  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        router.refresh();
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [router]);

  function handleProgress(hasEmailOrPhone: boolean, hasPassword: boolean) {
    let progress = 0;
    if (hasEmailOrPhone) progress += 10;
    if (hasPassword) progress += 10;
    setProgressWidth(`${progress}%`);
  }

  function handleLoginSuccess() {
    setProgressWidth("50%");
    setTimeout(() => {
      router.push("/otp");
    }, 500);
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
            src={mode === "email" ? "/images/mail_signin.svg" : "/images/phone_signin.svg"}
            alt={mode === "email" ? "Mail sign in" : "Phone sign in"}
            width={400}
            height={400}
            className="h-[80%] w-auto object-contain"
            priority
          />
        </div>
        <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
          <LoginForm
            key={mode}
            mode={mode}
            onModeChange={(newMode) => {
              setMode(newMode);
              setProgressWidth("0%");
            }}
            onSuccess={handleLoginSuccess}
            onProgress={handleProgress}
          />
        </div>
      </div>

      <div className="absolute bottom-0 right-0 w-full lg:w-1/2 h-1.5 bg-gray-200">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: progressWidth }}
        />
      </div>
    </main>
  );
}
