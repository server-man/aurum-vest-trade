
import { 
  Zap, 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  BarChart2, 
  Clock, 
  BellRing, 
  Bot 
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Zap className="h-10 w-10 text-binance-yellow" />,
      title: "Lightning Fast Execution",
      description: "Execute trades instantly with our high-performance infrastructure to capitalize on market opportunities."
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-binance-yellow" />,
      title: "Bank-Grade Security",
      description: "Your funds and data are protected with state-of-the-art encryption and security protocols."
    },
    {
      icon: <BarChart2 className="h-10 w-10 text-binance-yellow" />,
      title: "Advanced Technical Analysis",
      description: "Our bots utilize sophisticated technical indicators to identify profitable trading opportunities."
    },
    {
      icon: <TrendingUp className="h-10 w-10 text-binance-yellow" />,
      title: "AI Predictions",
      description: "Harness the power of machine learning for smarter trading decisions and market forecasting."
    },
    {
      icon: <Clock className="h-10 w-10 text-binance-yellow" />,
      title: "24/7 Automated Trading",
      description: "Never miss an opportunity with round-the-clock automated trading that works while you sleep."
    },
    {
      icon: <BellRing className="h-10 w-10 text-binance-yellow" />,
      title: "Real-time Alerts",
      description: "Stay informed with instant notifications about important market events and bot activities."
    },
    {
      icon: <Bot className="h-10 w-10 text-binance-yellow" />,
      title: "Custom Bot Strategies",
      description: "Create personalized trading strategies or choose from a variety of pre-built successful templates."
    },
    {
      icon: <Users className="h-10 w-10 text-binance-yellow" />,
      title: "Active Community",
      description: "Join a thriving community of traders to share strategies, tips, and insights."
    },
  ];

  return (
    <section className="section-padding bg-binance-black relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-binance-yellow/5 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-1/3 left-0 w-80 h-80 bg-binance-yellow/5 rounded-full filter blur-3xl"></div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="inline-block px-3 py-1 rounded-full bg-binance-yellow/10 text-binance-yellow text-sm font-medium mb-4">
            Powerful Features
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Everything You Need For <span className="text-gradient">Successful Trading</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Our platform combines cutting-edge technology with user-friendly design to give you the ultimate trading advantage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="glass-effect rounded-xl p-6 hover-scale"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
