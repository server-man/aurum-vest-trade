
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-binance-black border-t border-binance-darkGray">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1 - Logo and Description */}
          <div className="space-y-4">
            <Logo size="md" showText={true} />
            <p className="text-gray-400 mt-4 max-w-xs">
              Automated cryptocurrency trading platform providing advanced bots 
              for maximizing your crypto investments with minimal effort.
            </p>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-binance-yellow transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-binance-yellow transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-binance-yellow transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-binance-yellow transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Legal */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-binance-yellow transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-binance-yellow transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-400 hover:text-binance-yellow transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/gdpr" className="text-gray-400 hover:text-binance-yellow transition-colors">
                  GDPR Compliance
                </Link>
              </li>
              <li>
                <Link to="/soc2" className="text-gray-400 hover:text-binance-yellow transition-colors">
                  SOC 2 Compliance
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">
                <span className="block">Email:</span>
                <a href="mailto:support@cryptovest.xyz" className="text-binance-yellow hover:underline">
                  support@cryptovest.xyz
                </a>
              </li>
              <li className="text-gray-400">
                <span className="block">Support:</span>
                <Link to="/contact" className="text-binance-yellow hover:underline">
                  Contact Us
                </Link>
              </li>
              <li className="text-gray-400">
                <span className="block">Community:</span>
                <Link to="#" className="text-binance-yellow hover:underline">
                  Join our Telegram
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-binance-darkGray text-center md:flex md:justify-between md:items-center">
          <p className="text-gray-500 text-sm">
            © {currentYear} Aurum Vest. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-4 justify-center md:justify-end">
            <a href="#" className="text-gray-400 hover:text-binance-yellow transition-colors">
              Twitter
            </a>
            <a href="#" className="text-gray-400 hover:text-binance-yellow transition-colors">
              Telegram
            </a>
            <a href="#" className="text-gray-400 hover:text-binance-yellow transition-colors">
              Discord
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
