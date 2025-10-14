
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/Logo";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const handleScroll = () => {
    if (window.scrollY > 20) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    ...(user ? [{ name: "Dashboard", path: "/dashboard" }] : []),
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-binance-black/90 backdrop-blur-lg shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="z-10">
            <Logo size="md" showText={true} />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`font-medium hover:text-binance-yellow transition-colors duration-300 ${
                  location.pathname === item.path
                    ? "text-binance-yellow"
                    : "text-white"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Action Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="w-6 h-6 border-2 border-binance-yellow border-t-transparent rounded-full animate-spin"></div>
            ) : user ? (
              <Button
                onClick={() => navigate('/dashboard')}
                variant="outline"
                className="border-binance-yellow text-binance-yellow hover:bg-binance-yellow hover:text-binance-black"
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => navigate('/auth')}
                  variant="ghost"
                  className="text-white hover:text-binance-yellow"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => navigate('/auth')}
                  className="bg-binance-yellow text-binance-black hover:brightness-110 transition-all"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Action Buttons */}
          <div className="md:hidden flex items-center space-x-2 z-10">
            {loading ? (
              <div className="w-6 h-6 border-2 border-binance-yellow border-t-transparent rounded-full animate-spin"></div>
            ) : user ? (
              <Button
                onClick={() => navigate('/dashboard')}
                variant="outline"
                size="sm"
                className="border-binance-yellow text-binance-yellow hover:bg-binance-yellow hover:text-binance-black"
              >
                Dashboard
              </Button>
            ) : (
              <Button
                onClick={() => navigate('/auth')}
                size="sm"
                className="bg-binance-yellow text-binance-black hover:brightness-110 transition-all"
              >
                Get Started
              </Button>
            )}
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
