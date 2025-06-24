import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMic, FiLoader } = FiIcons;

const ResultDisplay = ({ presenter, reason, isLoadingReason }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mt-12 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center max-w-2xl mx-auto"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="mb-6"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <SafeIcon icon={FiMic} className="w-10 h-10 text-white" />
        </div>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4"
      >
        {presenter}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-xl text-primary-600 dark:text-primary-400 font-semibold mb-6"
      >
        You're up next! 🎤
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6"
      >
        {isLoadingReason ? (
          <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-300">
            <SafeIcon icon={FiLoader} className="w-5 h-5 animate-spin" />
            <span>Generating your mic-drop reason...</span>
          </div>
        ) : (
          <p className="text-lg text-gray-700 dark:text-gray-200 italic">
            "{reason}"
          </p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 text-sm text-gray-500 dark:text-gray-400"
      >
        🎯 Selected by the fairness algorithm
      </motion.div>
    </motion.div>
  );
};

export default ResultDisplay;