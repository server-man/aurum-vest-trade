
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import Visualizations from "@/components/Visualizations";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTAButton from "@/components/CTAButton";
import { ArrowRight, MessageSquare, ShieldCheck, BarChart2 } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-binance-black text-white">
      <Navbar />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Features Section */}
      <Features />
      
      {/* Trading Bot Visualization Section */}
      <Visualizations />
      
      {/* Testimonials Section */}
      <Testimonials />
      
      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden bg-binance-black">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-0 w-96 h-96 bg-binance-yellow/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-binance-yellow/5 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to <span className="text-gradient">Revolutionize</span> Your Crypto Trading?
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Join thousands of traders who are already using Aurum Vest's automated trading bots to maximize their profits.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
              <Link to="/auth">
                <CTAButton size="lg">
                  Start Trading Now <ArrowRight className="ml-2 h-5 w-5" />
                </CTAButton>
              </Link>
              <Link to="#">
                <CTAButton variant="outline" size="lg">
                  <MessageSquare className="mr-2 h-5 w-5" /> Live Demo
                </CTAButton>
              </Link>
            </div>
          </div>
          
          {/* Additional info cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="glass-effect rounded-xl p-6 hover-scale">
              <ShieldCheck className="h-10 w-10 text-binance-yellow mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure & Reliable</h3>
              <p className="text-gray-400">
                Bank-level security with 2FA, encryption, and advanced security protocols to keep your funds safe.
              </p>
            </div>
            
            <div className="glass-effect rounded-xl p-6 hover-scale">
              <BarChart2 className="h-10 w-10 text-binance-yellow mb-4" />
              <h3 className="text-xl font-semibold mb-2">Data-Driven Trading</h3>
              <p className="text-gray-400">
                Make informed decisions with real-time analytics, market insights, and performance tracking.
              </p>
            </div>
            
            <div className="glass-effect rounded-xl p-6 hover-scale">
              <MessageSquare className="h-10 w-10 text-binance-yellow mb-4" />
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-400">
                Our dedicated support team is available round-the-clock to assist you with any questions or issues.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
