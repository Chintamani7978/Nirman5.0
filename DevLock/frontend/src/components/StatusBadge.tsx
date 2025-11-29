import { motion } from "motion/react";

interface StatusBadgeProps {
  status: "active" | "expired" | "destroyed";
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const statusConfig = {
    active: {
      color: "#5CE1E6",
      bg: "rgba(92, 225, 230, 0.15)",
      label: "Active",
    },
    expired: {
      color: "#F59E0B",
      bg: "rgba(245, 158, 11, 0.15)",
      label: "Expired",
    },
    destroyed: {
      color: "#EF4444",
      bg: "rgba(239, 68, 68, 0.15)",
      label: "Destroyed",
    },
  };

  const config = statusConfig[status];

  return (
    <motion.div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${className}`}
      style={{
        backgroundColor: config.bg,
        color: config.color,
        border: `1px solid ${config.color}40`,
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.22 }}
    >
      <motion.div
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: config.color }}
        animate={status === "active" ? {
          boxShadow: [
            `0 0 4px ${config.color}`,
            `0 0 8px ${config.color}`,
            `0 0 4px ${config.color}`,
          ],
        } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <span>{config.label}</span>
    </motion.div>
  );
}
