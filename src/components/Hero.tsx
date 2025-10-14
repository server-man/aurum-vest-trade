
import { ArrowRight, ChevronRight, BarChart2, Activity, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import CTAButton from "./CTAButton";

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center pt-16">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-binance-yellow/10 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-binance-yellow/10 rounded-full filter blur-3xl translate-x-1/3 translate-y-1/3"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Text content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-2">
              <div className="inline-block px-3 py-1 rounded-full bg-binance-yellow/10 text-binance-yellow text-sm font-medium">
                Automated Trading
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-white">Advanced </span>
                <span className="text-gradient">Crypto Trading</span>
                <span className="text-white"> On Autopilot</span>
              </h1>
              <p className="text-gray-400 text-lg md:text-xl max-w-xl mt-4">
                Professional-grade automated trading bots that execute strategies 24/7, helping you maximize profits even while you sleep.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/auth">
                <CTAButton size="lg">
                  Start Trading Now <ArrowRight className="ml-2 h-5 w-5" />
                </CTAButton>
              </Link>
              <Link to="/about">
                <CTAButton variant="outline" size="lg">
                  Learn How It Works
                </CTAButton>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
              <div className="glass-effect p-4 rounded-xl">
                <div className="text-binance-yellow font-bold text-2xl">$2.5B+</div>
                <div className="text-gray-400 text-sm">Trading Volume</div>
              </div>
              <div className="glass-effect p-4 rounded-xl">
                <div className="text-binance-yellow font-bold text-2xl">50K+</div>
                <div className="text-gray-400 text-sm">Active Users</div>
              </div>
              <div className="glass-effect p-4 rounded-xl">
                <div className="text-binance-yellow font-bold text-2xl">99.9%</div>
                <div className="text-gray-400 text-sm">Uptime</div>
              </div>
            </div>
          </div>

          {/* Right column - Image */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Main dashboard mockup */}
              <div className="rounded-xl overflow-hidden border border-binance-darkGray glass-effect animate-float shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80" 
                  alt="Trading Dashboard" 
                  className="w-full h-auto rounded-t-xl"
                />
                <div className="p-4 bg-binance-black/80">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BarChart2 className="text-binance-yellow h-5 w-5" />
                      <span className="text-white font-medium">BTC/USDT Bot</span>
                    </div>
                    <div className="text-green-400 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span>+12.5%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-5 -right-5 glass-effect p-3 rounded-lg border border-binance-darkGray shadow-xl animate-float" style={{ animationDelay: "0.5s" }}>
                <Activity className="text-binance-yellow h-5 w-5" />
              </div>
              <div className="absolute -bottom-8 -left-8 glass-effect p-4 rounded-lg border border-binance-darkGray shadow-xl animate-float" style={{ animationDelay: "0.8s" }}>
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 bg-green-400 rounded-full"></div>
                  <span className="text-white text-sm">Auto-trading active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
