export type UserRole = "farmer" | "aggregator" | "admin";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Product {
  id: number;
  farmerName: string;
  farmerId: number;
  name: string;
  quantity: number;
  price: number;
  location: string;
  status: "open" | "accepted" | "completed";
}

export interface PredictionResponse {
  predictedPricePerKg: number;
  confidence: number;
  modelSource: string;
}

export interface Offer {
  id: number;
  listingId: number;
  farmerName: string;
  productName: string;
  quantity: number;
  price: number;
  location: string;
  status: "pending" | "accepted" | "completed";
}

export interface AcceptOfferResponse {
  offer: Offer;
  otpForTesting: string;
}

export interface AdminStats {
  totalSales: number;
  farmers: number;
  aggregators: number;
  salesByMonth: Array<{ month: string; sales: number }>;
  salesByProduct: Array<{ product: string; sales: number }>;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const jsonHeaders = {
  "Content-Type": "application/json",
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, options);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed (${response.status})`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export const api = {
  signup: (body: { name: string; email: string; password: string; role: UserRole }) =>
    request<AuthResponse>("/auth/signup", {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(body),
    }),

  login: (body: { email: string; password: string }) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(body),
    }),

  getFarmerProducts: (token: string) =>
    request<Product[]>("/farmer/products", {
      headers: authHeader(token),
    }),

  addFarmerProduct: (token: string, body: { productName: string; quantity: number; price: number; location: string }) =>
    request<Product>("/farmer/products", {
      method: "POST",
      headers: { ...jsonHeaders, ...authHeader(token) },
      body: JSON.stringify(body),
    }),

  predictPrice: (token: string, body: { cropName: string; district: string; quantityKg: number }) =>
    request<PredictionResponse>("/farmer/predict", {
      method: "POST",
      headers: { ...jsonHeaders, ...authHeader(token) },
      body: JSON.stringify(body),
    }),

  getAvailableOffers: (token: string) =>
    request<Offer[]>("/aggregator/offers/available", {
      headers: authHeader(token),
    }),

  acceptOffer: (token: string, listingId: number) =>
    request<AcceptOfferResponse>(`/aggregator/offers/${listingId}/accept`, {
      method: "POST",
      headers: authHeader(token),
    }),

  getMyOffers: (token: string) =>
    request<Offer[]>("/aggregator/offers/my", {
      headers: authHeader(token),
    }),

  verifyOtp: (token: string, offerId: number, otp: string) =>
    request<Offer>(`/aggregator/offers/${offerId}/verify`, {
      method: "POST",
      headers: { ...jsonHeaders, ...authHeader(token) },
      body: JSON.stringify({ otp }),
    }),

  getAdminStats: (token: string) =>
    request<AdminStats>("/admin/stats", {
      headers: authHeader(token),
    }),

  sendAnnouncement: (token: string, body: { recipient: "farmers" | "aggregators" | "all"; message: string }) =>
    request<string>("/admin/announcements", {
      method: "POST",
      headers: { ...jsonHeaders, ...authHeader(token) },
      body: JSON.stringify(body),
    }),
};
