import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Github, Cpu, Plug, Shield, Check, X, Lock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { GitHubIntegration } from "@/components/admin/GitHubIntegration";

const AdminSettings = () => {
  const integrations = [
    {
      name: "Supabase",
      icon: Database,
      status: "connected",
      details: {
        "Project ID": "fapdrnwrkeivaxglyeiy",
        "Database": "PostgreSQL 15",
        "Region": "US East",
        "Status": "Active",
        "RLS Enabled": "Yes"
      }
    },
    {
      name: "GitHub",
      icon: Github,
      status: "connected",
      details: {
        "Repository": "aurumvest",
        "Deployment": "Automatic",
        "Branch": "main",
        "Last Sync": "Active"
      }
    },
    {
      name: "AI Providers",
      icon: Cpu,
      status: "connected",
      details: {
        "OpenRouter": "Enabled",
        "HuggingFace": "Enabled",
        "Alpha Vantage": "Enabled",
        "Runware": "Enabled"
      }
    },
    {
      name: "Custom Extensions",
      icon: Plug,
      status: "configured",
      details: {
        "Exchange Rates API": "Active",
        "Redis Cache": "Active",
        "WebSocket Relay": "Active",
        "Email Service": "Active"
      }
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Platform Settings</h1>
          <p className="text-gray-400 mt-2">
            Read-only view of platform integrations and configurations
          </p>
        </div>

        {/* GitHub Management Section */}
        <GitHubIntegration />

        {/* Security Notice */}
        <Card className="bg-green-500/10 border-green-500/30">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-4">
              <Lock className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-white mb-1">Write Access Enabled</h3>
                <p className="text-sm text-gray-300">
                  You can now manage GitHub workflows and documentation directly from this panel.
                  Changes are pushed to the repository using GitHub OAuth with appropriate scopes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integrations Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {integrations.map((integration) => (
            <Card key={integration.name} className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <integration.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <CardDescription className="mt-1">
                        Integration Status
                      </CardDescription>
                    </div>
                  </div>
                  <Badge 
                    variant={integration.status === "connected" ? "default" : "secondary"}
                    className="capitalize"
                  >
                    {integration.status === "connected" ? (
                      <Check className="h-3 w-3 mr-1" />
                    ) : (
                      <X className="h-3 w-3 mr-1" />
                    )}
                    {integration.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(integration.details).map(([key, value], index) => (
                    <div key={key}>
                      {index > 0 && <Separator className="my-3" />}
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{key}</span>
                        <span className="text-sm font-medium text-foreground">{value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Edge Functions Status */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Cpu className="h-5 w-5" />
              <span>Edge Functions Status</span>
            </CardTitle>
            <CardDescription>
              Active serverless functions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              {[
                "crypto-ai-agent",
                "market-data-sync",
                "send-notification",
                "send-email",
                "websocket-relay",
                "ip-geolocation",
                "security-pin",
                "two-factor-auth",
                "webauthn-passkey",
                "redis-cache",
                "exchange-rates",
                "stock-data",
                "crypto-candles",
                "price-alert-monitor",
                "price-predictions",
                "admin-verification"
              ].map((func) => (
                <div 
                  key={func}
                  className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                >
                  <span className="text-sm font-mono text-foreground">{func}</span>
                  <Badge variant="outline" className="text-green-500 border-green-500">
                    Active
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminSettings;
