import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, MapPin, CheckCircle, Navigation } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Offer {
  id: string;
  farmerName: string;
  productName: string;
  quantity: number;
  price: number;
  location: string;
  status: 'pending' | 'accepted' | 'completed';
}

const AggregatorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [offers] = useState<Offer[]>([
    {
      id: '1',
      farmerName: 'Ramesh Kumar',
      productName: 'Wheat',
      quantity: 100,
      price: 25,
      location: 'Village Panchayat, Dist. Nagpur',
      status: 'pending'
    },
    {
      id: '2',
      farmerName: 'Suresh Patel',
      productName: 'Rice',
      quantity: 150,
      price: 30,
      location: 'Farm Road, Dist. Pune',
      status: 'pending'
    }
  ]);

  const [acceptedOffers, setAcceptedOffers] = useState<Offer[]>([]);
  const [otp, setOtp] = useState("");
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAcceptOffer = (offer: Offer) => {
    const acceptedOffer = { ...offer, status: 'accepted' as const };
    setAcceptedOffers([...acceptedOffers, acceptedOffer]);
    
    toast({
      title: "Offer accepted!",
      description: `You've accepted ${offer.productName} from ${offer.farmerName}`,
    });
  };

  const handleNavigate = (location: string) => {
    toast({
      title: "Navigation",
      description: `Opening navigation to: ${location}`,
    });
    // In production, this would open Google Maps with the location
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`, '_blank');
  };

  const handleVerifyOTP = (offerId: string) => {
    if (otp === "123456") {
      setAcceptedOffers(prev => 
        prev.map(o => o.id === offerId ? { ...o, status: 'completed' as const } : o)
      );
      
      toast({
        title: "Order completed!",
        description: "OTP verified successfully. Item received.",
      });
      
      setOtp("");
      setSelectedOffer(null);
    } else {
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "Please check the OTP from the farmer",
      });
    }
  };

  return (
    <div className="min-h-screen bg-muted p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-card rounded-lg p-6 mb-6 flex justify-between items-center shadow">
          <div>
            <h1 className="text-3xl font-bold text-card-foreground">Aggregator Dashboard</h1>
            <p className="text-muted-foreground">Welcome, {user?.name}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Available Offers */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Available Offers</CardTitle>
          </CardHeader>
          <CardContent>
            {offers.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No offers available at the moment
              </p>
            ) : (
              <div className="space-y-4">
                {offers.map((offer) => (
                  <div key={offer.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{offer.productName}</h3>
                        <p className="text-muted-foreground">by {offer.farmerName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                          ₹{(offer.quantity * offer.price).toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {offer.quantity} kg @ ₹{offer.price}/kg
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      {offer.location}
                    </p>
                    <Button 
                      onClick={() => handleAcceptOffer(offer)}
                      className="w-full"
                    >
                      Accept Offer
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Accepted Offers */}
        <Card>
          <CardHeader>
            <CardTitle>Your Accepted Offers</CardTitle>
          </CardHeader>
          <CardContent>
            {acceptedOffers.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                You haven't accepted any offers yet
              </p>
            ) : (
              <div className="space-y-4">
                {acceptedOffers.map((offer) => (
                  <div key={offer.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{offer.productName}</h3>
                        <p className="text-muted-foreground">from {offer.farmerName}</p>
                        <p className="text-sm text-muted-foreground flex items-center mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {offer.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">₹{(offer.quantity * offer.price).toFixed(2)}</p>
                        {offer.status === 'completed' && (
                          <span className="text-sm text-green-600 flex items-center justify-end mt-1">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Completed
                          </span>
                        )}
                      </div>
                    </div>

                    {offer.status === 'accepted' && (
                      <div className="space-y-2">
                        <Button 
                          onClick={() => handleNavigate(offer.location)}
                          variant="outline"
                          className="w-full"
                        >
                          <Navigation className="mr-2 h-4 w-4" />
                          Navigate to Location
                        </Button>

                        {selectedOffer === offer.id ? (
                          <div className="flex gap-2">
                            <Input
                              placeholder="Enter OTP from farmer"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                              maxLength={6}
                            />
                            <Button onClick={() => handleVerifyOTP(offer.id)}>
                              Verify
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            onClick={() => setSelectedOffer(offer.id)}
                            className="w-full"
                          >
                            Enter OTP to Confirm Receipt
                          </Button>
                        )}
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

export default AggregatorDashboard;