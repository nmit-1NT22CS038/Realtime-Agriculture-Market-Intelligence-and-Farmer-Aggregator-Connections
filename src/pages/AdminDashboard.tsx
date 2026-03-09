import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, MessageSquare, TrendingUp, Users, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api, type AdminStats } from "@/lib/api";

const fallbackMonthlySales = [
  { month: 'Jan', sales: 150000 },
  { month: 'Feb', sales: 180000 },
  { month: 'Mar', sales: 220000 },
];

const fallbackProductSales = [
  { product: 'Wheat', sales: 450000 },
  { product: 'Rice', sales: 380000 },
  { product: 'Vegetables', sales: 420000 },
];

const AdminDashboard = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState<'farmers' | 'aggregators' | 'all'>('all');

  const [stats, setStats] = useState<AdminStats>({
    totalSales: 1250000,
    farmers: 45,
    aggregators: 12,
    salesByMonth: fallbackMonthlySales,
    salesByProduct: fallbackProductSales
  });

  useEffect(() => {
    if (!token) return;
    api.getAdminStats(token)
      .then((data) => {
        setStats({
          ...data,
          salesByMonth: data.salesByMonth.length ? data.salesByMonth : fallbackMonthlySales,
          salesByProduct: data.salesByProduct.length ? data.salesByProduct : fallbackProductSales,
        });
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Failed to load stats",
          description: "Check backend server and login again.",
        });
      });
  }, [token, toast]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSendMessage = async () => {
    if (!token) return;
    if (!message.trim()) {
      toast({
        variant: "destructive",
        title: "Message required",
        description: "Please type the announcement first.",
      });
      return;
    }

    try {
      await api.sendAnnouncement(token, { recipient, message });
      toast({
        title: "Message sent!",
        description: `Announcement sent to ${recipient}`,
      });
      setMessage("");
    } catch {
      toast({
        variant: "destructive",
        title: "Failed to send message",
        description: "Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-muted p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-card rounded-lg p-6 mb-6 flex justify-between items-center shadow">
          <div>
            <h1 className="text-3xl font-bold text-card-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome, {user?.name}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.totalSales.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Registered Farmers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.farmers}</div>
              <p className="text-xs text-muted-foreground">+3 new this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Registered Aggregators</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.aggregators}</div>
              <p className="text-xs text-muted-foreground">+1 new this month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Send Announcement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" />
                Send Announcement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Send to</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={recipient === 'farmers' ? 'default' : 'outline'}
                      onClick={() => setRecipient('farmers')}
                    >
                      Farmers
                    </Button>
                    <Button
                      variant={recipient === 'aggregators' ? 'default' : 'outline'}
                      onClick={() => setRecipient('aggregators')}
                    >
                      Aggregators
                    </Button>
                    <Button
                      variant={recipient === 'all' ? 'default' : 'outline'}
                      onClick={() => setRecipient('all')}
                    >
                      All
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your announcement message..."
                    rows={5}
                  />
                </div>

                <Button onClick={handleSendMessage} className="w-full">
                  Send Announcement
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sales Analytics */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Sales by Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.salesByMonth.map((item) => (
                    <div key={item.month} className="flex justify-between items-center">
                      <span className="font-medium">{item.month}</span>
                      <span className="text-primary font-semibold">
                        ₹{item.sales.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Sales by Product
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.salesByProduct.map((item) => (
                    <div key={item.product} className="flex justify-between items-center">
                      <span className="font-medium">{item.product}</span>
                      <span className="text-primary font-semibold">
                        ₹{item.sales.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;