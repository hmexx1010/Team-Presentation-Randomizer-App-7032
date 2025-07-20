import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiRefreshCw, FiSkipForward, FiUsers, FiCheck, FiInfo } = FiIcons;

const ControlPanel = ({ availablePresenters, usedPresenters, onReset, onSkip, isComplete }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        Control Panel
      </h2>

      {/* Status */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-300">Status:</span>
          <span className={`font-semibold ${isComplete ? 'text-green-600' : 'text-primary-600'}`}>
            {isComplete ? 'Round Complete!' : `${availablePresenters.length} remaining`}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${(usedPresenters.length / (usedPresenters.length + availablePresenters.length)) * 100}%`
            }}
          />
        </div>
      </div>

      {/* Available Presenters */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
          <SafeIcon icon={FiUsers} className="mr-2" />
          Available ({availablePresenters.length})
        </h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {availablePresenters.map((presenter) => (
            <div
              key={presenter}
              className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3"
            >
              <span className="text-gray-800 dark:text-white font-medium">
                {presenter}
              </span>
              <button
                onClick={() => onSkip(presenter)}
                className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300 rounded"
                aria-label={`Skip ${presenter}`}
                title={`Skip ${presenter}`}
              >
                <SafeIcon icon={FiSkipForward} className="w-4 h-4" />
              </button>
            </div>
          ))}
          {availablePresenters.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No presenters available
            </p>
          )}
        </div>
      </div>

      {/* Used Presenters */}
      {usedPresenters.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
            <SafeIcon icon={FiCheck} className="mr-2" />
            Completed ({usedPresenters.length})
          </h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {usedPresenters.map((presenter) => (
              <div
                key={presenter}
                className="flex items-center bg-green-50 dark:bg-green-900/20 rounded-lg p-3"
              >
                <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-gray-800 dark:text-white font-medium">
                  {presenter}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reset Button */}
      <motion.button
        onClick={onReset}
        className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center transition-colors focus:outline-none focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-label="Reset presenter rotation"
      >
        <SafeIcon icon={FiRefreshCw} className="mr-2" />
        Reset Rotation
      </motion.button>
    </div>
  );
};

export default ControlPanel;