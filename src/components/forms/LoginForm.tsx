"use client";

import { useState } from "react";
import useSWRMutation from "swr/mutation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { login } from "@/services/auth";

interface LoginFormProps {
  mode: "email" | "phone";
  onModeChange: (mode: "email" | "phone") => void;
  onSuccess?: () => void;
  onProgress?: (hasEmail: boolean, hasPassword: boolean) => void;
}

interface ApiError extends Error {
  field?: string;
}

export function LoginForm({ mode, onModeChange, onSuccess, onProgress }: LoginFormProps) {
  const [formState, setFormState] = useState({ email: "", phone: "", password: "", showPassword: false });

  const { trigger, isMutating, error } = useSWRMutation(
    "/api/proxy/auth/login",
    (_, { arg }: { arg: { email?: string; phone?: string; password: string } }) => login(arg),
    {
      onSuccess: (data) => {
        try {
          // Set auth token cookie (middleware reads from cookies)
          document.cookie = `auth_token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}`;
          sessionStorage.setItem("pending_otp", data.otp);
          sessionStorage.setItem("pending_phone", data.phone || formState.phone);
        } catch {
          // Ignore storage errors
        }
        onSuccess?.();
      },
    }
  );

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const payload =
      mode === "email"
        ? { email: formState.email, password: formState.password }
        : { phone: formState.phone.replace("+", ""), password: formState.password };
    trigger(payload);
  }

  function handleEmailChange(value: string) {
    setFormState((prev) => ({ ...prev, email: value }));
    const hasPassword = formState.password.length > 0;
    onProgress?.(value.length > 0, hasPassword);
  }

  function handlePhoneChange(value: string) {
    setFormState((prev) => ({ ...prev, phone: value }));
    const hasPassword = formState.password.length > 0;
    onProgress?.(value.length > 0, hasPassword);
  }

  function handlePasswordChange(value: string) {
    setFormState((prev) => ({ ...prev, password: value }));
    const hasEmailOrPhone = mode === "email" ? formState.email.length > 0 : formState.phone.length > 0;
    onProgress?.(hasEmailOrPhone, value.length > 0);
  }

  const apiError = error as ApiError | undefined;
  const isButtonDisabled = isMutating || (mode === "email" ? !formState.email || !formState.password : !formState.phone || !formState.password);

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-roboto)]">Welcome Back</h1>
        <p className="mt-1 text-sm text-gray-500">
          Enter your Credentials to access your account
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            {mode === "email" ? "Email" : "Phone Number"}
          </label>
          <button
            type="button"
            onClick={() => onModeChange(mode === "email" ? "phone" : "email")}
            className="text-sm text-secondary hover:text-secondary-hover"
          >
            {mode === "email" ? "Sign In with Phone Number" : "Sign In with Email"}
          </button>
        </div>

        <div className={mode === "email" ? "" : "hidden"}>
          <Input
            type="email"
            placeholder="username@gmail.com"
            value={formState.email}
            onChange={(e) => handleEmailChange(e.target.value)}
            error={apiError?.field === "email" ? apiError.message : undefined}
          />
        </div>
        <div className={mode === "phone" ? "" : "hidden"}>
          <PhoneInput
            value={formState.phone}
            onChange={handlePhoneChange}
            error={apiError?.field === "phone" ? apiError.message : undefined}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <input
              type={formState.showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formState.password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              className={`w-full px-4 py-2.5 border rounded text-black focus:ring-2 focus:ring-primary focus:outline-none transition-colors pr-10 ${
                apiError?.field === "password" ? "border-red-500" : "border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() => setFormState((prev) => ({ ...prev, showPassword: !prev.showPassword }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {formState.showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>
          {apiError?.field === "password" && (
            <p className="text-sm text-red-500">{apiError.message}</p>
          )}
        </div>

        <div className="flex items-center justify-start">
          <button type="button" className="text-sm text-secondary hover:text-secondary-hover">
            Forgot Password?
          </button>
        </div>
      </div>

      {apiError && !apiError.field && (
        <p className="text-red-500 text-sm">{apiError.message}</p>
      )}

      <Button
        type="submit"
        disabled={isButtonDisabled}
        className="w-full bg-primary hover:bg-primary-hover text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isMutating ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
