import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Github, Database, Lock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const AdminVerification = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  const handleSupabaseVerification = async () => {
    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    setLoading(true);
    try {
      // Call admin verification edge function
      const { data, error } = await supabase.functions.invoke('admin-verification', {
        body: {
          verificationType: 'password',
          password: password,
        },
      });

      if (error) throw error;

      if (data?.success) {
        toast.success("Verification successful! Redirecting...");
        setTimeout(() => navigate('/admin'), 1000);
      } else {
        throw new Error(data?.error || "Verification failed");
      }
    } catch (error: any) {
      toast.error(error.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGithubVerification = async () => {
    setLoading(true);
    try {
      // Initiate GitHub OAuth flow - will verify admin role after callback
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: 'https://aurumvest.xyz/admin/verify-callback',
          scopes: 'user:email',
        },
      });

      if (error) throw error;

      toast.success("Redirecting to GitHub for authentication...");
    } catch (error: any) {
      toast.error(error.message || "GitHub verification failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Back Button */}
        <Button
          onClick={() => navigate("/dashboard")}
          variant="ghost"
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Header Card */}
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Admin Verification Required</CardTitle>
            <CardDescription className="text-base">
              Verify your identity to access the admin panel
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Verification Methods */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <Tabs defaultValue="supabase" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="supabase" className="data-[state=active]:bg-primary">
                  <Database className="h-4 w-4 mr-2" />
                  Supabase
                </TabsTrigger>
                <TabsTrigger value="github" className="data-[state=active]:bg-primary">
                  <Github className="h-4 w-4 mr-2" />
                  GitHub OAuth
                </TabsTrigger>
              </TabsList>

              {/* Supabase Verification */}
              <TabsContent value="supabase" className="space-y-4">
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="supabase-password">Confirm Your Password</Label>
                    <Input
                      id="supabase-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSupabaseVerification()}
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter your account password to verify
                    </p>
                  </div>
                  <Button
                    onClick={handleSupabaseVerification}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? "Verifying..." : "Verify with Password"}
                  </Button>
                </div>
              </TabsContent>

              {/* GitHub Verification */}
              <TabsContent value="github" className="space-y-4">
                <div className="space-y-4 pt-4">
                  <div className="p-4 bg-muted rounded-lg space-y-3">
                    <p className="text-sm text-foreground">
                      Authenticate with GitHub OAuth to verify your admin access. This will:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Verify your GitHub identity</li>
                      <li>Grant access to repository management</li>
                      <li>Enable automated workflows</li>
                    </ul>
                  </div>
                  <Button
                    onClick={handleGithubVerification}
                    disabled={loading}
                    className="w-full"
                  >
                    <Github className="h-4 w-4 mr-2" />
                    {loading ? "Redirecting..." : "Authenticate with GitHub"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="bg-yellow-500/10 border-yellow-500/30">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Lock className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Security Notice</h3>
                <p className="text-sm text-muted-foreground">
                  Admin verification is required every session for security. Your credentials are verified server-side and never stored in the browser. All admin actions are logged and monitored.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminVerification;
