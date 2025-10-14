import { Logo as LogoComponent } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Download, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Logo = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-gradient">Aurum Vest</h1>
          <p className="text-xl text-muted-foreground">
            Automated Trading Bot Platform
          </p>
        </div>

        {/* Logo Showcase */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Large logo */}
          <div className="flex items-center justify-center p-12 glass-effect rounded-2xl">
            <LogoComponent size="lg" showText={true} />
          </div>

          {/* Logo variations */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-6">Logo Variations</h2>
              <div className="grid grid-cols-3 gap-6">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 bg-secondary rounded-lg">
                    <LogoComponent size="sm" showText={false} />
                  </div>
                  <span className="text-xs text-muted-foreground">Small</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 bg-secondary rounded-lg">
                    <LogoComponent size="md" showText={false} />
                  </div>
                  <span className="text-xs text-muted-foreground">Medium</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 bg-secondary rounded-lg">
                    <LogoComponent size="lg" showText={false} />
                  </div>
                  <span className="text-xs text-muted-foreground">Large</span>
                </div>
              </div>
            </div>

            {/* Brand colors */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Brand Colors</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary" />
                  <div>
                    <p className="text-sm font-medium">Primary Gold</p>
                    <p className="text-xs text-muted-foreground">HSL(45, 100%, 51%)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-yellow-400" />
                  <div>
                    <p className="text-sm font-medium">Accent Yellow</p>
                    <p className="text-xs text-muted-foreground">Yellow-400</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button onClick={() => navigate("/")} size="lg">
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Button>
          <Button variant="outline" size="lg">
            <Download className="mr-2 h-5 w-5" />
            Download Assets
          </Button>
        </div>

        {/* Logo description */}
        <div className="glass-effect p-6 rounded-xl space-y-4">
          <h3 className="text-xl font-semibold">About the Logo</h3>
          <p className="text-muted-foreground leading-relaxed">
            The Aurum Vest logo features a clean, modern Trading Bot icon that represents 
            automated excellence and algorithmic precision. The golden gradient symbolizes 
            "Aurum" (Latin for gold), reflecting wealth, prosperity, and premium quality. 
            The bot icon embodies our core mission: intelligent, automated trading solutions 
            that work tirelessly for your financial success. The minimalist design ensures 
            versatility across all platforms while maintaining instant brand recognition.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Logo;
