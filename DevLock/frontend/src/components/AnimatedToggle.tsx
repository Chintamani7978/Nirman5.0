import { motion } from "motion/react";
import { useEffect, useState } from "react";
import incognitoIcon from "../assets/1917b702add36eae98c8a6d78ef5c9a3c688af75.png";

interface AnimatedToggleProps {
  onComplete: () => void;
}

export function AnimatedToggle({ onComplete }: AnimatedToggleProps) {
  const [isOn, setIsOn] = useState(false);

  useEffect(() => {
    // Auto-toggle on after 1200ms delay
    const timer = setTimeout(() => {
      setIsOn(true);
      // Call onComplete after toggle animation finishes
      setTimeout(onComplete, 1200);
    }, 1200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center gap-6 relative">
      {/* Label */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.23, 0.78, 0.43, 1] }}
      >
        <p className="text-[#9CA3AF] text-sm mb-2">Activate Privacy Mode</p>
      </motion.div>

      {/* Toggle Switch */}
      <motion.div
        className="relative w-32 h-16 rounded-full cursor-pointer"
        style={{
          backgroundColor: isOn ? "#6C63FF" : "#2A2A2A",
          border: isOn ? "2px solid #5CE1E6" : "2px solid #3A3A3A",
        }}
        animate={{
          boxShadow: isOn
            ? [
              "0 0 20px rgba(108, 99, 255, 0.4)",
              "0 0 40px rgba(92, 225, 230, 0.6)",
              "0 0 20px rgba(108, 99, 255, 0.4)",
            ]
            : "0 0 0px rgba(0, 0, 0, 0)",
        }}
        transition={{
          backgroundColor: { duration: 0.9, ease: [0.23, 0.78, 0.43, 1] },
          border: { duration: 0.9 },
          boxShadow: { duration: 3, repeat: Infinity },
        }}
      >
        {/* OFF/ON Labels - Positioned behind knob */}
        <div className="absolute inset-0 flex items-center justify-between px-5 pointer-events-none z-0">
          <motion.span
            className="text-xs font-semibold"
            animate={{
              opacity: isOn ? 0 : 0.9,
              x: isOn ? -10 : 0,
            }}
            transition={{ duration: 0.3 }}
            style={{ color: "#D1D5DB" }}
          >
            OFF
          </motion.span>
          <motion.span
            className="text-xs font-semibold"
            animate={{
              opacity: isOn ? 0.9 : 0,
              x: isOn ? 0 : 10,
            }}
            transition={{ duration: 0.3 }}
            style={{ color: "#FFFFFF" }}
          >
            ON
          </motion.span>
        </div>

        {/* Toggle Knob */}
        <motion.div
          className="absolute top-1 w-12 h-12 rounded-full bg-white flex items-center justify-center z-10"
          style={{
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
          }}
          animate={{
            x: isOn ? 72 : 4,
          }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 25,
          }}
        >
          {/* Icon inside knob */}
          <motion.div
            animate={{
              rotate: isOn ? 360 : 0,
              scale: isOn ? [1, 1.2, 1] : 1,
            }}
            transition={{
              rotate: { duration: 0.9, ease: [0.23, 0.78, 0.43, 1] },
              scale: { duration: 0.6 },
            }}
          >
            <img
              src={incognitoIcon}
              alt="Incognito Icon"
              className="w-6 h-6"
              style={{
                filter: isOn
                  ? 'brightness(0) saturate(100%) invert(46%) sepia(73%) saturate(2578%) hue-rotate(226deg) brightness(100%) contrast(101%)'
                  : 'brightness(0) saturate(100%) invert(69%) sepia(10%) saturate(379%) hue-rotate(182deg) brightness(89%) contrast(87%)'
              }}
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Status Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isOn ? 1 : 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="flex items-center gap-2"
      >
        {isOn && (
          <>
            <motion.div
              className="w-2 h-2 rounded-full bg-[#5CE1E6]"
              animate={{
                boxShadow: [
                  "0 0 4px #5CE1E6",
                  "0 0 12px #5CE1E6",
                  "0 0 4px #5CE1E6",
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <p className="text-[#5CE1E6] text-sm font-medium">
              Privacy Shield Activated
            </p>
          </>
        )}
      </motion.div>

      {/* Particle burst on toggle */}
      {isOn && (
        <>
          {/* Particle sparks */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`spark-${i}`}
              className="absolute w-2 h-2 rounded-full bg-[#5CE1E6]"
              style={{
                left: "50%",
                top: "50%",
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
                x: Math.cos((i / 12) * Math.PI * 2) * 60,
                y: Math.sin((i / 12) * Math.PI * 2) * 60,
              }}
              transition={{
                duration: 1.2,
                ease: [0.23, 0.78, 0.43, 1],
              }}
            />
          ))}

          {/* Expanding ring waves */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={`ring-${i}`}
              className="absolute rounded-full border-2 border-[#5CE1E6]"
              style={{
                left: "50%",
                top: "50%",
                translateX: "-50%",
                translateY: "-50%",
              }}
              initial={{
                width: 32,
                height: 32,
                opacity: 0.8,
              }}
              animate={{
                width: 200,
                height: 200,
                opacity: 0,
              }}
              transition={{
                duration: 1.8,
                delay: i * 0.2,
                ease: [0.23, 0.78, 0.43, 1],
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}
