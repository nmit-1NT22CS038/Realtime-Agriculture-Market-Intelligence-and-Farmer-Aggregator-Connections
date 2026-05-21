import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, type Announcement, type Offer, type Product } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, TrendingUp, MapPin, Package, Handshake } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LocationPicker from "@/components/LocationPicker";
import CropRecommendationForm from "@/components/CropRecommendationForm";
import RecommendationDisplay from "@/components/RecommendationDisplay";
import { RecommendationResponse } from "@/lib/api";
import PricePredictionForm from "@/components/PricePredictionForm";

const FarmerDashboard = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [recommendationResult, setRecommendationResult] = useState<RecommendationResponse | null>(null);
  const [bidsByListing, setBidsByListing] = useState<Record<number, Offer[]>>(
    {},
  );

  // // Price prediction fields
  // const [predictionData, setPredictionData] = useState({
  //   district: "",
  //   market: "",
  //   commodity: "",
  //   variety: "",
  //   season: "Rabi",
  //   year: new Date().getFullYear(),
  //   month: new Date().getMonth() + 1,
  // });

  useEffect(() => {
    if (!token) return;

    Promise.all([api.getMyProducts(token), api.getMyAnnouncements(token)])
      .then(([productsData, announcementsData]) => {
        setProducts(productsData);
        setAnnouncements(announcementsData);
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Failed to load dashboard data",
          description: "Check backend server and login again.",
        });
      });
  }, [token, toast]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) return;

    try {
      const created = await api.addProduct(token, {
        productName,
        quantityKg: parseFloat(quantity),
        pricePerKg: parseFloat(price),
        location,
      });

      setProducts((prev) => [created, ...prev]);

      toast({
        title: "Product added!",
        description: `${productName} has been listed for sale`,
      });

      setProductName("");
      setQuantity("");
      setPrice("");
      setLocation("");
    } catch {
      toast({
        variant: "destructive",
        title: "Failed to add product",
        description: "Please try again.",
      });
    }
  };

  const handleViewBids = async (listingId: number) => {
    if (!token) return;
    try {
      const bids = await api.getBidsForListing(token, listingId);
      setBidsByListing((prev) => ({ ...prev, [listingId]: bids }));
    } catch {
      toast({
        variant: "destructive",
        title: "Failed to load bids",
        description: "Please try again.",
      });
    }
  };

  const handleSelectBid = async (listingId: number, offerId: number) => {
    if (!token) return;
    try {
      const response = await api.selectBid(token, listingId, offerId);
      setProducts((prev) =>
        prev.map((p) =>
          p.id === listingId ? { ...p, status: "accepted" } : p,
        ),
      );
      setBidsByListing((prev) => ({
        ...prev,
        [listingId]: (prev[listingId] ?? []).map((b) =>
          b.id === offerId ? response.offer : b,
        ),
      }));

      toast({
        title: "Bid selected",
        description: `Aggregator selected. Share OTP ${response.otpForTesting} when handing over produce.`,
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Failed to select bid",
        description: "Please try again.",
      });
    }
  };

  const handleRejectBid = async (listingId: number, bidId: number) => {
    if (!token) return;
    try {
      await api.rejectBid(token, bidId);

      // Remove rejected bid from current list UI (backend returns only bid_placed anyway)
      setBidsByListing((prev) => ({
        ...prev,
        [listingId]: (prev[listingId] ?? []).filter((b) => b.id !== bidId),
      }));

      toast({
        title: "Bid rejected",
        description: "The bid has been rejected.",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Failed to reject bid",
        description: "Please try again.",
      });
    }
  };
  return (
    <div className="min-h-screen bg-muted p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-card rounded-lg p-6 mb-6 flex justify-between items-center shadow">
          <div>
            <h1 className="text-3xl font-bold text-card-foreground">
              Farmer Dashboard
            </h1>
            <p className="text-muted-foreground">Welcome, {user?.name}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Add Product Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                List New Product
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="productName">Product Name</Label>
                  <Input
                    id="productName"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity (kg)</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Asking Price per kg (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter your address"
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Add Product
                </Button>
              </form>
            </CardContent>
          </Card>

            {/* Quick Actions */}
          <div className="space-y-6">
            <PricePredictionForm token={token} />

            {/* <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Your Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LocationPicker
                  address={location}
                  onLocationSelect={setLocation}
                />
              </CardContent>
            </Card> */}
          </div>

          {/* Crop Recommendation Section - spans full width */}
<div className="lg:col-span-2">
  {!recommendationResult ? (
    <CropRecommendationForm
      token={token}
      onRecommendationReceived={setRecommendationResult}
    />
  ) : (
    <div>
      <Button
        variant="outline"
        onClick={() => setRecommendationResult(null)}
        className="mb-4"
      >
        ← New Recommendation
      </Button>
      <RecommendationDisplay
        recommendation={recommendationResult.recommendations}
        explanation={recommendationResult.explanation}
      />
    </div>
  )}
</div>
        </div>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            {announcements.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No announcements yet.
              </p>
            ) : (
              <div className="space-y-3">
                {announcements.map((a) => (
                  <div key={a.id} className="border rounded-lg p-3 bg-muted/20">
                    <p className="font-medium">{a.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      By {a.senderName} •{" "}
                      {new Date(a.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        {/* Listed Products */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Your Listed Products</CardTitle>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No products listed yet. Add your first product above!
              </p>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {product.Productname}
                        </h3>
                        <p className="text-muted-foreground">
                          {product.quantityKg} kg @ ₹{product.pricePerKg}/kg
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {product.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                          ₹
                          {(product.quantityKg * product.pricePerKg).toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Total Value
                        </p>
                        <p className="text-xs mt-1 capitalize">
                          Status: {product.status}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <Button
                        variant="outline"
                        onClick={() => handleViewBids(product.id)}
                      >
                        <Handshake className="h-4 w-4 mr-2" />
                        View Bids
                      </Button>
                    </div>

                    {(bidsByListing[product.id] ?? []).length > 0 && (
                      <div className="mt-3 space-y-2">
                        {(bidsByListing[product.id] ?? []).map((bid) => (
                          <div
                            key={bid.id}
                            className="border rounded p-3 flex justify-between items-center bg-muted/30"
                          >
                            <div>
                              <p className="font-medium">
                                {bid.aggregatorName ?? "Aggregator"} (
                                {bid.aggregatorEmail})
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Quoted: ₹{bid.bidPrice}/kg
                              </p>
                              <p className="text-xs capitalize">
                                {bid.status.replace("_", " ")}
                              </p>
                            </div>
                            {product.status === "open" &&
                              bid.status === "bid_placed" && (
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() =>
                                      handleSelectBid(product.id, bid.id)
                                    }
                                  >
                                    Select Bid
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() =>
                                      handleRejectBid(product.id, bid.id)
                                    }
                                  >
                                    Reject
                                  </Button>
                                </div>
                              )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FarmerDashboard;
