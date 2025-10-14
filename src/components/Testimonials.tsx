
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Alex Thompson",
    role: "Day Trader",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    content: "CryptoVest's automated bots have completely transformed my trading strategy. I've seen a 32% increase in my portfolio in just three months while spending less time monitoring the markets.",
    rating: 5,
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "Investment Analyst",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    content: "As a professional in finance, I was skeptical of automated trading, but CryptoVest changed my mind. The technical analysis is sophisticated and the execution is flawless.",
    rating: 5,
  },
  {
    id: 3,
    name: "Miguel Rodriguez",
    role: "Crypto Enthusiast",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    content: "The 24/7 trading capability is a game-changer. I no longer have to worry about missing opportunities while I sleep. My bots work around the clock to maximize my investments.",
    rating: 4,
  },
  {
    id: 4,
    name: "Emma Williams",
    role: "Software Engineer",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
    content: "The API is robust and the customization options are impressive. As someone who loves to tweak and optimize, CryptoVest gives me both automation and control.",
    rating: 5,
  },
  {
    id: 5,
    name: "David Park",
    role: "Long-term Investor",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
    content: "I've tried several trading bots, but CryptoVest stands out for its reliability and intuitive interface. Even during volatile markets, the performance has been impressive.",
    rating: 4,
  },
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      handleNext();
    }

    if (touchStart - touchEnd < -50) {
      handlePrev();
    }
  };

  useEffect(() => {
    // Auto-scroll testimonials
    intervalRef.current = window.setInterval(() => {
      handleNext();
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeIndex]);

  // Reset interval when manually changing slides
  const resetInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = window.setInterval(() => {
        handleNext();
      }, 5000);
    }
  };

  const handleDotClick = (index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex(index);
    resetInterval();
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <section className="section-padding relative overflow-hidden bg-gradient-to-b from-binance-black to-binance-darkGray">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-binance-yellow/5 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-binance-yellow/5 rounded-full filter blur-3xl"></div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <div className="inline-block px-3 py-1 rounded-full bg-binance-yellow/10 text-binance-yellow text-sm font-medium mb-4">
            Success Stories
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            What Our <span className="text-gradient">Traders Say</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Join thousands of satisfied traders who have transformed their crypto trading experience with our platform.
          </p>
        </div>

        <div 
          className="max-w-4xl mx-auto"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Testimonial cards */}
          <div className="relative h-[400px] md:h-[350px]">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                  activeIndex === index
                    ? "opacity-100 translate-x-0 scale-100 z-10"
                    : "opacity-0 translate-x-full scale-95 -z-10"
                }`}
              >
                <div className="glass-effect rounded-xl p-8 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex space-x-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < testimonial.rating ? "text-binance-yellow fill-binance-yellow" : "text-gray-400"}`}
                        />
                      ))}
                    </div>
                    <p className="text-white text-lg italic mb-6">"{testimonial.content}"</p>
                  </div>
                  <div className="flex items-center">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <h4 className="text-white font-medium">{testimonial.name}</h4>
                      <p className="text-gray-400 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={() => {
                handlePrev();
                resetInterval();
              }}
              className="p-2 rounded-full bg-binance-darkGray text-white hover:bg-binance-yellow hover:text-binance-black transition-colors duration-300"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    activeIndex === index ? "bg-binance-yellow w-6" : "bg-gray-600"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => {
                handleNext();
                resetInterval();
              }}
              className="p-2 rounded-full bg-binance-darkGray text-white hover:bg-binance-yellow hover:text-binance-black transition-colors duration-300"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
