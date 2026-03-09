import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, TrendingUp, MapPin, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LocationPicker from "@/components/LocationPicker";
import { api, type Product } from "@/lib/api";

const FarmerDashboard = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    if (!token) return;
    api.getFarmerProducts(token)
      .then(setProducts)
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Failed to load products",
          description: "Check backend server and login again.",
        });
      });
  }, [token, toast]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) return;

    try {
      const created = await api.addFarmerProduct(token, {
        productName,
        quantity: parseFloat(quantity),
        price: parseFloat(price),
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
    } catch {
      toast({
        variant: "destructive",
        title: "Failed to add product",
        description: "Please try again.",
      });
    }
  };

  const handlePricePredict = async () => {
    if (!token) return;

    if (!productName || !quantity || !location) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Fill Product Name, Quantity, and Location first.",
      });
      return;
    }

    try {
      const result = await api.predictPrice(token, {
        cropName: productName,
        district: location,
        quantityKg: parseFloat(quantity),
      });

      toast({
        title: "Price Prediction",
        description: `Predicted ₹${result.predictedPricePerKg.toFixed(2)}/kg (confidence ${result.confidence.toFixed(1)}%, ${result.modelSource})`,
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Prediction failed",
        description: "Check backend and ML script configuration.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-muted p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-card rounded-lg p-6 mb-6 flex justify-between items-center shadow">
          <div>
            <h1 className="text-3xl font-bold text-card-foreground">Farmer Dashboard</h1>
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
                  <Label htmlFor="price">Price per kg (₹)</Label>
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Price Prediction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Get AI-powered price predictions for your crops
                </p>
                <Button onClick={handlePricePredict} className="w-full">
                  Predict Prices
                </Button>
              </CardContent>
            </Card>

            <Card>
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
            </Card>
          </div>
        </div>

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
                  <div key={product.id} className="border rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <p className="text-muted-foreground">
                        {product.quantity} kg @ ₹{product.price}/kg
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {product.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        ₹{(product.quantity * product.price).toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Value</p>
                    </div>
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