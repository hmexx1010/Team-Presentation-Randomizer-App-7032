import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiTrendingUp, FiUsers, FiCalendar, FiClock, FiAward, FiRefreshCw, FiCheck, FiX, FiInfo, FiTrash2, FiAlertTriangle } = FiIcons;

const StatsDashboard = ({ statistics = {}, loading = false, teamMembers = [], onClearStatistics }) => {
  const [selectedPresentation, setSelectedPresentation] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Ensure we have default values for everything to prevent crashes
  const safeStats = {
    presentationCounts: {},
    skippedCounts: {},
    recentPresentations: [],
    totalPresentations: 0,
    lastPresentation: null,
    lastPresenter: null,
    ...statistics
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <SafeIcon icon={FiRefreshCw} className="w-8 h-8 text-primary-600" />
        </motion.div>
        <span className="ml-2 text-gray-600 dark:text-gray-300">Loading statistics...</span>
      </div>
    );
  }

  // Create safe array of team members with presentation data
  const chartData = teamMembers.map(member => ({
    name: member,
    presentations: safeStats.presentationCounts[member] || 0,
    skipped: safeStats.skippedCounts[member] || 0
  }));

  const handlePresentationClick = (presentation) => {
    setSelectedPresentation(presentation);
  };

  const closeDetails = () => {
    setSelectedPresentation(null);
  };

  const handleClearClick = () => {
    setShowClearConfirm(true);
  };

  const confirmClear = () => {
    onClearStatistics();
    setShowClearConfirm(false);
  };

  const cancelClear = () => {
    setShowClearConfirm(false);
  };

  // Check if there's any data to clear
  const hasData = safeStats.totalPresentations > 0 || 
                  (safeStats.recentPresentations && safeStats.recentPresentations.length > 0);

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Presentations</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">{safeStats.totalPresentations || 0}</p>
            </div>
            <SafeIcon icon={FiTrendingUp} className="w-8 h-8 text-primary-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Presenters</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">
                {Object.keys(safeStats.presentationCounts || {}).length}
              </p>
            </div>
            <SafeIcon icon={FiUsers} className="w-8 h-8 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Last Presenter</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">
                {safeStats.lastPresenter || "None"}
              </p>
            </div>
            <SafeIcon icon={FiClock} className="w-8 h-8 text-yellow-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Last Presentation</p>
              <p className="text-lg font-bold text-gray-800 dark:text-white">
                {safeStats.lastPresentation ? new Date(safeStats.lastPresentation).toLocaleDateString() : 'None'}
              </p>
            </div>
            <SafeIcon icon={FiCalendar} className="w-8 h-8 text-purple-600" />
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
      >
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
          <SafeIcon icon={FiClock} className="mr-2" />
          Recent Presentations
        </h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {Array.isArray(safeStats.recentPresentations) && safeStats.recentPresentations.length > 0 ? (
            safeStats.recentPresentations.slice(0, 10).map((presentation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  presentation.skipped
                    ? 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500'
                    : presentation.accepted
                    ? 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500'
                    : 'bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500'
                } ${(presentation.skipped && presentation.acceptance_reason) ? 'cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/30' : ''}`}
                onClick={() => {
                  if (presentation.skipped && presentation.acceptance_reason) {
                    handlePresentationClick(presentation);
                  }
                }}
              >
                <div className="flex items-center space-x-3">
                  <SafeIcon
                    icon={presentation.skipped ? FiX : presentation.accepted ? FiCheck : FiClock}
                    className={`w-5 h-5 ${
                      presentation.skipped ? 'text-red-600' : presentation.accepted ? 'text-green-600' : 'text-yellow-600'
                    }`}
                  />
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {presentation.presenter || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {presentation.skipped
                        ? `Skipped${presentation.acceptance_reason ? ' (click for details)' : ''}`
                        : presentation.accepted
                        ? `Presented${presentation.acceptance_reason ? ` - "${presentation.acceptance_reason}"` : ''}`
                        : 'Pending'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {presentation.presented_at ? new Date(presentation.presented_at).toLocaleDateString() : 'Unknown date'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {presentation.presented_at ? new Date(presentation.presented_at).toLocaleTimeString() : ''}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              No presentation history available
            </div>
          )}
        </div>
      </motion.div>

      {/* Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
      >
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
          <SafeIcon icon={FiAward} className="mr-2" />
          Presentation Leaderboard
        </h3>
        <div className="space-y-2">
          {chartData
            .sort((a, b) => b.presentations - a.presentations)
            .map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0
                        ? 'bg-yellow-500'
                        : index === 1
                        ? 'bg-gray-400'
                        : index === 2
                        ? 'bg-orange-500'
                        : 'bg-gray-600'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-800 dark:text-white">
                    {member.name}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-green-600 font-semibold">
                    {member.presentations} presentations
                  </span>
                  {member.skipped > 0 && (
                    <span className="text-red-600 text-sm">
                      {member.skipped} skipped
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
        </div>
      </motion.div>

      {/* Clear Statistics Button - Only show if there's data to clear */}
      {hasData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-end"
        >
          <motion.button
            onClick={handleClearClick}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-red-600 dark:text-red-400 rounded-lg flex items-center space-x-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-400 dark:focus:ring-red-500"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <SafeIcon icon={FiTrash2} className="w-4 h-4" />
            <span>Clear All Statistics</span>
          </motion.button>
        </motion.div>
      )}

      {/* Skip Reason Detail Modal */}
      <AnimatePresence>
        {selectedPresentation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-lg w-full shadow-2xl"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  <SafeIcon icon={FiInfo} className="w-8 h-8 text-blue-500 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Skip Reason</h2>
                </div>
                <button 
                  onClick={closeDetails}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                >
                  <SafeIcon icon={FiX} className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Presenter</div>
                <p className="text-xl font-medium text-gray-800 dark:text-white">
                  {selectedPresentation.presenter}
                </p>
              </div>

              <div className="mb-6">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Date</div>
                <p className="text-gray-800 dark:text-white">
                  {new Date(selectedPresentation.presented_at).toLocaleString()}
                </p>
              </div>

              <div className="mb-8">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Reason for skipping</div>
                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-gray-800 dark:text-white">
                    {selectedPresentation.acceptance_reason || "No reason provided"}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <motion.button
                  onClick={closeDetails}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Clear Statistics Confirmation Modal */}
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-center mb-6 text-red-500">
                <SafeIcon icon={FiAlertTriangle} className="w-16 h-16" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 text-center">
                Clear All Statistics?
              </h2>
              
              <p className="text-gray-600 dark:text-gray-300 mb-8 text-center">
                This will permanently delete all presentation history and statistics. This action cannot be undone.
              </p>
              
              <div className="flex justify-center space-x-4">
                <motion.button
                  onClick={cancelClear}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                
                <motion.button
                  onClick={confirmClear}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Yes, Clear All
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StatsDashboard;