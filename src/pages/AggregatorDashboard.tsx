import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, MapPin, CheckCircle, Navigation, PhoneCall } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api, type Announcement, type MarketListing, type Offer } from "@/lib/api";

const AggregatorDashboard = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [offers, setOffers] = useState<MarketListing[]>([]);
  const [bidInputs, setBidInputs] = useState<Record<number, string>>({});
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [acceptedOffers, setAcceptedOffers] = useState<Offer[]>([]);
  const [otp, setOtp] = useState("");
  const [selectedOffer, setSelectedOffer] = useState<number | null>(null);

  useEffect(() => {
  if (!token) return;

  Promise.all([
    api.getAvailableOffers(token),
    api.getMyOffers(token),
    api.getMyAnnouncements(token),
  ])
    .then(([available, mine, announcementsData]) => {
      setOffers(available);
      setAcceptedOffers(mine);
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
    navigate('/');
  };

  const handlePlaceBid = async (offer: MarketListing) => {
    if (!token) return;
    const enteredPrice = Number(bidInputs[offer.listingId]);
    if (!enteredPrice || enteredPrice <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid bid",
        description: "Enter a valid bid price per kg.",
      });
      return;
    }

    try {
      const placed = await api.placeBid(token, offer.listingId, enteredPrice);
      setAcceptedOffers((prev) => {
        const rest = prev.filter((o) => o.id !== placed.id);
        return [placed, ...rest];
      });
      
      toast({
        title: "Bid submitted",
        description: `Your quote ₹${enteredPrice}/kg was sent for ${offer.productName}.`,
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Failed to place bid",
        description: "Please try again.",
      });
    }
  };

  const handleNavigate = (location: string) => {
    toast({
      title: "Navigation",
      description: `Opening navigation to: ${location}`,
    });
    // In production, this would open Google Maps with the location
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`, '_blank');
  };

  const handleVerifyOTP = async (offerId: number) => {
    if (!token) return;
    try {
      const updated = await api.verifyOtp(token, offerId, otp);
      setAcceptedOffers((prev) => prev.map((o) => (o.id === offerId ? updated : o)));
      toast({
        title: "Order completed!",
        description: "OTP verified successfully. Item received.",
      });
      setOtp("");
      setSelectedOffer(null);
    } catch {
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
        <Card className="mb-6">
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
              By {a.senderName} • {new Date(a.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    )}
  </CardContent>
</Card>
        {/* Available Offers */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Available Listings (Quote Your Bid)</CardTitle>
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
                          ₹{(offer.quantityKg * offer.pricePerKg).toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {offer.quantityKg} kg @ Asking ₹{offer.pricePerKg}/kg
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      {offer.location}
                    </p>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Your bid ₹/kg"
                        value={bidInputs[offer.listingId] ?? ""}
                        onChange={(e) => setBidInputs((prev) => ({ ...prev, [offer.listingId]: e.target.value }))}
                      />
                      <Button onClick={() => handlePlaceBid(offer)}>
                        Place Bid
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Accepted Offers */}
        <Card>
          <CardHeader>
            <CardTitle>Your Bids</CardTitle>
          </CardHeader>
          <CardContent>
            {acceptedOffers.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                You haven't placed any bids yet
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
                        {(offer.status === 'selected' || offer.status === 'completed') && offer.farmerEmail && (
                          <p className="text-sm mt-1 text-primary flex items-center">
                            <PhoneCall className="h-4 w-4 mr-1" />
                            Contact Farmer: {offer.farmerEmail}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">₹{(offer.quantityKg * (offer.bidPrice ?? offer.pricePerKg)).toFixed(2)}</p>
                        {offer.status === 'completed' && (
                          <span className="text-sm text-green-600 flex items-center justify-end mt-1">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Completed
                          </span>
                        )}
                        {offer.status === 'bid_placed' && (
                          <span className="text-sm text-amber-600">Waiting for farmer selection</span>
                        )}
                        {offer.status === 'selected' && (
                          <span className="text-sm text-blue-600">Selected by farmer</span>
                        )}
                      </div>
                    </div>

                    {offer.status === 'selected' && (
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