import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRecommendation } from "@/hooks/useRecommendation";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sprout } from "lucide-react";

const CROPS = [
  "Rice",
  "Wheat",
  "Maize",
  "Ragi",
  "Jowar",
  "Tur Dal",
  "Green Gram",
  "Chana Dal",
  "Groundnut",
  "Sunflower",
  "Cotton",
  "Onion",
  "Potato",
];

const KARNATAKA_DISTRICTS = [
  "Bagalkote",
  "Ballari",
  "Belagavi",
  "Bengaluru Rural",
  "Bengaluru Urban",
  "Bidar",
  "Chamarajanagar",
  "Chikkaballapura",
  "Chikkamagaluru",
  "Chitradurga",
  "Dakshina Kannada",
  "Davanagere",
  "Dharwad",
  "Gadag",
  "Hassan",
  "Haveri",
  "Kalaburagi",
  "Kodagu",
  "Kolar",
  "Koppala",
  "Mandya",
  "Mysuru",
  "Raichur",
  "Ramanagara",
  "Shivamogga",
  "Tumakuru",
  "Udupi",
  "Uttara Kannada",
  "Vijayanagara",
  "Vijayapura",
  "Yadgir",
];

interface CropRecommendationFormProps {
  token: string;
  onRecommendationReceived?: (data: any) => void;
}

export default function CropRecommendationForm({
  token,
  onRecommendationReceived,
}: CropRecommendationFormProps) {
  const [formData, setFormData] = useState({
    district: "",
    season: "Rabi" as "Rabi" | "Kharif",
    commodity: "",
    landSize: "",
  });

  const { loading, error, data, recommend } = useRecommendation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.district || !formData.season || !formData.commodity || !formData.landSize) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in all required fields.",
      });
      return;
    }

    try {
      const result = await recommend(token, {
        district: formData.district,
        season: formData.season,
        commodity: formData.commodity,
        landSize: parseFloat(formData.landSize),
      });

      toast({
        title: "Recommendations generated!",
        description: `Get detailed crop recommendations for your farm.`,
      });

      if (onRecommendationReceived) {
        onRecommendationReceived(result);
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Failed to get recommendations",
        description: error || "Please check your inputs and try again.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sprout className="mr-2 h-5 w-5" />
          Crop Recommendation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* District Input */}
          <div className="space-y-2">
            <Label htmlFor="district">District</Label>
            <input
              id="district"
              type="text"
              list="districts"
              value={formData.district}
              onChange={(e) =>
                setFormData({ ...formData, district: e.target.value })
              }
              placeholder="Enter or select district"
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
            <datalist id="districts">
              {KARNATAKA_DISTRICTS.map((d) => (
                <option key={d} value={d} />
              ))}
            </datalist>
          </div>

          {/* Season Toggle */}
          <div className="space-y-2">
            <Label>Season</Label>
            <div className="flex gap-2">
              {(["Rabi", "Kharif"] as const).map((season) => (
                <button
                  key={season}
                  type="button"
                  onClick={() => setFormData({ ...formData, season })}
                  className={`flex-1 px-3 py-2 rounded-md border transition-colors ${
                    formData.season === season
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-input hover:bg-muted"
                  }`}
                >
                  {season}
                </button>
              ))}
            </div>
          </div>

          {/* Commodity (Current Crop) */}
          <div className="space-y-2">
            <Label htmlFor="commodity">Current Crop</Label>
            <select
              id="commodity"
              value={formData.commodity}
              onChange={(e) =>
                setFormData({ ...formData, commodity: e.target.value })
              }
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              required
            >
              <option value="">Select a crop</option>
              {CROPS.map((crop) => (
                <option key={crop} value={crop}>
                  {crop}
                </option>
              ))}
            </select>
          </div>

          {/* Land Size */}
          <div className="space-y-2">
            <Label htmlFor="landSize">Land Size (acres)</Label>
            <Input
              id="landSize"
              type="number"
              step="0.1"
              min="0.1"
              max="100"
              value={formData.landSize}
              onChange={(e) =>
                setFormData({ ...formData, landSize: e.target.value })
              }
              placeholder="e.g., 5"
              required
            />
          </div>


          {/* Error Message */}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive rounded text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Getting recommendations...
              </>
            ) : (
              "Get Recommendations"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}