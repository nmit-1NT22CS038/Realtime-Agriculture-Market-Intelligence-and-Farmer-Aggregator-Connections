import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Sprout } from "lucide-react";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<'farmer' | 'aggregator' | 'admin' | null>(null);
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!role) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a role",
      });
      return;
    }

    const success = await signup(name, email, password, role);
    
    if (success) {
      toast({
        title: "Account created!",
        description: "Welcome to AgriFlow Digital",
      });
      navigate(`/dashboard/${role}`);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "User already exists with this email",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Sprout className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Join AgriFlow Digital today</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>I am a</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant={role === 'farmer' ? 'default' : 'outline'}
                  onClick={() => setRole('farmer')}
                  className="w-full"
                >
                  Farmer
                </Button>
                <Button
                  type="button"
                  variant={role === 'aggregator' ? 'default' : 'outline'}
                  onClick={() => setRole('aggregator')}
                  className="w-full"
                >
                  Aggregator
                </Button>
                <Button
                  type="button"
                  variant={role === 'admin' ? 'default' : 'outline'}
                  onClick={() => setRole('admin')}
                  className="w-full"
                >
                  Admin
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Create Account
            </Button>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Button
                type="button"
                variant="link"
                className="p-0"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;