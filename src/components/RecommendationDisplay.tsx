import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, Leaf, Gauge } from "lucide-react";
import { CropRecommendation } from "@/lib/api";

interface RecommendationDisplayProps {
  recommendation: CropRecommendation;
  explanation: string;
}

export default function RecommendationDisplay({
  recommendation,
  explanation,
}: RecommendationDisplayProps) {
  const mainCrop = recommendation.main_crop;
  const altCrops = recommendation.recommended_crops.filter(
    (c) => c !== mainCrop
  );

  const getRainfallColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "low":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "medium":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "high":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Rainfall & Location Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Droplets className="mr-2 h-5 w-5" />
            Farm Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">District</p>
              <p className="text-lg font-semibold">{recommendation.district}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rainfall</p>
              <p className="text-lg font-semibold">{recommendation.rainfall_mm} mm</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rainfall Type</p>
              <span
                className={`inline-block px-3 py-1 rounded-full border text-sm font-semibold ${getRainfallColor(
                  recommendation.rainfall_type
                )}`}
              >
                {recommendation.rainfall_type}
              </span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Season</p>
              <p className="text-lg font-semibold">{recommendation.season}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Crop Recommendation */}
      <Card className="border-2 border-primary">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center text-primary">
            <Leaf className="mr-2 h-6 w-6" />
            Primary Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Best crop for your conditions
            </p>
            <p className="text-4xl font-bold text-primary mb-4">{mainCrop}</p>
            <p className="text-sm text-muted-foreground">
              Optimized for {recommendation.rainfall_type} rainfall and{" "}
              {recommendation.season} season
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Alternative Crops */}
      {altCrops.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Gauge className="mr-2 h-5 w-5" />
              Alternative Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {altCrops.map((crop) => (
                <div
                  key={crop}
                  className="p-4 border rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <p className="font-semibold text-lg">{crop}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Suitable alternative
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Land Allocation Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Land Allocation Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2 font-semibold">Crop</th>
                  <th className="text-right py-2 px-2 font-semibold">
                    Acres
                  </th>
                  <th className="text-left py-2 px-2 font-semibold">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(recommendation.land_plan).map(
                  ([crop, acres]) => {
                    const acreValue = parseFloat(acres);
                    const totalAcres = Object.values(
                      recommendation.land_plan
                    ).reduce((sum, a) => sum + parseFloat(a), 0);
                    const percentage = ((acreValue / totalAcres) * 100).toFixed(
                      1
                    );
                    return (
                      <tr
                        key={crop}
                        className="border-b hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-3 px-2">{crop}</td>
                        <td className="text-right py-3 px-2 font-semibold">
                          {parseFloat(acres).toFixed(2)}
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-muted rounded-full h-2 max-w-xs">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{
                                  width: `${percentage}%`,
                                }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground min-w-fit">
                              {percentage}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* LLM Explanation */}
      <Card>
        <CardHeader>
          <CardTitle>Expert Explanation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-base leading-relaxed whitespace-pre-wrap text-foreground">
              {explanation}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}