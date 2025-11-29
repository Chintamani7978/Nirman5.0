import { motion } from "motion/react";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function GlassCard({ children, className = "", hover = false, onClick }: GlassCardProps) {
  return (
    <motion.div
      className={`glass-card p-4 ${hover ? "cursor-pointer" : ""} ${className}`}
      whileHover={hover ? { scale: 1.02, boxShadow: "0 12px 40px rgba(108, 99, 255, 0.25)" } : {}}
      transition={{
        duration: 0.22,
        ease: [0.23, 0.78, 0.43, 1],
      }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
