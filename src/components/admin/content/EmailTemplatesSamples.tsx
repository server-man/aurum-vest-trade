import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const sampleTemplates = [
  {
    name: "Welcome Email",
    subject: "Welcome to Aurum Vest - Start Trading with Confidence",
    html_content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Aurum Vest</title>
  <style>
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; padding: 20px !important; }
      .header { font-size: 24px !important; }
      .button { width: 100% !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0f0f0f;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0f0f0f;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table class="container" role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); border-radius: 12px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #f0b90b 0%, #c99200 100%);">
              <h1 class="header" style="margin: 0; color: #0f0f0f; font-size: 32px; font-weight: bold;">Welcome to Aurum Vest</h1>
              <p style="margin: 10px 0 0; color: #2d2d2d; font-size: 16px;">Your Journey to Automated Trading Success Begins</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px; color: #ffffff;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6;">Hi {{username}},</p>
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6;">
                Thank you for joining Aurum Vest! We're excited to have you as part of our community of traders leveraging cutting-edge AI technology for cryptocurrency trading.
              </p>
              
              <!-- Features -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0;">
                <tr>
                  <td style="padding: 20px; background-color: rgba(240, 185, 11, 0.1); border-left: 4px solid #f0b90b; margin-bottom: 15px; border-radius: 4px;">
                    <h3 style="margin: 0 0 10px; color: #f0b90b; font-size: 18px;">🤖 AI-Powered Trading</h3>
                    <p style="margin: 0; color: #cccccc; font-size: 14px; line-height: 1.5;">Our advanced algorithms analyze market trends 24/7 to execute optimal trades.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px; background-color: rgba(240, 185, 11, 0.1); border-left: 4px solid #f0b90b; margin-bottom: 15px; border-radius: 4px;">
                    <h3 style="margin: 0 0 10px; color: #f0b90b; font-size: 18px;">📊 Real-Time Signals</h3>
                    <p style="margin: 0; color: #cccccc; font-size: 14px; line-height: 1.5;">Get instant notifications on profitable trading opportunities.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px; background-color: rgba(240, 185, 11, 0.1); border-left: 4px solid #f0b90b; border-radius: 4px;">
                    <h3 style="margin: 0 0 10px; color: #f0b90b; font-size: 18px;">🔒 Secure & Reliable</h3>
                    <p style="margin: 0; color: #cccccc; font-size: 14px; line-height: 1.5;">Bank-level security to protect your investments and data.</p>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="https://aurumvest.xyz/dashboard" class="button" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #f0b90b 0%, #c99200 100%); color: #0f0f0f; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 16px;">Access Your Dashboard</a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 20px 0 0; font-size: 14px; line-height: 1.6; color: #cccccc;">
                Need help getting started? Check out our <a href="https://aurumvest.xyz/faq" style="color: #f0b90b; text-decoration: none;">FAQ</a> or <a href="https://aurumvest.xyz/dashboard/support" style="color: #f0b90b; text-decoration: none;">contact support</a>.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #0f0f0f; border-top: 1px solid #2d2d2d;">
              <p style="margin: 0 0 10px; font-size: 12px; color: #888888; text-align: center;">
                © 2025 Aurum Vest. All rights reserved.
              </p>
              <p style="margin: 0; font-size: 12px; color: #888888; text-align: center;">
                <a href="https://aurumvest.xyz/privacy" style="color: #888888; text-decoration: none;">Privacy Policy</a> | 
                <a href="https://aurumvest.xyz/terms" style="color: #888888; text-decoration: none;">Terms of Service</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    variables: ["username"]
  },
  {
    name: "Trade Alert",
    subject: "🚨 Trade Alert: {{trade_type}} Signal for {{symbol}}",
    html_content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Trade Alert</title>
  <style>
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; padding: 20px !important; }
      .stats-table td { display: block !important; width: 100% !important; padding: 10px 0 !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0f0f0f;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0f0f0f;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table class="container" role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); border-radius: 12px; overflow: hidden;">
          <!-- Alert Header -->
          <tr>
            <td style="padding: 30px 40px; text-align: center; background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
              <div style="font-size: 48px; margin-bottom: 10px;">🚨</div>
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Trade Signal Detected</h1>
              <p style="margin: 10px 0 0; color: #d1fae5; font-size: 14px;">{{timestamp}}</p>
            </td>
          </tr>
          
          <!-- Signal Details -->
          <tr>
            <td style="padding: 40px;">
              <table class="stats-table" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding: 20px; background-color: rgba(16, 185, 129, 0.1); border-radius: 8px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #2d2d2d;">
                          <span style="color: #888888; font-size: 14px;">Trading Pair</span>
                          <div style="color: #f0b90b; font-size: 24px; font-weight: bold; margin-top: 5px;">{{symbol}}</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #2d2d2d;">
                          <span style="color: #888888; font-size: 14px;">Signal Type</span>
                          <div style="color: #10b981; font-size: 20px; font-weight: bold; margin-top: 5px; text-transform: uppercase;">{{trade_type}}</div>
                        </td>
                      </tr>
                       <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #2d2d2d;">
                          <span style="color: #888888; font-size: 14px;">Current Price</span>
                          <div style="color: #ffffff; font-size: 20px; font-weight: bold; margin-top: 5px;">&#36;&#123;&#123;price&#125;&#125;</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #2d2d2d;">
                          <span style="color: #888888; font-size: 14px;">Target Price</span>
                          <div style="color: #10b981; font-size: 20px; font-weight: bold; margin-top: 5px;">&#36;&#123;&#123;target_price&#125;&#125;</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0;">
                          <span style="color: #888888; font-size: 14px;">Confidence Level</span>
                          <div style="color: #f0b90b; font-size: 20px; font-weight: bold; margin-top: 5px;">{{confidence}}%</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Action Button -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="https://aurumvest.xyz/dashboard/signals" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 16px;">View Full Analysis</a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 20px 0 0; font-size: 13px; line-height: 1.6; color: #888888; text-align: center;">
                ⚠️ Trading involves risk. Always do your own research and never invest more than you can afford to lose.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; background-color: #0f0f0f; border-top: 1px solid #2d2d2d; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #888888;">
                Aurum Vest AI Trading Platform
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    variables: ["symbol", "trade_type", "price", "target_price", "confidence", "timestamp"]
  },
  {
    name: "KYC Verification Status",
    subject: "KYC Verification Update - {{status}}",
    html_content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KYC Status Update</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0f0f0f;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0f0f0f;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); border-radius: 12px; overflow: hidden;">
          <tr>
            <td style="padding: 40px; color: #ffffff;">
              <h1 style="margin: 0 0 20px; color: #f0b90b; font-size: 28px;">KYC Verification Update</h1>
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6;">Hi {{username}},</p>
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6;">
                Your KYC verification status has been updated to: <strong style="color: #f0b90b;">{{status}}</strong>
              </p>
              
              {{#if approved}}
              <div style="padding: 20px; background-color: rgba(16, 185, 129, 0.1); border-left: 4px solid #10b981; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0; color: #10b981; font-size: 16px; font-weight: bold;">✓ Verification Approved</p>
                <p style="margin: 10px 0 0; color: #cccccc; font-size: 14px;">You now have full access to all trading features.</p>
              </div>
              {{/if}}
              
              {{#if rejected}}
              <div style="padding: 20px; background-color: rgba(239, 68, 68, 0.1); border-left: 4px solid #ef4444; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0; color: #ef4444; font-size: 16px; font-weight: bold;">✗ Verification Rejected</p>
                <p style="margin: 10px 0 0; color: #cccccc; font-size: 14px;">Reason: {{rejection_reason}}</p>
              </div>
              {{/if}}
              
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="https://aurumvest.xyz/dashboard/profile" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #f0b90b 0%, #c99200 100%); color: #0f0f0f; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 16px;">View Profile</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 40px; background-color: #0f0f0f; border-top: 1px solid #2d2d2d; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #888888;">© 2025 Aurum Vest</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    variables: ["username", "status", "approved", "rejected", "rejection_reason"]
  }
];

export const EmailTemplatesSamples = () => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCreateSample = async (template: typeof sampleTemplates[0]) => {
    setLoading(template.name);
    try {
      const { error } = await supabase
        .from('email_templates')
        .insert({
          name: template.name,
          subject: template.subject,
          html_content: template.html_content,
          variables: template.variables,
          is_active: true
        });

      if (error) throw error;
      toast.success(`Sample template "${template.name}" created successfully`);
    } catch (error: any) {
      console.error('Error creating sample:', error);
      toast.error(error.message || 'Failed to create sample template');
    } finally {
      setLoading(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sample Email Templates</CardTitle>
        <CardDescription>
          Pre-built responsive email templates designed for Aurum Vest
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {sampleTemplates.map((template) => (
          <div
            key={template.name}
            className="flex items-center justify-between p-4 border rounded-lg border-border hover:bg-muted/50 transition-colors"
          >
            <div>
              <h4 className="font-medium">{template.name}</h4>
              <p className="text-sm text-muted-foreground">{template.subject}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Variables: {template.variables.join(', ')}
              </p>
            </div>
            <Button
              onClick={() => handleCreateSample(template)}
              disabled={loading === template.name}
              variant="outline"
            >
              {loading === template.name ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Template'
              )}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
