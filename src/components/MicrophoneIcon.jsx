import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMic } = FiIcons;

const MicrophoneIcon = ({ isSpinning }) => {
  return (
    <motion.div
      className="relative"
      animate={isSpinning ? { rotate: 1440 } : { rotate: 0 }}
      transition={{ 
        duration: isSpinning ? 3 : 0.5, 
        ease: isSpinning ? "easeOut" : "easeInOut" 
      }}
    >
      <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-2xl">
        <SafeIcon 
          icon={FiMic} 
          className="w-16 h-16 md:w-20 md:h-20 text-white" 
          aria-hidden="true" 
        />
      </div>
      
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 w-32 h-32 md:w-40 md:h-40 bg-primary-400 rounded-full opacity-30 blur-lg"
        animate={isSpinning ? { scale: [1, 1.2, 1] } : { scale: 1 }}
        transition={{ 
          duration: 2, 
          repeat: isSpinning ? Infinity : 0,
          ease: "easeInOut" 
        }}
      />
    </motion.div>
  );
};

export default MicrophoneIcon;