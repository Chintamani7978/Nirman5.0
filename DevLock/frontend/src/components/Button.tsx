import { motion } from "motion/react";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "text";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  icon?: ReactNode;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  className = "",
  icon,
}: ButtonProps) {
  const baseStyles = "rounded-full font-medium transition-all duration-220 flex items-center justify-center gap-2";
  
  const variantStyles = {
    primary: "bg-gradient-to-r from-[#6C63FF] to-[#5CE1E6] text-white shadow-lg",
    secondary: "bg-white/10 text-white border border-white/20 backdrop-blur-sm",
    text: "bg-transparent text-[#5CE1E6] hover:bg-white/5",
  };
  
  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3",
    lg: "px-8 py-4 text-lg",
  };
  
  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";

  return (
    <motion.button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      animate={!disabled && variant === "primary" ? {
        boxShadow: [
          "0 0 20px rgba(108, 99, 255, 0.3)",
          "0 0 30px rgba(108, 99, 255, 0.6)",
          "0 0 20px rgba(108, 99, 255, 0.3)",
        ],
      } : {}}
      transition={{
        scale: { duration: 0.22, ease: [0.23, 0.78, 0.43, 1] },
        boxShadow: { duration: 2, repeat: Infinity },
      }}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="inline-flex">{icon}</span>}
      {children}
    </motion.button>
  );
}
