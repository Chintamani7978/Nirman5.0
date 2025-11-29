import { motion, AnimatePresence } from "motion/react";
import { Check, AlertCircle, Info } from "lucide-react";

interface ToastProps {
  isVisible: boolean;
  message: string;
  type?: "success" | "error" | "info";
}

export function Toast({ isVisible, message, type = "success" }: ToastProps) {
  const icons = {
    success: <Check className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  const colors = {
    success: "#5CE1E6",
    error: "#EF4444",
    info: "#6C63FF",
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-4 right-4 z-50"
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.25, ease: [0.23, 0.78, 0.43, 1] }}
        >
          <div
            className="glass-card px-4 py-3 flex items-center gap-3"
            style={{ borderLeft: `3px solid ${colors[type]}` }}
          >
            <motion.div
              style={{ color: colors[type] }}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {icons[type]}
            </motion.div>
            <span className="text-sm">{message}</span>
            
            {/* Particle spark effect */}
            {type === "success" && (
              <>
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full"
                    style={{ 
                      backgroundColor: colors[type],
                      top: "50%",
                      left: "20px",
                    }}
                    initial={{ 
                      opacity: 1, 
                      scale: 0,
                      x: 0,
                      y: 0,
                    }}
                    animate={{
                      opacity: 0,
                      scale: 1,
                      x: Math.cos((i / 6) * Math.PI * 2) * 20,
                      y: Math.sin((i / 6) * Math.PI * 2) * 20,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: 0.1,
                      ease: [0.23, 0.78, 0.43, 1],
                    }}
                  />
                ))}
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
