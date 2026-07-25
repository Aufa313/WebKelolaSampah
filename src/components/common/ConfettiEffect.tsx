import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  velocity: { x: number; y: number };
}

export default function ConfettiEffect({ active = false }: { active?: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    const colors = ["#008444", "#10B981", "#3B82F6", "#F59E0B", "#EC4899", "#8B5CF6"];
    const newParticles: Particle[] = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage
      y: -10,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 6,
      rotation: Math.random() * 360,
      velocity: {
        x: (Math.random() - 0.5) * 40,
        y: Math.random() * 50 + 40,
      },
    }));

    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
    }, 3500);

    return () => clearTimeout(timer);
  }, [active]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            top: "10%",
            left: `${p.x}%`,
            opacity: 1,
            scale: 1,
            rotate: p.rotation,
          }}
          animate={{
            top: "110%",
            left: `${p.x + p.velocity.x}%`,
            opacity: [1, 1, 0],
            rotate: p.rotation + 720,
          }}
          transition={{
            duration: 2.5 + Math.random(),
            ease: "easeOut",
          }}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size * (Math.random() > 0.5 ? 1 : 1.8),
            backgroundColor: p.color,
            borderRadius: p.size > 10 ? "50%" : "2px",
          }}
        />
      ))}
    </div>
  );
}
