import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Confetti = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];
    const shapes = ['circle', 'square', 'triangle'];
    
    const newParticles = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: -10,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      size: Math.random() * 12 + 6,
      rotation: Math.random() * 360,
      velocityX: (Math.random() - 0.5) * 6,
      velocityY: Math.random() * 4 + 3,
      rotationSpeed: (Math.random() - 0.5) * 720,
    }));

    setParticles(newParticles);
  }, []);

  const getShapeStyles = (particle) => {
    const baseStyle = {
      backgroundColor: particle.color,
      width: particle.size,
      height: particle.size,
    };

    switch (particle.shape) {
      case 'circle':
        return { ...baseStyle, borderRadius: '50%' };
      case 'square':
        return { ...baseStyle, borderRadius: '2px' };
      case 'triangle':
        return {
          width: 0,
          height: 0,
          backgroundColor: 'transparent',
          borderLeft: `${particle.size / 2}px solid transparent`,
          borderRight: `${particle.size / 2}px solid transparent`,
          borderBottom: `${particle.size}px solid ${particle.color}`,
        };
      default:
        return baseStyle;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={getShapeStyles(particle)}
          initial={{
            x: particle.x,
            y: particle.y,
            rotate: particle.rotation,
          }}
          animate={{
            x: particle.x + particle.velocityX * 150,
            y: window.innerHeight + 100,
            rotate: particle.rotation + particle.rotationSpeed,
          }}
          transition={{
            duration: 4,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;