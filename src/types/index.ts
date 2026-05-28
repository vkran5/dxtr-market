export interface LoginPayload {
  email?: string;
  phone?: string;
  password: string;
}

export interface LoginResponse {
  otp: string;
  token: string;
  phone?: string;
  email?: string;
}

export interface VerifyOtpPayload {
  otp: string;
  phone: string;
}

export interface CryptoItem {
  id: string;
  name?: string;
  symbol: string;
  image?: string;
  price_idr: string;
  change_percent: string;
  isPositive: boolean;
  hot: boolean;
  isFavorite: boolean;
  type: string;
}

export interface Country {
  code: string;
  name: string;
  dialPrefix: string;
  flag: string;
}
