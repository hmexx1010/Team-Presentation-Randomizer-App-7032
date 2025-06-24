import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Confetti = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: -10,
      color: ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'][Math.floor(Math.random() * 5)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      velocityX: (Math.random() - 0.5) * 4,
      velocityY: Math.random() * 3 + 2,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            backgroundColor: particle.color,
            width: particle.size,
            height: particle.size,
            borderRadius: '50%',
          }}
          initial={{
            x: particle.x,
            y: particle.y,
            rotate: particle.rotation,
          }}
          animate={{
            x: particle.x + particle.velocityX * 100,
            y: window.innerHeight + 100,
            rotate: particle.rotation + 720,
          }}
          transition={{
            duration: 3,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;