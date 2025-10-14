import { Bot } from "lucide-react";
import { Link } from "react-router-dom";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export const Logo = ({ size = "md", showText = true, className = "" }: LogoProps) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <Link to="/" className={`flex items-center gap-2 group ${className}`}>
      {/* Bot Icon Container */}
      <div className="relative">
        <div className={`${sizeClasses[size]} rounded-lg bg-gradient-to-br from-primary via-yellow-500 to-yellow-600 p-1.5 shadow-lg shadow-primary/30 transition-all group-hover:shadow-xl group-hover:shadow-primary/40 group-hover:scale-105`}>
          <Bot className="w-full h-full text-black" strokeWidth={2.5} />
        </div>
      </div>
      
      {/* Brand Text */}
      {showText && (
        <span className={`${textSizeClasses[size]} font-bold text-foreground transition-colors group-hover:text-primary`}>
          Aurum Vest
        </span>
      )}
    </Link>
  );
};
