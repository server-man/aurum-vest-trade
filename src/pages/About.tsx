
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTAButton from "@/components/CTAButton";
import { Link } from "react-router-dom";
import { ShieldCheck, Users, BarChart2, Clock, ArrowRight } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-binance-black text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-binance-yellow/10 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-binance-yellow/5 rounded-full filter blur-3xl translate-x-1/3 translate-y-1/3"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block px-3 py-1 rounded-full bg-binance-yellow/10 text-binance-yellow text-sm font-medium mb-4">
              About Aurum Vest
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our Mission is to <span className="text-gradient">Democratize</span> Crypto Trading
            </h1>
            <p className="text-gray-400 text-lg md:text-xl">
              We're building advanced trading technology that was once only available to institutional investors and making it accessible to everyone.
            </p>
          </div>
        </div>
      </section>
      
      {/* Our Story Section */}
      <section className="py-16 md:py-24 relative bg-binance-darkGray/50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block px-3 py-1 rounded-full bg-binance-yellow/10 text-binance-yellow text-sm font-medium">
                Our Story
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">
                From Crypto Enthusiasts to <span className="text-gradient">Trading Experts</span>
              </h2>
              <p className="text-gray-400">
                Aurum Vest was founded in 2021 by a team of blockchain developers, data scientists, and veteran traders who saw an opportunity to bridge the gap between sophisticated trading algorithms and everyday crypto investors.
              </p>
              <p className="text-gray-400">
                After experiencing the challenges of 24/7 crypto markets firsthand, our founders built the first prototype of our automated trading system to solve their own pain points. What started as a personal solution quickly grew into a platform trusted by thousands of traders worldwide.
              </p>
              <p className="text-gray-400">
                Today, Aurum Vest is a leader in cryptocurrency automated trading, constantly innovating to provide our users with cutting-edge tools and strategies to navigate the volatile crypto markets.
              </p>
            </div>
            
            <div className="relative">
              <div className="glass-effect rounded-xl p-2 border border-binance-darkGray shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80" 
                  alt="Team working on trading algorithms" 
                  className="rounded-lg w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-5 -right-5 glass-effect p-4 rounded-lg border border-binance-darkGray shadow-xl animate-float">
                <div className="text-binance-yellow font-bold">3+ Years</div>
                <div className="text-white text-sm">Market Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Values Section */}
      <section className="py-16 md:py-24 bg-binance-black">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-block px-3 py-1 rounded-full bg-binance-yellow/10 text-binance-yellow text-sm font-medium mb-4">
              Our Values
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              The Principles That <span className="text-gradient">Drive Us</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Our core values shape everything we do, from product development to customer support.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="glass-effect rounded-xl p-6 hover-scale">
              <ShieldCheck className="h-12 w-12 text-binance-yellow mb-4" />
              <h3 className="text-xl font-semibold mb-2">Security First</h3>
              <p className="text-gray-400">
                We prioritize the security of your funds and data above all else, implementing bank-grade security protocols.
              </p>
            </div>
            
            <div className="glass-effect rounded-xl p-6 hover-scale">
              <Users className="h-12 w-12 text-binance-yellow mb-4" />
              <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
              <p className="text-gray-400">
                We actively listen to our users and develop features based on community feedback and needs.
              </p>
            </div>
            
            <div className="glass-effect rounded-xl p-6 hover-scale">
              <BarChart2 className="h-12 w-12 text-binance-yellow mb-4" />
              <h3 className="text-xl font-semibold mb-2">Data Transparency</h3>
              <p className="text-gray-400">
                We provide clear insights into bot performance, allowing you to make informed decisions.
              </p>
            </div>
            
            <div className="glass-effect rounded-xl p-6 hover-scale">
              <Clock className="h-12 w-12 text-binance-yellow mb-4" />
              <h3 className="text-xl font-semibold mb-2">Continuous Innovation</h3>
              <p className="text-gray-400">
                We're constantly improving our platform, adding new features and trading strategies.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-16 md:py-24 bg-binance-darkGray/50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-block px-3 py-1 rounded-full bg-binance-yellow/10 text-binance-yellow text-sm font-medium mb-4">
              Our Team
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Meet the <span className="text-gradient">Experts</span> Behind Aurum Vest
            </h2>
            <p className="text-gray-400 text-lg">
              Our diverse team combines decades of experience in finance, blockchain technology, and software development.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Alex Johnson",
                role: "CEO & Co-Founder",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
                bio: "Former quantitative trader with 10+ years experience at top financial institutions. Blockchain enthusiast since 2013."
              },
              {
                name: "Sarah Chen",
                role: "CTO & Co-Founder",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
                bio: "Computer science PhD with specialization in machine learning. Led engineering teams at major tech companies."
              },
              {
                name: "Michael Rodriguez",
                role: "Head of Trading Strategies",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
                bio: "Veteran crypto trader and technical analyst with experience developing algorithmic trading systems."
              },
            ].map((member, index) => (
              <div key={index} className="glass-effect rounded-xl p-6 flex flex-col items-center text-center hover-scale">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-24 h-24 rounded-full object-cover mb-4"
                />
                <h3 className="text-xl font-semibold text-white">{member.name}</h3>
                <div className="text-binance-yellow mb-3">{member.role}</div>
                <p className="text-gray-400">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-binance-black">
        <div className="container mx-auto px-4 md:px-8">
          <div className="glass-effect rounded-xl p-8 md:p-12 text-center max-w-3xl mx-auto border border-binance-darkGray">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Join Our Trading Revolution
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Experience the power of automated trading with Aurum Vest's cutting-edge platform.
            </p>
            <Link to="/register">
              <CTAButton size="lg">
                Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
              </CTAButton>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default About;
