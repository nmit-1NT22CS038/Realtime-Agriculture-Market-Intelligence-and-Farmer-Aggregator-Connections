// src/components/PricePredictionForm.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import {
  DISTRICTS,
  DISTRICT_MARKETS,
  COMMODITIES,
  COMMODITY_VARIETIES,
  SEASONS,
} from "@/lib/locationData";

interface PricePredictionFormProps {
  token: string;
}

export default function PricePredictionForm({ token }: PricePredictionFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    district: "",
    market: "",
    commodity: "",
    variety: "",
    season: "Kharif",
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

  // Cascading dropdowns
  const availableMarkets = formData.district
    ? DISTRICT_MARKETS[formData.district as keyof typeof DISTRICT_MARKETS] || []
    : [];

  const availableVarieties = formData.commodity
    ? COMMODITY_VARIETIES[formData.commodity as keyof typeof COMMODITY_VARIETIES] || []
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.district ||
      !formData.market ||
      !formData.commodity ||
      !formData.variety ||
      !formData.season
    ) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in all prediction fields.",
      });
      return;
    }

    try {
      setLoading(true);
      const result = await api.predictPrice(token, formData);

      toast({
        title: "Price Prediction",
        description: `₹${result.predictedPricePerKg.toFixed(2)}/kg (${result.confidence.toFixed(1)}% confidence, ${result.modelSource})`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Prediction failed",
        description: error instanceof Error ? error.message : "Please check your inputs.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="mr-2 h-5 w-5" />
          Price Prediction
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* District Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="district">
              District <span className="text-red-500">*</span>
            </Label>
            <select
              id="district"
              value={formData.district}
              onChange={(e) =>
                setFormData({ ...formData, district: e.target.value, market: "" })
              }
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              required
            >
              <option value="">Select a district</option>
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Market Dropdown (cascades from district) */}
          <div className="space-y-2">
            <Label htmlFor="market">
              Market <span className="text-red-500">*</span>
            </Label>
            <select
              id="market"
              value={formData.market}
              onChange={(e) => setFormData({ ...formData, market: e.target.value })}
              disabled={!formData.district}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
              required
            >
              <option value="">
                {formData.district ? "Select a market" : "Select district first"}
              </option>
              {availableMarkets.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Commodity Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="commodity">
              Commodity <span className="text-red-500">*</span>
            </Label>
            <select
              id="commodity"
              value={formData.commodity}
              onChange={(e) =>
                setFormData({ ...formData, commodity: e.target.value, variety: "" })
              }
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              required
            >
              <option value="">Select a commodity</option>
              {COMMODITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Variety Dropdown (cascades from commodity) */}
          <div className="space-y-2">
            <Label htmlFor="variety">
              Variety <span className="text-red-500">*</span>
            </Label>
            <select
              id="variety"
              value={formData.variety}
              onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
              disabled={!formData.commodity}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
              required
            >
              <option value="">
                {formData.commodity ? "Select a variety" : "Select commodity first"}
              </option>
              {availableVarieties.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          {/* Season Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="season">
              Season <span className="text-red-500">*</span>
            </Label>
            <select
              id="season"
              value={formData.season}
              onChange={(e) => setFormData({ ...formData, season: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              required
            >
              {SEASONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Year & Month */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <select
                id="year"
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: parseInt(e.target.value) })
                }
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {[2024, 2025, 2026].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="month">Month</Label>
              <select
                id="month"
                value={formData.month}
                onChange={(e) =>
                  setFormData({ ...formData, month: parseInt(e.target.value) })
                }
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {new Date(2024, m - 1).toLocaleString("default", {
                      month: "long",
                    })}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Predicting...
              </>
            ) : (
              "Predict Price"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}