import { motion } from "motion/react";
import { Copy, Trash2, Clock, Eye } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { useState } from "react";

interface AliasRowProps {
  alias: {
    id: string;
    email: string;
    status: "active" | "expired" | "destroyed";
    timeRemaining: string;
    logsCount: number;
    createdAt: string;
  };
  onCopy: (email: string) => void;
  onDestroy: (id: string) => void;
  onViewDetails: (id: string) => void;
  delay?: number;
}

export function AliasRow({ alias, onCopy, onDestroy, onViewDetails, delay = 0 }: AliasRowProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="glass-card p-4 cursor-pointer"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.22,
        delay: delay * 0.07,
        ease: [0.23, 0.78, 0.43, 1],
      }}
      whileHover={{ scale: 1.01, boxShadow: "0 12px 40px rgba(108, 99, 255, 0.2)" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onViewDetails(alias.id)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <p className="font-mono text-sm text-[#EDEDED] truncate">{alias.email}</p>
            <StatusBadge status={alias.status} />
          </div>
          <div className="flex items-center gap-4 text-xs text-[#9CA3AF]">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {alias.timeRemaining}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {alias.logsCount} logs
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
          transition={{ duration: 0.12 }}
        >
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onCopy(alias.email);
            }}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Copy className="w-4 h-4 text-[#5CE1E6]" />
          </motion.button>
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onDestroy(alias.id);
            }}
            className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Trash2 className="w-4 h-4 text-[#EF4444]" />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
