import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export function NebulaBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Generate particles
    const newParticles: Particle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 10 + 8,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Layer A - Far nebula (slow drift) */}
      <motion.div
        className="absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(circle at 30% 40%, rgba(108, 99, 255, 0.15) 0%, transparent 50%),
                       radial-gradient(circle at 70% 60%, rgba(92, 225, 230, 0.12) 0%, transparent 50%)`,
        }}
        animate={{
          x: [0, 10, -5, -10, 0],
          y: [0, -8, 10, -5, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      />

      {/* Layer B - Mid nebula (scale + opacity wobble) */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, rgba(108, 99, 255, 0.08) 0%, transparent 60%)`,
        }}
        animate={{
          scale: [1, 1.05, 0.98, 1],
          opacity: [0.6, 0.8, 0.5, 0.6],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      />

      {/* Layer C - Particles with parallax */}
      <motion.div
        className="absolute inset-0"
        animate={{
          x: mousePosition.x * 0.5,
          y: mousePosition.y * 0.5,
        }}
        transition={{
          type: "spring",
          stiffness: 50,
          damping: 20,
        }}
      >
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-white/30"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              boxShadow: `0 0 ${particle.size * 2}px rgba(92, 225, 230, 0.6)`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          />
        ))}
      </motion.div>

      {/* Gradient overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, transparent 0%, rgba(13, 13, 13, 0.4) 100%)`,
        }}
      />
    </div>
  );
}
