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

export interface Announcement {
  id: number;
  message: string;
  recipient: "farmers" | "aggregators" | "all";
  senderName: string;
  createdAt: string;
}

export interface Product {
  id: number;
  farmerName: string;
  farmerId: number;
  Productname: string;
  quantityKg: number;
  pricePerKg: number;
  location: string;
  status: "open" | "accepted" | "completed";
}

export interface PredictionResponse {
  predictedPricePerKg: number;
  confidence: number;
  modelSource: string;
}

export interface MarketListing {
  id: number;
  listingId: number;
  farmerName: string;
  productName: string;
  quantityKg: number;
  pricePerKg: number;
  location: string;
  status: "pending";
}

export interface Offer {
  id: number;
  listingId: number;
  farmerName: string;
  farmerEmail?: string | null;
  aggregatorName?: string | null;
  aggregatorEmail?: string | null;
  productName: string;
  quantityKg: number;
  pricePerKg: number;
  bidPrice?: number | null;
  location: string;
  status: "bid_placed" | "selected" | "completed" | "rejected";
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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8080/api";

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

  getMyProducts: (token: string) =>
    request<Product[]>("/farmer/listings", {
      headers: authHeader(token),
    }),

  addProduct: (token: string, body: { productName: string; quantityKg: number; pricePerKg: number; location: string }) =>
    request<Product>("/farmer/listings", {
      method: "POST",
      headers: { 
        ...jsonHeaders, 
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body),
    }),

  predictPrice: (token: string, body: { district: string; market: string; commodity: string; variety: string; season: string; year: number; month: number }) =>
    request<PredictionResponse>("/farmer/predict", {
      method: "POST",
      headers: { ...jsonHeaders, ...authHeader(token) },
      body: JSON.stringify(body),
    }),
  
  getMyAnnouncements: (token: string) =>
  request<Announcement[]>("/admin/announcements", {
    headers: authHeader(token),
  }), 
  
  getAvailableOffers: (token: string) =>
    request<MarketListing[]>("/aggregator/offers/available", {
      headers: authHeader(token),
    }),

  placeBid: (token: string, listingId: number, bidPrice: number) =>
    request<Offer>(`/aggregator/offers/${listingId}/bid`, {
      method: "POST",
      headers: { ...jsonHeaders, ...authHeader(token) },
      body: JSON.stringify({ bidPrice }),
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

  getBidsForListing: (token: string, listingId: number) =>
  request<Offer[]>(`/farmer/bids/${listingId}`, {
    headers: authHeader(token),
  }),

  selectBid: (token: string, listingId: number, offerId: number) =>
  request<AcceptOfferResponse>(`/farmer/bids/${offerId}/accept`, {
    method: "POST",
    headers: authHeader(token),
  }),

  rejectBid: (token: string, bidId: number) =>
  request<{ message: string }>(`/farmer/bids/${bidId}/reject`, {
    method: "POST",
    headers: authHeader(token),
  }),

  getAdminStats: (token: string) =>
    request<AdminStats>("/admin/stats", {
      headers: authHeader(token),
    }),

  sendAnnouncement: (token: string, body: { recipient: "farmers" | "aggregators" | "all"; message: string }) =>
    request<{message: string}>("/admin/announcements", {
      method: "POST",
      headers: { ...jsonHeaders, ...authHeader(token) },
      body: JSON.stringify(body),
    }),
};
