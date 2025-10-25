import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sprout, TrendingUp, Users, Shield } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-screen">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2070')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/60" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6">
            AgriFlow Digital
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-2xl">
            Connecting Farmers and Aggregators for a Better Tomorrow
          </p>
          <div className="flex gap-4">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/signup')}
              className="text-lg px-8"
            >
              Sign Up
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/login')}
              className="text-lg px-8 bg-primary-foreground/10 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              Login
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 bg-muted">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            Why Choose AgriFlow?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Sprout className="w-12 h-12 text-primary" />}
              title="For Farmers"
              description="List your produce, get fair prices, and connect directly with buyers"
            />
            <FeatureCard
              icon={<Users className="w-12 h-12 text-accent" />}
              title="For Aggregators"
              description="Find quality produce, negotiate deals, and manage logistics efficiently"
            />
            <FeatureCard
              icon={<TrendingUp className="w-12 h-12 text-secondary" />}
              title="Price Prediction"
              description="AI-powered price forecasting to help you make informed decisions"
            />
            <FeatureCard
              icon={<Shield className="w-12 h-12 text-primary" />}
              title="Secure Platform"
              description="Safe transactions with OTP verification and location tracking"
            />
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="py-20 px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
          Our Agricultural Community
        </h2>
        <div className="grid md:grid-cols-3 gap-4 max-w-6xl mx-auto">
          <img 
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070" 
            alt="Farmer in field"
            className="w-full h-64 object-cover rounded-lg shadow-lg"
          />
          <img 
            src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=2088" 
            alt="Fresh vegetables"
            className="w-full h-64 object-cover rounded-lg shadow-lg"
          />
          <img 
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2089" 
            alt="Agricultural landscape"
            className="w-full h-64 object-cover rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="bg-card p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow">
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 text-card-foreground">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default Home;