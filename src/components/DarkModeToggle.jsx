import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiSun, FiMoon } = FiIcons;

const DarkModeToggle = ({ isDarkMode, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDarkMode ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <SafeIcon 
          icon={isDarkMode ? FiSun : FiMoon} 
          className="w-6 h-6 text-gray-800 dark:text-white" 
        />
      </motion.div>
    </button>
  );
};

export default DarkModeToggle;