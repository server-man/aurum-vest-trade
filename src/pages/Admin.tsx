import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Users, Shield, Activity, Database, AlertCircle, Bot, TrendingUp, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AdminKYCManagement } from "@/components/admin/AdminKYCManagement";
import { AdminBotManagement } from "@/components/admin/AdminBotManagement";
import { AdminSignalsManagement } from "@/components/admin/AdminSignalsManagement";

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBots: 0,
    totalTransactions: 0,
    pendingKYC: 0
  });

  useEffect(() => {
    checkAdminAccess();
  }, [user]);

  const checkAdminAccess = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    try {
      // Check if user has admin role
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error || !data || data.role !== 'admin') {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page.",
          variant: "destructive"
        });
        navigate("/dashboard");
        return;
      }

      setIsAdmin(true);
      await fetchAdminStats();
    } catch (error) {
      console.error("Error checking admin access:", error);
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminStats = async () => {
    try {
      // Fetch total users count
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch total bots count
      const { count: botsCount } = await supabase
        .from('trading_bots')
        .select('*', { count: 'exact', head: true });

      // Fetch total transactions count
      const { count: transactionsCount } = await supabase
        .from('wallet_transactions')
        .select('*', { count: 'exact', head: true });

      // Fetch pending KYC count
      const { count: kycCount } = await supabase
        .from('kyc_verifications')
        .select('*', { count: 'exact', head: true })
        .eq('verification_status', 'pending');

      setStats({
        totalUsers: usersCount || 0,
        totalBots: botsCount || 0,
        totalTransactions: transactionsCount || 0,
        pendingKYC: kycCount || 0
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    }
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-sm sm:text-base text-gray-400 mt-1 sm:mt-2">Monitor and manage platform operations</p>
          </div>
          <Button 
            onClick={() => navigate("/admin/content-management")}
            className="bg-gradient-to-r from-binance-yellow to-yellow-500 text-binance-black hover:from-yellow-400 hover:to-yellow-600"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Content Management
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          <Card className="bg-binance-darkGray border-binance-darkGray">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-binance-yellow" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
              <p className="text-xs text-gray-500 mt-1">Registered users</p>
            </CardContent>
          </Card>

          <Card className="bg-binance-darkGray border-binance-darkGray">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Trading Bots
              </CardTitle>
              <Activity className="h-4 w-4 text-binance-yellow" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalBots}</div>
              <p className="text-xs text-gray-500 mt-1">Active bots</p>
            </CardContent>
          </Card>

          <Card className="bg-binance-darkGray border-binance-darkGray">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Transactions
              </CardTitle>
              <Database className="h-4 w-4 text-binance-yellow" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalTransactions}</div>
              <p className="text-xs text-gray-500 mt-1">Total transactions</p>
            </CardContent>
          </Card>

          <Card className="bg-binance-darkGray border-binance-darkGray">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Pending KYC
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-binance-yellow" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.pendingKYC}</div>
              <p className="text-xs text-gray-500 mt-1">Awaiting review</p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Management Tabs */}
        <Tabs defaultValue="kyc" className="space-y-4">
          <TabsList className="bg-card border-border w-full sm:w-auto grid grid-cols-3 sm:inline-flex">
            <TabsTrigger value="kyc" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm">
              <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">KYC Management</span>
              <span className="sm:hidden">KYC</span>
            </TabsTrigger>
            <TabsTrigger value="bots" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm">
              <Bot className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Trading Bots</span>
              <span className="sm:hidden">Bots</span>
            </TabsTrigger>
            <TabsTrigger value="signals" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Signals</span>
              <span className="sm:hidden">Signals</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="kyc" className="space-y-4">
            <AdminKYCManagement />
          </TabsContent>

          <TabsContent value="bots" className="space-y-4">
            <AdminBotManagement />
          </TabsContent>

          <TabsContent value="signals" className="space-y-4">
            <AdminSignalsManagement />
          </TabsContent>
        </Tabs>

        {/* Security Notice */}
        <Card className="bg-binance-yellow/10 border-binance-yellow/30">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-4">
              <Shield className="h-5 w-5 text-binance-yellow flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-white mb-1">Admin Access</h3>
                <p className="text-sm text-gray-300">
                  You are logged in with administrative privileges. All actions are logged and monitored 
                  for security purposes. Please handle sensitive information responsibly.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Admin;