import { useState } from "react";
import { getRecommendations, RecommendationResponse } from "@/lib/api";

interface UseRecommendationState {
  loading: boolean;
  error: string | null;
  data: RecommendationResponse | null;
}

export function useRecommendation() {
  const [state, setState] = useState<UseRecommendationState>({
    loading: false,
    error: null,
    data: null,
  });

  const recommend = async (
    token: string,
    params: {
      district: string;
      season: "Rabi" | "Kharif";
      commodity: string;
      landSize: number;
      year?: number;
    }
  ) => {
    setState({ loading: true, error: null, data: null });
    try {
      const response = await getRecommendations(token, params);
      setState({ loading: false, error: null, data: response });
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get recommendations";
      setState({ loading: false, error: errorMessage, data: null });
      throw err;
    }
  };

  return { ...state, recommend };
}