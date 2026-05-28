import { apiClient } from "@/lib/api";
import useSWR from "swr";
import type { CryptoItem } from "@/types";

export async function fetchCryptoList(): Promise<CryptoItem[]> {
  const response = await apiClient<CryptoItem[]>("/api/proxy/list-crypto");
  // API returns array directly or wrapped in { data: [...] }
  return Array.isArray(response) ? response : (response.data ?? []);
}

export function useCryptoList() {
  return useSWR("crypto-list", fetchCryptoList, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    dedupingInterval: 30000, // Cache for 30s to avoid duplicate requests
  });
}
