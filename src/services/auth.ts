import { apiClient } from "@/lib/api";
import type { LoginPayload, LoginResponse } from "@/types";

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const result = await apiClient<LoginResponse>("/api/proxy/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return result.data;
}

export async function verifyOtp(otp: string, phone: string): Promise<void> {
  await apiClient("/api/proxy/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({ otp, phone }),
  });
  // Token is already set during login, OTP just verifies the user
}
