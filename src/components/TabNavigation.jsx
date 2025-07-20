import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMic, FiBarChart3 } = FiIcons;

const TabNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'selector', label: 'Mic Selector', icon: FiMic },
    { id: 'statistics', label: 'Statistics', icon: FiBarChart3 }
  ];

  return (
    <div className="flex justify-center mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative px-6 py-3 rounded-md font-medium transition-all duration-200 flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary-600 rounded-md"
                  initial={false}
                  transition={{ duration: 0.2 }}
                />
              )}
              <SafeIcon icon={tab.icon} className="w-5 h-5 relative z-10" />
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;