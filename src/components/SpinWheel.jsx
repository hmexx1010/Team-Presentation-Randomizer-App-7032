import React from 'react';
import { motion } from 'framer-motion';

const SpinWheel = ({ presenters, isSpinning }) => {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-orange-500'
  ];

  const segmentAngle = 360 / presenters.length;

  return (
    <motion.div
      className="absolute inset-0 w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden"
      animate={isSpinning ? { rotate: 1440 } : { rotate: 0 }}
      transition={{ duration: 3, ease: "easeOut" }}
      style={{ zIndex: -1 }}
    >
      {presenters.map((presenter, index) => (
        <div
          key={presenter}
          className={`absolute w-full h-full ${colors[index % colors.length]} opacity-80`}
          style={{
            clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((segmentAngle * (index + 1) - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((segmentAngle * (index + 1) - 90) * Math.PI / 180)}%, ${50 + 50 * Math.cos((segmentAngle * index - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((segmentAngle * index - 90) * Math.PI / 180)}%)`,
          }}
        >
          <div
            className="absolute text-white text-xs font-bold"
            style={{
              top: '20%',
              left: '50%',
              transform: `translate(-50%, -50%) rotate(${segmentAngle * index + segmentAngle / 2}deg)`,
            }}
          >
            {presenter}
          </div>
        </div>
      ))}
    </motion.div>
  );
};

export default SpinWheel;