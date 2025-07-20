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
      transition={{ duration: isSpinning ? 3 : 0.5, ease: isSpinning ? "easeOut" : "easeInOut" }}
    >
      <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl">
        <SafeIcon icon={FiMic} className="w-16 h-16 md:w-20 md:h-20 text-white" aria-hidden="true" />
      </div>

      {/* Enhanced glow effects */}
      <motion.div
        className="absolute inset-0 w-32 h-32 md:w-40 md:h-40 bg-purple-400 rounded-full opacity-40 blur-lg"
        animate={isSpinning ? { scale: [1, 1.3, 1], opacity: [0.4, 0.6, 0.4] } : { scale: 1, opacity: 0.4 }}
        transition={{ duration: 2, repeat: isSpinning ? Infinity : 0, ease: "easeInOut" }}
      />
      
      <motion.div
        className="absolute inset-0 w-32 h-32 md:w-40 md:h-40 bg-blue-400 rounded-full opacity-20 blur-2xl"
        animate={isSpinning ? { scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] } : { scale: 1, opacity: 0.2 }}
        transition={{ duration: 3, repeat: isSpinning ? Infinity : 0, ease: "easeInOut", delay: 0.5 }}
      />

      {/* Sparkle effects */}
      {isSpinning && (
        <>
          <motion.div
            className="absolute top-2 right-2 w-2 h-2 bg-yellow-300 rounded-full"
            animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div
            className="absolute bottom-4 left-4 w-3 h-3 bg-pink-300 rounded-full"
            animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0.8 }}
          />
          <motion.div
            className="absolute top-8 left-2 w-1.5 h-1.5 bg-green-300 rounded-full"
            animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: 1.2 }}
          />
        </>
      )}
    </motion.div>
  );
};

export default MicrophoneIcon;