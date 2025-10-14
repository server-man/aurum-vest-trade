
import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CTAButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const CTAButton = ({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  ...props 
}: CTAButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-binance-yellow";
  
  const variants = {
    primary: "bg-binance-yellow text-binance-black hover:brightness-110 shadow-lg",
    secondary: "bg-binance-darkGray text-white hover:bg-binance-lightGray",
    outline: "bg-transparent border border-binance-yellow text-binance-yellow hover:bg-binance-yellow/10",
    ghost: "bg-transparent text-white hover:bg-white/10"
  };
  
  const sizes = {
    sm: "py-2 px-4 text-sm",
    md: "py-3 px-6 text-base",
    lg: "py-4 px-8 text-lg"
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default CTAButton;
